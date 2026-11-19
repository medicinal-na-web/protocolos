// gerar-formula — a visitadora pede pelo portal uma fórmula avulsa ao motor Nexus.
//
// Fluxo (roda em segundo plano; o portal acompanha pelo status da solicitação):
//  1. IA escolhe as categorias terapêuticas do objetivo (lista oficial do banco de ativos).
//  2. Banco de ativos devolve os candidatos do HISTÓRICO: ativos FGTS S/A/B dessas categorias com
//     registro na forma farmacêutica, dose praticada (p25/mediana/p75) e associações reais entre eles.
//  3. IA monta a fórmula (NAF + BAC) só com esses candidatos, seguindo as regras ativas do motor.
//  4. Checagens locais + validate_protocolo() oficial. FAIL ou ALERTA => a IA corrige (até 3 tentativas).
//  5. Aprovada em todas as regras => entregue na área do prescritor (presa ao CRM). Senão => "não gerada".
//
// Segredos: ANTHROPIC_API_KEY (Edge Function secret). Acesso ao banco de ativos vem de public.ia_config()
// (Vault do nexusPrescricao). SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY são injetados pelo Supabase.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const MODELO = "claude-opus-5-5";
const MAX_TENTATIVAS = 3;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});
const anthropic = new Anthropic(); // lê ANTHROPIC_API_KEY

type Json = Record<string, unknown>;
type Candidato = {
  cdpro: number; nome: string; marca: string | null; tier: string; tipo: string | null;
  indicacao_primaria: boolean; categorias: number[]; indicacoes: string; contraindicacoes: string;
  historico: { formulas: number; dose_p25: number; dose_mediana: number; dose_p75: number; unidade: string; ultima: string };
};
type ItemIA = { cdpro: number; camada: "NAF" | "BAC"; dose: number; unidade: string; racional: string };
type FormulaIA = {
  viavel: boolean; motivo_inviavel: string; nome: string; ativos: ItemIA[]; posologia: string; observacoes: string;
};

function resp(body: Json, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

async function rpcLocal(fn: string, args: Json) {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new Error(`${fn}: ${error.message}`);
  return data;
}

async function rpcAtivos(cfg: Json, fn: string, args: Json) {
  const r = await fetch(`${cfg.ativos_url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: String(cfg.ativos_key), "Content-Type": "application/json" },
    body: JSON.stringify({ p_token: cfg.ativos_token, ...args }),
  });
  if (!r.ok) throw new Error(`banco de ativos ${fn} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return await r.json();
}

// Uma chamada com saída JSON garantida pelo schema (structured outputs).
async function chamarIA(system: Anthropic.TextBlockParam[], user: string, schema: Json, effort: "low" | "medium" | "high") {
  const r = await anthropic.messages.create({
    model: MODELO,
    max_tokens: 16000,
    system,
    output_config: { effort, format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: user }],
  } as Anthropic.MessageCreateParamsNonStreaming);
  if (r.stop_reason === "refusal") throw new Error("a IA recusou a solicitação");
  if (r.stop_reason === "max_tokens") throw new Error("resposta da IA truncada (max_tokens)");
  const txt = r.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  return JSON.parse(txt);
}

const SCHEMA_CATEGORIAS = {
  type: "object",
  additionalProperties: false,
  required: ["categorias", "entendimento"],
  properties: {
    categorias: { type: "array", items: { type: "integer" } },
    entendimento: { type: "string" },
  },
};

const SCHEMA_FORMULA = {
  type: "object",
  additionalProperties: false,
  required: ["viavel", "motivo_inviavel", "nome", "ativos", "posologia", "observacoes"],
  properties: {
    viavel: { type: "boolean" },
    motivo_inviavel: { type: "string" },
    nome: { type: "string" },
    ativos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["cdpro", "camada", "dose", "unidade", "racional"],
        properties: {
          cdpro: { type: "integer" },
          camada: { type: "string", enum: ["NAF", "BAC"] },
          dose: { type: "number" },
          unidade: { type: "string" },
          racional: { type: "string" },
        },
      },
    },
    posologia: { type: "string" },
    observacoes: { type: "string" },
  },
};

function doseMg(dose: number, unidade: string): number | null {
  const u = unidade.trim().toLowerCase();
  if (u === "mg") return dose;
  if (u === "g") return dose * 1000;
  if (u === "mcg" || u === "µg" || u === "ug") return dose / 1000;
  return null;
}

// Checagens rápidas antes do motor: candidatos, âncoras BAC-01, duplicatas e limite da forma.
function checagemLocal(f: FormulaIA, cand: Map<number, Candidato>, assoc: Set<string>, forma: Json): string[] {
  const erros: string[] = [];
  if (!f.ativos.length) erros.push("A fórmula está vazia.");
  const naf = f.ativos.filter((a) => a.camada === "NAF").map((a) => a.cdpro);
  if (!naf.length) erros.push("Nenhum ativo na camada NAF (núcleo).");
  const vistos = new Set<number>();
  for (const a of f.ativos) {
    if (!cand.has(a.cdpro)) erros.push(`cdpro ${a.cdpro} não está na lista de candidatos do histórico — use só os candidatos.`);
    if (vistos.has(a.cdpro)) erros.push(`cdpro ${a.cdpro} repetido.`);
    vistos.add(a.cdpro);
    if (!(a.dose > 0)) erros.push(`cdpro ${a.cdpro}: dose inválida.`);
    if (a.camada === "BAC" && !naf.some((n) => assoc.has(`${n}-${a.cdpro}`) || assoc.has(`${a.cdpro}-${n}`))) {
      erros.push(`cdpro ${a.cdpro} (BAC) não tem associação registrada com nenhum NAF nesta forma — viola BAC-01.`);
    }
  }
  const limite = Number(forma.limite_soma ?? 0);
  if (forma.regra_soma === "GER07_2000MG" && limite > 0) {
    const soma = f.ativos.reduce((s, a) => s + (doseMg(a.dose, a.unidade) ?? 0), 0);
    if (soma > limite) erros.push(`Soma das doses = ${soma} mg, acima de ${limite} mg por cápsula (GER-07). Reduza ou retire ativos.`);
  }
  if (forma.regra_soma === "VEICULO_PCT" && limite > 0) {
    const soma = f.ativos.reduce((s, a) => s + (a.unidade.trim() === "%" ? a.dose : 0), 0);
    if (soma > limite) erros.push(`Soma dos ativos = ${soma}%, acima de ${limite}% do veículo.`);
  }
  return erros;
}

async function processar(s: Json, forma: Json) {
  const id = String(s.id);
  const registrar = (p: Json) => rpcLocal("ia_solicitacao_registrar", { p_id: id, p });
  try {
    const cfg = await rpcLocal("ia_config", {});
    const base = await rpcAtivos(cfg, "nexus_ia_base", {});
    const tp = Number(s.tpformafarma);
    const unidadeForma = String(forma.unidade_dose ?? "mg");

    // ---------- 1. Categorias do objetivo ----------
    const sysCat: Anthropic.TextBlockParam[] = [{
      type: "text",
      cache_control: { type: "ephemeral" },
      text:
        "Você classifica pedidos de fórmulas manipuladas da Farmácia Medicinal nas categorias terapêuticas do banco de ativos.\n" +
        "Escolha de 1 a 4 categorias (pelo id) que melhor representam o objetivo terapêutico. Use só ids da lista.\n" +
        "Em 'entendimento', resuma em uma frase o que foi pedido.\n\nCategorias:\n" +
        (base.categorias as { id: number; nome: string }[]).map((c) => `${c.id}: ${c.nome}`).join("\n"),
    }];
    const cat = await chamarIA(sysCat,
      `Objetivo: ${s.objetivo}\nForma farmacêutica: ${forma.rotulo}\nRestrições: ${s.restricoes || "nenhuma"}\nObservações: ${s.observacoes || "nenhuma"}`,
      SCHEMA_CATEGORIAS, "low");
    const idsValidos = new Set((base.categorias as { id: number }[]).map((c) => c.id));
    const categorias = (cat.categorias as number[]).filter((c) => idsValidos.has(c)).slice(0, 4);
    if (!categorias.length) {
      await registrar({ status: "nao_gerada", motivo: "Não encontrei categoria terapêutica no banco de ativos para esse objetivo. Descreva o objetivo de outra forma.", evento: { etapa: "categorias", resultado: cat } });
      return;
    }
    await registrar({ categorias, modelo: MODELO, evento: { etapa: "categorias", categorias, entendimento: cat.entendimento } });

    // ---------- 2. Candidatos do histórico ----------
    const ctx = await rpcAtivos(cfg, "nexus_ia_candidatos", { p_categorias: categorias, p_tp: tp, p_limite: 80 });
    const candidatos = ctx.candidatos as Candidato[];
    if (candidatos.length < 2) {
      await registrar({ status: "nao_gerada", motivo: `O histórico não tem ativos suficientes dessas categorias em ${forma.rotulo}. Tente outra forma farmacêutica.`, evento: { etapa: "candidatos", n: candidatos.length } });
      return;
    }
    const cand = new Map(candidatos.map((c) => [c.cdpro, c]));
    const assocLista = ctx.associacoes as { a: number; b: number; vezes: number }[];
    const assoc = new Set(assocLista.map((x) => `${x.a}-${x.b}`));

    // ---------- 3/4. Montagem + validação com correção ----------
    const regras = (base.regras as Json[]).map((r) =>
      `- ${r.codigo} [${r.camada}] ${r.categoria} (se falhar: ${r.acao_se_falhar}): ${r.descricao}`).join("\n");
    const sysFormula: Anthropic.TextBlockParam[] = [{
      type: "text",
      cache_control: { type: "ephemeral" },
      text:
        "Você é o motor Nexus da Farmácia Medicinal (manipulação). Monta UMA fórmula avulsa para um prescritor, " +
        "a pedido da visitadora, baseada exclusivamente no histórico real de prescrições da farmácia.\n\n" +
        "Regras ativas do motor (obrigatórias):\n" + regras + "\n\n" +
        "Como montar:\n" +
        "- Use SOMENTE ativos da lista de candidatos (pelo cdpro). Nunca invente ativo.\n" +
        "- NAF = núcleo (1 a 3 ativos com indicação primária no objetivo). BAC = complementares; cada BAC precisa ter associação registrada (lista de associações) com pelo menos um NAF.\n" +
        "- Doses: dentro da faixa praticada no histórico (p25 a p75, preferindo a mediana), na unidade do histórico.\n" +
        "- Respeite as restrições informadas e as contraindicações dos ativos. Prefira menos ativos bem associados a muitos ativos.\n" +
        "- Se não der para montar com segurança, responda viavel=false e explique em motivo_inviavel (português simples).\n" +
        "- nome: título curto da fórmula. racional: uma frase por ativo. posologia: modo de uso usual para essa forma. Tudo em português do Brasil.",
    }];

    const contexto =
      `Objetivo: ${s.objetivo}\nEntendimento: ${cat.entendimento}\nForma farmacêutica: ${forma.rotulo} (TPFORMAFARMA=${tp}, unidade ${unidadeForma}` +
      (forma.limite_soma ? `, limite da soma: ${forma.limite_soma}${forma.regra_soma === "VEICULO_PCT" ? "%" : " mg"}` : "") + ")\n" +
      `Restrições: ${s.restricoes || "nenhuma"}\nObservações da visitadora: ${s.observacoes || "nenhuma"}\n\n` +
      `Candidatos do histórico (JSON):\n${JSON.stringify(candidatos)}\n\n` +
      `Associações reais entre candidatos nesta forma (a, b, vezes):\n${assocLista.map((x) => `${x.a},${x.b},${x.vezes}`).join("\n")}`;

    let feedback = "";
    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
      const f = await chamarIA(sysFormula,
        contexto + (feedback ? `\n\nA tentativa anterior foi REPROVADA. Corrija estes pontos:\n${feedback}` : ""),
        SCHEMA_FORMULA, "medium") as FormulaIA;

      if (!f.viavel) {
        await registrar({ status: "nao_gerada", tentativas: tentativa, formula: f, motivo: f.motivo_inviavel || "O motor não conseguiu montar uma fórmula segura para esse pedido.", evento: { etapa: "inviavel", tentativa } });
        return;
      }

      let problemas = checagemLocal(f, cand, assoc, forma);
      let validacao: Json[] = [];
      if (!problemas.length) {
        const entrada = {
          categorias_objetivo: categorias,
          tem_sache_ger08: tp === 15,
          formulas: [{ id: "F1", tpformafarma: tp, ativos: f.ativos.map((a) => ({ cdpro: a.cdpro, camada: a.camada, dose_mg: doseMg(a.dose, a.unidade) })) }],
        };
        validacao = await rpcAtivos(cfg, "nexus_ia_validar", { p_input: entrada });
        problemas = validacao.filter((v) => v.status !== "PASS").map((v) =>
          `${v.regra} ${v.status}${v.ativo_cdpro ? ` (cdpro ${v.ativo_cdpro})` : ""}: ${v.mensagem}`);
      }

      await registrar({ tentativas: tentativa, formula: f, validacao, evento: { etapa: "tentativa", tentativa, aprovada: !problemas.length, problemas } });

      if (!problemas.length) {
        const itens = f.ativos.map((a) => ({
          cdpro: a.cdpro, nome: cand.get(a.cdpro)?.nome ?? `cdpro ${a.cdpro}`, marca: cand.get(a.cdpro)?.marca ?? null,
          camada: a.camada, dose: a.dose, unidade: a.unidade, racional: a.racional,
        }));
        await rpcLocal("ia_solicitacao_entregar", {
          p_id: id,
          p_protocolo: {
            nome: f.nome,
            criterio: `nexus_ia: categorias ${categorias.join(",")}; ${tentativa} tentativa(s)`,
            resultado_validacao: { status: "PASS", regras: validacao },
            payload: {
              forma: { tp, rotulo: forma.rotulo },
              formulas: [{ nome: f.nome, forma: { tp, rotulo: forma.rotulo }, itens, posologia: f.posologia, observacoes: f.observacoes }],
              origem: { tipo: "nexus_ia:visitadora", solicitacao: id, modelo: MODELO, categorias },
            },
          },
        });
        return;
      }
      feedback = problemas.map((p) => `- ${p}`).join("\n");
    }

    await registrar({ status: "nao_gerada", motivo: `Depois de ${MAX_TENTATIVAS} tentativas a fórmula ainda não passou em todas as regras do Nexus.`, evento: { etapa: "esgotou" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("gerar-formula", id, msg);
    await registrar({ status: "erro", motivo: "Falha técnica ao gerar. Tente novamente em instantes.", evento: { etapa: "erro", erro: msg.slice(0, 500) } }).catch(() => {});
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return resp({ ok: false, motivo: "metodo" }, 405);
  try {
    const { id } = await req.json().catch(() => ({}));
    if (!id) return resp({ ok: false, motivo: "sem_id" }, 400);
    if (!Deno.env.get("ANTHROPIC_API_KEY")) return resp({ ok: false, motivo: "ia_nao_configurada" }, 500);

    // Quem pode disparar: o próprio usuário logado (portal) ou o despachante do banco (token interno do Vault).
    let userId: string | null = null;
    const interno = req.headers.get("x-interno");
    if (interno) {
      const cfg = await rpcLocal("ia_config", {});
      if (!cfg?.interno_token || interno !== cfg.interno_token) return resp({ ok: false, motivo: "token_interno" }, 401);
    } else {
      const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      const { data: u, error: ue } = await db.auth.getUser(jwt);
      if (ue || !u?.user) return resp({ ok: false, motivo: "nao_autenticado" }, 401);
      userId = u.user.id;
    }

    const ini = await rpcLocal("ia_solicitacao_iniciar", { p_id: id, p_user: userId });
    if (!ini?.ok) return resp(ini ?? { ok: false }, 409);

    // Roda em segundo plano: o portal acompanha pelo status da solicitação.
    EdgeRuntime.waitUntil(processar(ini.solicitacao, ini.forma));
    return resp({ ok: true, status: "gerando" }, 202);
  } catch (e) {
    return resp({ ok: false, motivo: e instanceof Error ? e.message : String(e) }, 500);
  }
});
