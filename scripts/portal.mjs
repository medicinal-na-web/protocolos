// Gera o Portal do Prescritor a partir de todos os protocolos/<slug>/protocolo.yaml
// Saída:
//   saida/portal.html        página standalone (para hospedar, ex.: medicinal.vip)
//   saida/portal-artifact.html  mesmo conteúdo sem <head>/<body> (para publicar como Artifact)
//
// O prescritor abre o portal, busca o protocolo/ativo e copia a fórmula pronta
// para colar no sistema de prescrição.
//
// Uso: node scripts/portal.mjs   (ou npm run portal)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirProtocolos = path.join(raiz, "protocolos");
const dirSaida = path.join(raiz, "saida");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rico = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const semMarcacao = (s = "") => String(s).replace(/\*\*(.+?)\*\*/g, "$1");
const VIA = { IN: "Uso interno", OUT: "Uso externo" };

// Lê os protocolos e extrai as fórmulas na ordem do documento.
function lerProtocolos() {
  return fs
    .readdirSync(dirProtocolos)
    .filter((d) => fs.existsSync(path.join(dirProtocolos, d, "protocolo.yaml")))
    .map((slug) => {
      const p = yaml.load(fs.readFileSync(path.join(dirProtocolos, slug, "protocolo.yaml"), "utf8"));
      const formulas = [];
      for (const pag of p.paginas || []) {
        for (const b of pag) {
          if (!b.formula) continue;
          const f = b.formula;
          formulas.push({
            nome: f.nome,
            subtitulo: f.subtitulo || "",
            via: VIA[f.via] || f.via || "",
            ativos: (f.ativos || []).map((a) => ({ nome: a.nome, dose: a.dose || "" })),
            modo: f.modo_de_uso || "",
          });
        }
      }
      return { slug, titulo: p.titulo, cor: p.cor || {}, qr: p.qr || "", formulas };
    })
    .filter((p) => p.formulas.length)
    .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
}

// Texto que vai para a área de transferência (limpo, pronto para colar).
function textoCopia(prot, f) {
  const linhas = [`${f.nome}${f.via ? " — " + f.via : ""}`];
  for (const a of f.ativos) linhas.push(`${semMarcacao(a.nome)}${a.dose ? "  " + a.dose : ""}`);
  if (f.modo) linhas.push(`Posologia: ${f.modo}`);
  linhas.push(`(${prot.titulo} · Medicinal Farmácia e Manipulação)`);
  return linhas.join("\n");
}

function cardFormula(prot, f, idF) {
  const ativos = f.ativos
    .map(
      (a) =>
        `<li><span class="at-nome">${rico(a.nome)}</span><span class="at-lead"></span><span class="at-dose">${esc(a.dose)}</span></li>`,
    )
    .join("");
  const modo = f.modo ? `<p class="modo"><span>Posologia</span>${esc(f.modo)}</p>` : "";
  return `<article class="formula">
      <header class="f-cab">
        <div>
          <h3>${esc(f.nome)}</h3>
          ${f.subtitulo ? `<p class="f-sub">${esc(f.subtitulo)}</p>` : ""}
        </div>
        <span class="f-via">${esc(f.via)}</span>
      </header>
      <ul class="ativos">${ativos}</ul>
      ${modo}
      <button class="copiar" type="button" data-copia="${esc(textoCopia(prot, f))}" id="copy-${prot.slug}-${idF}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15M4 10.5A1.5 1.5 0 0 1 5.5 9h8A1.5 1.5 0 0 1 15 10.5v8A1.5 1.5 0 0 1 13.5 20h-8A1.5 1.5 0 0 1 4 18.5z"/></svg>
        <span>Copiar fórmula</span>
      </button>
    </article>`;
}

function secaoProtocolo(prot) {
  const cards = prot.formulas.map((f, i) => cardFormula(prot, f, i)).join("\n");
  const busca = [prot.titulo, ...prot.formulas.flatMap((f) => [f.nome, f.subtitulo, ...f.ativos.map((a) => semMarcacao(a.nome))])]
    .join(" ")
    .toLowerCase();
  return `<section class="protocolo" id="${esc(prot.slug)}" data-busca="${esc(busca)}" style="--acc:${esc(prot.cor.escura || "#2A62AC")};--acc2:${esc(prot.cor.clara || "#5b8fd6")}">
      <div class="p-cab">
        <span class="p-tag">Protocolo</span>
        <h2>${esc(prot.titulo)}</h2>
        <p class="p-meta">${prot.formulas.length} ${prot.formulas.length === 1 ? "fórmula" : "fórmulas"}</p>
      </div>
      <div class="grade">${cards}</div>
    </section>`;
}

function render(protocolos) {
  const secoes = protocolos.map(secaoProtocolo).join("\n");
  const totalF = protocolos.reduce((n, p) => n + p.formulas.length, 0);
  const estilo = `
    <style>
      /* Portal do Prescritor — base azul Medicinal, acento por protocolo, cartões de fórmula copiáveis */
      :root{
        --marca:#2A62AC; --marca-esc:#1c4a85;
        --bg:#eef2f7; --sup:#ffffff; --sup-2:#f6f8fb;
        --tinta:#15233a; --tinta-2:#51607a; --linha:#dde4ee;
        --ok:#1f9d62; --acc:#2A62AC; --acc2:#5b8fd6;
        --sombra:0 1px 2px rgba(20,35,58,.06),0 8px 24px rgba(20,35,58,.07);
        --r:16px;
        --disp:"Sora",system-ui,sans-serif; --corpo:"Figtree",system-ui,sans-serif;
        --mono:"JetBrains Mono",ui-monospace,monospace;
      }
      @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
        --bg:#0d1420; --sup:#151e2d; --sup-2:#111a27;
        --tinta:#e9eef6; --tinta-2:#9fb0c7; --linha:#26324a;
        --sombra:0 1px 2px rgba(0,0,0,.3),0 10px 28px rgba(0,0,0,.35);
        color-scheme:dark;
      }}
      :root[data-theme="dark"]{
        --bg:#0d1420; --sup:#151e2d; --sup-2:#111a27;
        --tinta:#e9eef6; --tinta-2:#9fb0c7; --linha:#26324a;
        --sombra:0 1px 2px rgba(0,0,0,.3),0 10px 28px rgba(0,0,0,.35);
        color-scheme:dark;
      }
      *{box-sizing:border-box}
      body{background:var(--bg);color:var(--tinta);font-family:var(--corpo);line-height:1.5;margin:0;
        -webkit-font-smoothing:antialiased}
      .env{padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px))}
      a{color:inherit}
      h1,h2,h3{font-family:var(--disp);text-wrap:balance;margin:0;letter-spacing:-.01em}

      /* Cabeçalho */
      .topo{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:color-mix(in srgb,var(--sup) 88%,transparent);
        backdrop-filter:blur(10px);border-bottom:1px solid var(--linha)}
      body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:21;background:var(--sup)}
      .topo-in{max-width:1120px;margin:0 auto;padding-block:14px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
      .marca{display:flex;align-items:center;gap:11px;min-width:0}
      .marca .ico{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--marca),var(--marca-esc));
        display:grid;place-items:center;flex:none;box-shadow:var(--sombra)}
      .marca .ico svg{width:20px;height:20px;fill:#fff}
      .marca b{font-family:var(--disp);font-weight:700;font-size:16px;letter-spacing:-.02em;display:block;line-height:1.1}
      .marca span{font-size:11px;color:var(--tinta-2);letter-spacing:.14em;text-transform:uppercase}
      .busca{flex:1;min-width:180px;display:flex;align-items:center;gap:9px;background:var(--sup-2);
        border:1px solid var(--linha);border-radius:999px;padding:9px 15px}
      .busca svg{width:17px;height:17px;fill:none;stroke:var(--tinta-2);stroke-width:2;flex:none}
      .busca input{border:0;background:none;color:var(--tinta);font:inherit;font-size:14px;width:100%;outline:none}
      .busca input::placeholder{color:var(--tinta-2)}

      /* Faixa de introdução */
      .intro{max-width:1120px;margin:0 auto;padding-block:30px 10px}
      .intro h1{font-size:clamp(25px,4.2vw,36px);font-weight:700}
      .intro p{color:var(--tinta-2);max-width:60ch;margin:10px 0 0;font-size:15.5px}
      .intro .nums{display:flex;gap:26px;margin-top:20px;flex-wrap:wrap}
      .intro .nums div{display:flex;flex-direction:column}
      .intro .nums b{font-family:var(--disp);font-size:24px;font-variant-numeric:tabular-nums;line-height:1}
      .intro .nums small{color:var(--tinta-2);font-size:12px;letter-spacing:.04em;margin-top:5px;text-transform:uppercase}

      main{max-width:1120px;margin:0 auto;padding-block:16px 64px}
      .vazio{display:none;color:var(--tinta-2);padding:48px 0;text-align:center}

      /* Protocolo */
      .protocolo{margin-top:34px;scroll-margin-top:84px}
      .p-cab{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;padding-bottom:14px;margin-bottom:18px;
        border-bottom:2px solid color-mix(in srgb,var(--acc) 30%,var(--linha))}
      .p-tag{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
        color:#fff;background:linear-gradient(135deg,var(--acc),var(--acc2));padding:4px 10px;border-radius:999px}
      .p-cab h2{font-size:clamp(19px,2.6vw,25px);font-weight:600;color:var(--acc);
        filter:saturate(1.1)}
      :root[data-theme="dark"] .p-cab h2,:root:not([data-theme="light"]) .p-cab h2{color:var(--acc2)}
      .p-meta{color:var(--tinta-2);font-size:13px;font-variant-numeric:tabular-nums;margin-left:auto}

      .grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
      .formula{display:flex;flex-direction:column;background:var(--sup);border:1px solid var(--linha);
        border-top:3px solid var(--acc);border-radius:var(--r);padding:18px 18px 16px;box-shadow:var(--sombra);min-width:0}
      .f-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px}
      .f-cab h3{font-size:17px;font-weight:600;line-height:1.2}
      .f-sub{color:var(--tinta-2);font-size:12.5px;margin:3px 0 0;text-transform:lowercase}
      .f-via{flex:none;font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
        color:var(--acc);background:color-mix(in srgb,var(--acc) 12%,transparent);padding:4px 9px;border-radius:999px;white-space:nowrap}
      :root[data-theme="dark"] .f-via,:root:not([data-theme="light"]) .f-via{color:var(--acc2)}

      .ativos{list-style:none;margin:0;padding:0;font-family:var(--mono);font-size:12.5px}
      .ativos li{display:flex;align-items:baseline;gap:6px;padding:5px 0;border-bottom:1px dashed var(--linha)}
      .ativos li:last-child{border-bottom:0}
      .at-nome{color:var(--tinta)}
      .at-lead{flex:1;border-bottom:1px dotted var(--linha);transform:translateY(-3px)}
      .at-dose{color:var(--tinta-2);font-variant-numeric:tabular-nums;white-space:nowrap}

      .modo{font-size:12.5px;color:var(--tinta-2);margin:13px 0 0;line-height:1.5}
      .modo span{display:block;font-family:var(--disp);font-size:10.5px;font-weight:600;letter-spacing:.1em;
        text-transform:uppercase;color:var(--tinta);margin-bottom:3px}

      .copiar{margin-top:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
        font-family:var(--disp);font-size:13.5px;font-weight:600;color:#fff;cursor:pointer;
        background:linear-gradient(135deg,var(--acc),var(--acc2));border:0;border-radius:11px;padding:11px 14px;
        transition:transform .08s ease,filter .15s ease;width:100%}
      .copiar:hover{filter:brightness(1.07)}
      .copiar:active{transform:translateY(1px)}
      .copiar:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
      .copiar svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:1.8}
      .copiar.ok{background:var(--ok)}

      .rodape{max-width:1120px;margin:0 auto;padding-block:30px 10px;color:var(--tinta-2);font-size:12.5px;
        border-top:1px solid var(--linha);line-height:1.6}
      @media (prefers-reduced-motion:reduce){*{transition:none!important}}
    </style>`;

  const corpo = `
    <header class="topo"><div class="topo-in env">
      <div class="marca">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M3 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2"/><path d="M3 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" opacity=".55"/><path d="M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" opacity=".3"/></svg></span>
        <span><b>Medicinal</b><span>Portal do Prescritor</span></span>
      </div>
      <label class="busca">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
        <input id="q" type="search" placeholder="Buscar protocolo, fórmula ou ativo…" autocomplete="off" aria-label="Buscar">
      </label>
    </div></header>

    <div class="intro env">
      <h1>Fórmulas prontas para prescrever</h1>
      <p>Protocolos da Medicinal com as formulações desenhadas pelo motor NEXUS. Escolha o protocolo, confira a fórmula e copie o texto para colar direto na sua prescrição.</p>
      <div class="nums">
        <div><b>${protocolos.length}</b><small>Protocolos</small></div>
        <div><b>${totalF}</b><small>Fórmulas</small></div>
        <div><b>1 toque</b><small>Copiar e colar</small></div>
      </div>
    </div>

    <main class="env">
      ${secoes}
      <p class="vazio" id="vazio">Nenhuma fórmula encontrada para a busca.</p>
      <p class="rodape">Material técnico destinado exclusivamente à classe prescritora. As doses podem ser ajustadas ao objetivo terapêutico, ao estado clínico e ao perfil do paciente. Não constitui promessa de cura ou tratamento. © Medicinal Farmácia e Manipulação.</p>
    </main>

    <script>
      (function(){
        var q=document.getElementById("q"), vazio=document.getElementById("vazio");
        var secs=[].slice.call(document.querySelectorAll(".protocolo"));
        q.addEventListener("input",function(){
          var t=q.value.trim().toLowerCase(), achou=0;
          secs.forEach(function(s){
            var cards=[].slice.call(s.querySelectorAll(".formula")), visiveis=0;
            cards.forEach(function(c){
              var txt=c.textContent.toLowerCase();
              var ok=!t||txt.indexOf(t)>-1||s.dataset.busca.indexOf(t)>-1;
              c.hidden=!ok; if(ok)visiveis++;
            });
            s.hidden=visiveis===0; if(visiveis)achou+=visiveis;
          });
          vazio.style.display=achou?"none":"block";
        });
        // Deep-link: portalprescritor.medicinalnaweb.com.br/#nad abre no protocolo
        function irParaHash(){
          var h=(location.hash||"").replace("#","");
          if(!h)return; var alvo=document.getElementById(h);
          if(alvo)alvo.scrollIntoView({behavior:"smooth",block:"start"});
        }
        window.addEventListener("hashchange",irParaHash);
        if(location.hash)setTimeout(irParaHash,60);
        document.addEventListener("click",function(e){
          var b=e.target.closest(".copiar"); if(!b)return;
          var txt=b.getAttribute("data-copia"), rotulo=b.querySelector("span");
          function feito(){ b.classList.add("ok"); rotulo.textContent="Copiado!";
            setTimeout(function(){ b.classList.remove("ok"); rotulo.textContent="Copiar fórmula"; },1600); }
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(txt).then(feito).catch(selecionar);
          } else selecionar();
          function selecionar(){
            var ta=document.createElement("textarea"); ta.value=txt;
            ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select();
            try{ document.execCommand("copy"); feito(); }catch(_){ rotulo.textContent="Selecione e copie"; }
            document.body.removeChild(ta);
          }
        });
      })();
    </script>`;

  return { estilo, corpo };
}

const protocolos = lerProtocolos();
const { estilo, corpo } = render(protocolos);

fs.mkdirSync(dirSaida, { recursive: true });

// Standalone (para hospedar)
const standalone = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Portal do Prescritor — Medicinal</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
${estilo}
</head><body>${corpo}</body></html>`;
fs.writeFileSync(path.join(dirSaida, "portal.html"), standalone);

// Conteúdo para publicar como Artifact (sem <head>/<body>; o host adiciona o esqueleto)
const artifact = `<meta name="claude:viewport-fit-sides" content="cover">
<title>Portal do Prescritor</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
${estilo}
${corpo}`;
fs.writeFileSync(path.join(dirSaida, "portal-artifact.html"), artifact);

console.log(`✓ portal: ${protocolos.length} protocolos, ${protocolos.reduce((n, p) => n + p.formulas.length, 0)} fórmulas → saida/portal.html`);
