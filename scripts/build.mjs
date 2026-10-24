// Gera os Guias de Formulações a partir de protocolos/<slug>/protocolo.yaml
// Saída: saida/<slug>.pdf e prévias PNG em saida/<slug>/pagina-N.png
//
// Uso: npm run build            (todos os protocolos)
//      npm run build -- disbiose (só um)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import QRCode from "qrcode";
import { createRequire } from "node:module";

// Playwright pode estar instalado globalmente (NODE_PATH), que o import ESM ignora.
const { chromium } = createRequire(import.meta.url)("playwright");

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirProtocolos = path.join(raiz, "protocolos");
const dirSaida = path.join(raiz, "saida");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// **negrito** → <strong>
const rico = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const dataUri = (arq) => `url("data:image/png;base64,${fs.readFileSync(path.join(raiz, arq)).toString("base64")}")`;

const ICONES = {
  dia: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="var(--sol)"/><g stroke="var(--sol)" stroke-width="2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => `<line x1="12" y1="2.2" x2="12" y2="4.6" transform="rotate(${a} 12 12)"/>`)
    .join("")}</g></svg>`,
  noite: `<svg viewBox="0 0 24 24"><path d="M15.5 3.2a9 9 0 1 0 5.3 13.6A7.5 7.5 0 0 1 15.5 3.2z" fill="none" stroke="var(--lua)" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
};

function mm(v) {
  return typeof v === "number" ? `${v}mm` : v;
}

async function blocoFormula(b, ctx) {
  const periodo = [].concat(b.periodo || []);
  const icones = periodo.map((p) => ICONES[p] || "").join("");
  const ativos = b.ativos
    .map(
      (a) => `<li${a.destaque ? ' class="ativo-destaque"' : ""}>
        <span class="n">${esc(a.nome)}</span><span class="pont"></span><span class="d">${esc(a.dose)}</span></li>`,
    )
    .join("");
  // qr: false esconde o QR (ex.: segundo card da mesma página)
  const linkQr = b.qr === false ? null : b.qr || ctx.qr;
  const qr = linkQr
    ? `<div class="qr-box">Copie a<br>fórmula<br>aqui<img src="${await QRCode.toDataURL(linkQr, { margin: 0, width: 400, color: { dark: "#111111" } })}"></div>`
    : "";
  const arte = b.arte
    ? `<img class="arte-lado" src="${ctx.artes}/${esc(b.arte.src)}" style="top:${mm(b.arte.topo ?? 0)};right:${mm(b.arte.direita ?? 0)};width:${mm(b.arte.largura ?? 70)}">`
    : "";
  return `<div class="bloco">
    ${arte}
    <div class="linha-formula">
      <div class="card">
        <div class="pill"><span class="titulos"><b>${esc(b.nome)}</b>${b.subtitulo ? `<small>${esc(b.subtitulo)}</small>` : ""}</span>${icones}</div>
        <div class="via">${esc(b.via)}</div>
        <ul class="ativos">${ativos}</ul>
        <p class="modo"><b>Modo de uso:</b> ${rico(b.modo_de_uso)}</p>
      </div>
      ${qr}
    </div>
  </div>`;
}

// destaques: lista de itens, ou { itens, arte } para ter uma foto ao lado do texto
function blocoDestaques(b, ctx) {
  const itens = (Array.isArray(b) ? b : b.itens)
    .map((d) => `<div class="destaque"><h4>${esc(d.nome)}</h4><p>${rico(d.texto)}</p></div>`)
    .join("");
  const arte = !Array.isArray(b) && b.arte;
  if (!arte) return `<div class="bloco"><div class="destaques">${itens}</div></div>`;
  return `<div class="bloco"><div class="destaques-com-arte">
    <div class="destaques">${itens}</div>
    <img class="arte-destaques${arte.fundir === false ? " sem-mascara" : ""}" src="${ctx.artes}/${esc(arte.src)}" style="width:${mm(arte.largura ?? 55)}">
  </div></div>`;
}

// Imagem de margem a margem que some no branco da página (sem recortes aparentes)
function blocoFaixa(b, ctx) {
  const etiqueta = b.etiqueta
    ? `<div class="etiqueta">${[].concat(b.etiqueta).map((l) => `<span>${esc(l)}</span>`).join("")}</div>`
    : "";
  return `<div class="faixa${b.etiqueta ? " com-etiqueta" : ""}" style="background-image:url('${ctx.artes}/${esc(b.src)}');--altura:${mm(b.altura ?? 55)};background-position:${b.posicao || "center"}">${etiqueta}</div>`;
}

function blocoTexto(b, ctx) {
  const etiqueta = b.etiqueta
    ? `<div class="etiqueta">${[].concat(b.etiqueta).map((l) => `<span>${esc(l)}</span>`).join("")}</div>`
    : "";
  const img = b.imagem
    ? `${etiqueta}<img class="ilustracao" src="${ctx.artes}/${esc(b.imagem.src)}" style="width:${mm(b.imagem.largura ?? 140)}">`
    : etiqueta;
  const paragrafos = [].concat(b.paragrafos || []).map((p) => `<p>${rico(p)}</p>`).join("");
  const antes = b.imagem_depois ? "" : img;
  const depois = b.imagem_depois ? img : "";
  return `<div class="texto">${b.titulo ? `<h3>${esc(b.titulo)}</h3>` : ""}${antes}${paragrafos}${depois}</div>`;
}

const ESPACO = (b) => `<div style="height:${mm(b.altura ?? 6)}"></div>`;

async function renderizar(slug) {
  const dir = path.join(dirProtocolos, slug);
  const p = yaml.load(fs.readFileSync(path.join(dir, "protocolo.yaml"), "utf8"));
  const ctx = { artes: `../protocolos/${slug}/artes`, qr: p.qr };

  const paginas = [];
  paginas.push(`<section class="pagina capa">
    <div class="capa-faixa">
      <div class="sobretitulo">Guia de Formulações</div>
      <h1>${esc(p.titulo)}</h1>
      <div class="selo-branco"></div>
    </div>
    <div class="capa-imagem" style="background-image:url('${ctx.artes}/${esc(p.capa)}');background-position:${p.capa_posicao || "center top"}"></div>
    <div class="capa-logo"></div>
  </section>`);

  for (const pag of p.paginas) {
    const blocos = [];
    for (const b of pag) {
      if (b.formula) blocos.push(await blocoFormula(b.formula, ctx));
      else if (b.destaques) blocos.push(blocoDestaques(b.destaques, ctx));
      else if (b.faixa) blocos.push(blocoFaixa(b.faixa, ctx));
      else if (b.texto) blocos.push(blocoTexto(b.texto, ctx));
      else if (b.espaco !== undefined) blocos.push(ESPACO({ altura: b.espaco }));
      else throw new Error(`${slug}: bloco desconhecido ${JSON.stringify(Object.keys(b))}`);
    }
    paginas.push(`<section class="pagina interna">
      <div class="cabecalho">
        <span class="nome">${esc(p.titulo)}</span>
        <div class="marca"><img src="../marca/logo-azul.png"><span>GUIA DE FORMULAÇÕES</span></div>
      </div>
      <div class="conteudo">${blocos.join("\n")}</div>
      <div class="selo-canto selo-tema"></div>
    </section>`);
  }

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Guia de Formulações — ${esc(p.titulo)}</title>
<link rel="stylesheet" href="../template/guia.css">
<style>:root{--tema-escura:${p.cor.escura};--tema-clara:${p.cor.clara};--mascara-selo:${dataUri("marca/selo.png")};--mascara-logo:${dataUri("marca/logo-mono.png")};}</style>
</head><body>
${paginas.join("\n")}
<script>${fs.readFileSync(path.join(raiz, "template", "conectores.js"), "utf8")}</script>
</body></html>`;
}

async function main() {
  const filtro = process.argv.slice(2);
  const slugs = fs
    .readdirSync(dirProtocolos)
    .filter((d) => fs.existsSync(path.join(dirProtocolos, d, "protocolo.yaml")))
    .filter((d) => !filtro.length || filtro.includes(d));
  if (!slugs.length) throw new Error("Nenhum protocolo encontrado.");

  fs.mkdirSync(dirSaida, { recursive: true });
  const browser = await chromium.launch();
  for (const slug of slugs) {
    const html = await renderizar(slug);
    const arqHtml = path.join(dirSaida, `${slug}.html`);
    fs.writeFileSync(arqHtml, html);

    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
    await page.goto("file://" + arqHtml, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.desenharConectores());

    const avisos = await page.evaluate(() => window.verificarTransbordo());
    for (const a of avisos) console.warn(`  ⚠ ${slug}: ${a}`);

    await page.pdf({ path: path.join(dirSaida, `${slug}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });

    const dirPrev = path.join(dirSaida, slug);
    fs.rmSync(dirPrev, { recursive: true, force: true });
    fs.mkdirSync(dirPrev, { recursive: true });
    const secoes = await page.$$("section.pagina");
    for (let i = 0; i < secoes.length; i++) {
      await secoes[i].screenshot({ path: path.join(dirPrev, `pagina-${i + 1}.png`) });
    }
    await page.close();
    console.log(`✓ ${slug}: ${secoes.length} páginas → saida/${slug}.pdf`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
