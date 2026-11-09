// Sincroniza os protocolos para o Portal do Prescritor (projeto nexusPrescricao).
// Para cada protocolo gera:
//   - formulas (jsonb)      → busca/cópia e lista
//   - capa (URL webp)       → miniatura da lista
//   - guia_html (gzip+b64)  → guia completo, MESMO visual do PDF, leve (descompactado no navegador)
// e as imagens webp em saida/artes/<slug>/ (servidas estáticas, públicas).
//
// Saídas:
//   saida/artes/**                imagens webp para subir em portalprescritor.../artes/
//   saida/sync/<slug>.sql         um UPSERT por protocolo (rodar no projeto nexusPrescricao)
//
// Uso: node scripts/portal-sync.mjs

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { renderizar } from "./build.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirProtocolos = path.join(raiz, "protocolos");
const dirSaida = path.join(raiz, "saida");
// Imagens vão para o repositório (portal/artes) e são servidas pela Edge Function portal-app.
const FN = "https://uahbcelcjmjcljogfilh.supabase.co/functions/v1/portal-app";
const dirArtes = path.join(raiz, "portal", "artes");
const dirSync = path.join(dirSaida, "sync");
const VIA = { IN: "Uso interno", OUT: "Uso externo" };
const semMarcacao = (s = "") => String(s).replace(/\*\*(.+?)\*\*/g, "$1");
const dq = (tag, v) => `$${tag}$${typeof v === "string" ? v : JSON.stringify(v)}$${tag}$`;

function formulasDe(p) {
  const out = [];
  for (const pag of p.paginas || []) {
    for (const b of pag) {
      if (!b.formula) continue;
      const f = b.formula;
      out.push({
        nome: f.nome,
        subtitulo: f.subtitulo || "",
        via: VIA[f.via] || f.via || "",
        ativos: (f.ativos || []).map((a) => ({ nome: semMarcacao(a.nome), dose: a.dose || "" })),
        modo: f.modo_de_uso || "",
      });
    }
  }
  return out;
}

const slugs = fs
  .readdirSync(dirProtocolos)
  .filter((d) => fs.existsSync(path.join(dirProtocolos, d, "protocolo.yaml")))
  .map((slug) => ({ slug, p: yaml.load(fs.readFileSync(path.join(dirProtocolos, slug, "protocolo.yaml"), "utf8")) }))
  .filter((x) => formulasDe(x.p).length)
  .sort((a, b) => a.p.titulo.localeCompare(b.p.titulo, "pt-BR"));

fs.rmSync(dirArtes, { recursive: true, force: true });
fs.mkdirSync(dirSync, { recursive: true });

const resumo = [];
for (let i = 0; i < slugs.length; i++) {
  const { slug, p } = slugs[i];
  const artesBase = `${FN}/img/${slug}`;
  const artesDest = path.join(dirArtes, slug);

  // Guia completo (mesmo visual do PDF), imagens por URL, comprimido para trafegar leve.
  const html = await renderizar(slug, "web", { artesBase, artesDest });
  const guiaGz = zlib.gzipSync(Buffer.from(html, "utf8"), { level: 9 }).toString("base64");

  const capaUrl = `${artesBase}/${path.basename(p.capa, path.extname(p.capa))}.webp`;
  const formulas = formulasDe(p);
  const cor = { escura: p.cor?.escura || "#2A62AC", clara: p.cor?.clara || "#5b8fd6" };

  const destaque = Math.max(1, Math.min(3, parseInt(p.destaque, 10) || 1));
  const novo = p.novo === true;
  const sql = `-- ${p.titulo} (${slug}) — gerado por scripts/portal-sync.mjs
insert into public.portal_protocolo (slug, titulo, cor, ordem, formulas, capa, guia_html, destaque, novo, ativo, atualizado_em) values
  (${dq("s", slug)}, ${dq("t", p.titulo)}, ${dq("c", cor)}::jsonb, ${i + 1},
   ${dq("f", formulas)}::jsonb, ${dq("u", capaUrl)}, ${dq("g", guiaGz)}, ${destaque}, ${novo}, true, now())
on conflict (slug) do update set
  titulo=excluded.titulo, cor=excluded.cor, ordem=excluded.ordem,
  formulas=excluded.formulas, capa=excluded.capa, guia_html=excluded.guia_html,
  atualizado_em=now();
  -- destaque, novo, visibilidade e ativo são geridos no painel de administração: a
  -- sincronização só os define na criação do protocolo (não sobrescreve suas escolhas).
`;
  fs.writeFileSync(path.join(dirSync, `${slug}.sql`), sql);
  resumo.push({ slug, formulas: formulas.length, guiaKB: (guiaGz.length / 1024).toFixed(0) });
}

// Desativa protocolos que saíram do repositório.
fs.writeFileSync(
  path.join(dirSync, "_desativar.sql"),
  `update public.portal_protocolo set ativo=false, atualizado_em=now()\nwhere slug not in (${slugs.map((x) => dq("s", x.slug)).join(", ")});\n`,
);

console.log("✓ portal-sync:");
for (const r of resumo) console.log(`  ${r.slug.padEnd(14)} ${String(r.formulas).padStart(2)} fórmulas · guia ${r.guiaKB} KB (gzip)`);
console.log(`  imagens → ${path.relative(raiz, dirArtes)}/  |  SQL → ${path.relative(raiz, dirSync)}/`);
