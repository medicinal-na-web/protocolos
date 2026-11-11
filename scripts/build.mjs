// Gera os Guias de Formulações a partir de protocolos/<slug>/protocolo.yaml
// Saída: saida/<slug>.pdf e prévias PNG em saida/<slug>/pagina-N.png
//
// Uso: npm run build            (todos os protocolos)
//      npm run build -- disbiose (só um)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import QRCode from "qrcode";
import { createRequire } from "node:module";

// Playwright pode estar instalado globalmente (NODE_PATH), que o import ESM ignora.
const { chromium } = createRequire(import.meta.url)("playwright");

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirProtocolos = path.join(raiz, "protocolos");
const dirSaida = path.join(raiz, "saida");

// ---------- Encurtador Bitly (opcional) ----------
// Se BITLY_TOKEN estiver no ambiente, cada link `qr:` é encurtado via Bitly
// (bit.ly) e o QR passa a apontar para o link curto — assim a farmácia tem
// link de marca e métricas de clique. Os links são guardados em
// template/qr-cache.json (o Bitly devolve o mesmo link para a mesma URL, então
// o cache mantém builds offline e determinísticos). Sem token, usa a URL longa.
const BITLY_TOKEN = process.env.BITLY_TOKEN;
const arqCacheQr = path.join(raiz, "template", "qr-cache.json");
const cacheQr = fs.existsSync(arqCacheQr) ? JSON.parse(fs.readFileSync(arqCacheQr, "utf8")) : {};

async function encurtar(url) {
  if (!url || !BITLY_TOKEN) return url;              // sem token: mantém a URL longa
  if (cacheQr[url]) return cacheQr[url];             // já encurtada antes
  try {
    const r = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: { Authorization: `Bearer ${BITLY_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ long_url: url, domain: "bit.ly" }),
    });
    if (!r.ok) {
      console.warn(`  ⚠ Bitly ${r.status} para ${url} — usando URL longa`);
      return url;
    }
    const curto = (await r.json()).link;
    cacheQr[url] = curto;
    fs.writeFileSync(arqCacheQr, JSON.stringify(cacheQr, null, 2) + "\n");
    return curto;
  } catch (e) {
    console.warn(`  ⚠ Bitly falhou (${e.message}) — usando URL longa`);
    return url;
  }
}

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
  // qr: false esconde o QR (ex.: segundo card da mesma página).
  // No portal (web) o QR é redundante — o prescritor já está dentro dele — então não entra.
  const linkQr = ctx.web || b.qr === false ? null : await encurtar(b.qr || ctx.qr);
  const qr = linkQr
    ? `<div class="qr-box">Copie a<br>fórmula<br>aqui<img src="${await QRCode.toDataURL(linkQr, { margin: 0, width: 400, color: { dark: "#111111" } })}"></div>`
    : "";
  const arte = b.arte
    ? `<img class="arte-lado" src="${ctx.img(b.arte.src)}" style="top:${mm(b.arte.topo ?? 0)};right:${mm(b.arte.direita ?? 0)};width:${mm(b.arte.largura ?? 70)}">`
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
    <img class="arte-destaques${arte.fundir === false ? " sem-mascara" : ""}" src="${ctx.img(arte.src)}" style="width:${mm(arte.largura ?? 55)}">
  </div></div>`;
}

// Imagem de margem a margem que some no branco da página (sem recortes aparentes)
function blocoFaixa(b, ctx) {
  const etiqueta = b.etiqueta
    ? `<div class="etiqueta">${[].concat(b.etiqueta).map((l) => `<span>${esc(l)}</span>`).join("")}</div>`
    : "";
  return `<div class="faixa${b.etiqueta ? " com-etiqueta" : ""}" style="background-image:url('${ctx.img(b.src)}');--altura:${mm(b.altura ?? 55)};background-position:${b.posicao || "center"}">${etiqueta}</div>`;
}

function blocoTexto(b, ctx) {
  const etiqueta = b.etiqueta
    ? `<div class="etiqueta">${[].concat(b.etiqueta).map((l) => `<span>${esc(l)}</span>`).join("")}</div>`
    : "";
  const img = b.imagem
    ? `${etiqueta}<img class="ilustracao" src="${ctx.img(b.imagem.src)}" style="width:${mm(b.imagem.largura ?? 140)}">`
    : etiqueta;
  const paragrafos = [].concat(b.paragrafos || []).map((p) => `<p>${rico(p)}</p>`).join("");
  const antes = b.imagem_depois ? "" : img;
  const depois = b.imagem_depois ? img : "";
  return `<div class="texto">${b.titulo ? `<h3>${esc(b.titulo)}</h3>` : ""}${antes}${paragrafos}${depois}</div>`;
}

const ESPACO = (b) => `<div style="height:${mm(b.altura ?? 6)}"></div>`;

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif" };
const b64 = (arqAbs) => fs.readFileSync(arqAbs).toString("base64");

// Para o guia web: gera uma versão WebP leve da imagem (máx. 950px, recomprimida),
// para a página não pesar. Usa ImageMagick no passo de autoria. Com destino em disco,
// grava o arquivo (servido estático por URL); sem destino, devolve data URI embutido.
let _otimN = 0;
const _cacheOtim = new Map();
function otimizarWebp(arqAbs, outAbs, maxDim = 950, q = 68) {
  execSync(`convert ${JSON.stringify(arqAbs)} -resize "${maxDim}x${maxDim}>" -strip -quality ${q} -define webp:method=6 ${JSON.stringify(outAbs)}`, { stdio: "ignore" });
}
// maxDim menor para máscaras/ícones (silhuetas pequenas na página) — mantém o guia leve.
function imgWebDataUri(arqAbs, maxDim = 950, q = 68) {
  const chave = `${arqAbs}|${maxDim}|${q}`;
  if (_cacheOtim.has(chave)) return _cacheOtim.get(chave);
  const ext = path.extname(arqAbs).toLowerCase();
  let uri;
  try {
    const out = path.join(os.tmpdir(), `guiaweb_${process.pid}_${_otimN++}.webp`);
    otimizarWebp(arqAbs, out, maxDim, q);
    uri = `data:image/webp;base64,${b64(out)}`;
    fs.rmSync(out, { force: true });
  } catch {
    uri = `data:${MIME[ext] || "image/jpeg"};base64,${b64(arqAbs)}`; // sem ImageMagick: usa o original
  }
  _cacheOtim.set(chave, uri);
  return uri;
}
// Para o PDF: embute a imagem otimizada em vez do original em resolução cheia.
// Imagem opaca → JPEG (o Chromium mantém a compressão DCT no PDF → leve).
// Imagem com transparência → PNG redimensionado (preserva o canal alfa).
// Capa e fundos cheios (flatten:true) viram sempre JPEG sobre branco.
function _temAlpha(arqAbs) {
  try {
    return execSync(`identify -format "%[opaque]" ${JSON.stringify(arqAbs)}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim().toLowerCase() === "false";
  } catch { return false; }
}
function imgPdfDataUri(arqAbs, opt = {}) {
  const maxDim = opt.maxDim || 1600, q = opt.q || 84;
  const chave = `pdf|${arqAbs}|${maxDim}|${q}|${opt.flatten ? 1 : 0}`;
  if (_cacheOtim.has(chave)) return _cacheOtim.get(chave);
  const ext = path.extname(arqAbs).toLowerCase();
  let uri;
  try {
    const alpha = !opt.flatten && _temAlpha(arqAbs);
    const out = path.join(os.tmpdir(), `guiapdf_${process.pid}_${_otimN++}.${alpha ? "png" : "jpg"}`);
    if (alpha) {
      execSync(`convert ${JSON.stringify(arqAbs)} -resize "${maxDim}x${maxDim}>" -strip ${JSON.stringify(out)}`, { stdio: "ignore" });
      uri = `data:image/png;base64,${b64(out)}`;
    } else {
      execSync(`convert ${JSON.stringify(arqAbs)} -resize "${maxDim}x${maxDim}>" -background white -flatten -strip -quality ${q} ${JSON.stringify(out)}`, { stdio: "ignore" });
      uri = `data:image/jpeg;base64,${b64(out)}`;
    }
    fs.rmSync(out, { force: true });
  } catch {
    uri = `data:${MIME[ext] || "image/jpeg"};base64,${b64(arqAbs)}`; // sem ImageMagick: original
  }
  _cacheOtim.set(chave, uri);
  return uri;
}
// Gera o WebP em disco (uma vez) e devolve a URL pública para o guia referenciar.
function imgWebUrl(arqAbs, destDir, baseUrl, maxDim = 950, q = 68) {
  const nome = path.basename(arqAbs, path.extname(arqAbs)) + ".webp";
  const outAbs = path.join(destDir, nome);
  if (!_cacheOtim.has(outAbs)) {
    fs.mkdirSync(destDir, { recursive: true });
    try { otimizarWebp(arqAbs, outAbs, maxDim, q); } catch { fs.copyFileSync(arqAbs, outAbs); }
    _cacheOtim.set(outAbs, true);
  }
  return `${baseUrl}/${nome}`;
}

// renderizar(slug, "pdf"): HTML com <link> e caminhos relativos (para o Chromium gerar o PDF).
// renderizar(slug, "web"): HTML autossuficiente — CSS, fontes e imagens embutidos em base64,
// para guardar no banco e exibir no Portal do Prescritor com o MESMO visual.
// opts.artesBase + opts.artesDest (modo web): gera os WebP em artesDest e referencia por URL
// (${artesBase}/<arq>.webp). Sem eles, no modo web as imagens são embutidas como data URI.
export async function renderizar(slug, modo = "pdf", opts = {}) {
  const dir = path.join(dirProtocolos, slug);
  const p = yaml.load(fs.readFileSync(path.join(dir, "protocolo.yaml"), "utf8"));
  const web = modo === "web";
  const artesDir = path.join(dir, "artes");
  const porUrl = web && opts.artesBase && opts.artesDest;
  // Assets da marca (logo, selo, máscaras): no modo URL vão para /artes/_marca/ (públicos,
  // cacheados entre guias); no modo embutido viram data URI. Não são sigilosos (é a logo).
  const marcaDest = porUrl ? path.join(path.dirname(opts.artesDest), "_marca") : null;
  const marcaBase = porUrl ? opts.artesBase.replace(/\/[^/]+$/, "/_marca") : null;
  const marca = (arq, maxDim, q) =>
    porUrl
      ? imgWebUrl(path.join(raiz, "marca", arq), marcaDest, marcaBase, maxDim, q)
      : imgWebDataUri(path.join(raiz, "marca", arq), maxDim, q);
  const ctx = {
    web,
    qr: p.qr,
    img: !web
      ? (f) => imgPdfDataUri(path.join(artesDir, f))
      : porUrl
        ? (f) => imgWebUrl(path.join(artesDir, f), opts.artesDest, opts.artesBase)
        : (f) => imgWebDataUri(path.join(artesDir, f)),
    // capa/fundo cheio: sempre JPEG sobre branco (transparência não importa em full-bleed)
    capa: !web
      ? (f) => imgPdfDataUri(path.join(artesDir, f), { flatten: true, maxDim: 1700, q: 86 })
      : porUrl
        ? (f) => imgWebUrl(path.join(artesDir, f), opts.artesDest, opts.artesBase)
        : (f) => imgWebDataUri(path.join(artesDir, f)),
    logo: !web ? "../marca/logo-azul.png" : marca("logo-azul.png", 600, 82),
  };

  const paginas = [];
  paginas.push(`<section class="pagina capa">
    <div class="capa-faixa">
      <div class="sobretitulo">Guia de Formulações</div>
      <h1>${esc(p.titulo)}</h1>
      <div class="selo-branco"></div>
    </div>
    <div class="capa-imagem" style="background-image:url('${ctx.capa(p.capa)}');background-position:${p.capa_posicao || "center top"}"></div>
    <div class="capa-logo"></div>
  </section>`);

  for (const pag of p.paginas) {
    const blocos = [];
    // Cada fórmula abre um grupo; os destaques seguintes pertencem a ela.
    // Os conectores são desenhados por grupo, nunca ligando fórmulas diferentes.
    let grupo = 0;
    const comGrupo = (html) => html.replace('<div class="bloco"', `<div class="bloco" data-grupo="${grupo}"`);
    for (const b of pag) {
      if (b.formula) {
        grupo++;
        blocos.push(comGrupo(await blocoFormula(b.formula, ctx)).replace("data-grupo=", "data-formula data-grupo="));
      } else if (b.destaques) blocos.push(comGrupo(blocoDestaques(b.destaques, ctx)));
      else if (b.faixa) blocos.push(blocoFaixa(b.faixa, ctx));
      else if (b.texto) blocos.push(blocoTexto(b.texto, ctx));
      else if (b.espaco !== undefined) blocos.push(ESPACO({ altura: b.espaco }));
      else throw new Error(`${slug}: bloco desconhecido ${JSON.stringify(Object.keys(b))}`);
    }
    paginas.push(`<section class="pagina interna">
      <div class="cabecalho">
        <span class="nome">${esc(p.titulo)}</span>
        <div class="marca"><img src="${ctx.logo}"><span>GUIA DE FORMULAÇÕES</span></div>
      </div>
      <div class="conteudo">${blocos.join("\n")}</div>
      <div class="selo-canto selo-tema"></div>
    </section>`);
  }

  // Máscaras da marca: PNG no PDF; WebP leve no web (silhuetas com alfa, bem menores).
  const mascaraSelo = web ? `url("${marca("selo.png", 420, 82)}")` : dataUri("marca/selo.png");
  const mascaraLogo = web ? `url("${marca("logo-mono.png", 520, 82)}")` : dataUri("marca/logo-mono.png");
  const varsTema = `:root{--tema-escura:${p.cor.escura};--tema-clara:${p.cor.clara};--mascara-selo:${mascaraSelo};--mascara-logo:${mascaraLogo};}`;
  const conectores = fs.readFileSync(path.join(raiz, "template", "conectores.js"), "utf8");

  if (!web) {
    // Modo PDF: o build chama desenharConectores() depois de carregar.
    return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Guia de Formulações — ${esc(p.titulo)}</title>
<link rel="stylesheet" href="../template/guia.css">
<style>${varsTema}</style>
</head><body>
${paginas.join("\n")}
<script>${conectores}</script>
</body></html>`;
  }

  // Modo WEB: CSS leve — Montserrat vem do Google Fonts (cacheada), imagens da marca
  // inlinadas (pequenas) e imagens do protocolo otimizadas. Conectores ao carregar.
  let css = fs.readFileSync(path.join(raiz, "template", "guia.css"), "utf8");
  css = css.replace(/@font-face\s*\{[^}]*montserrat[^}]*\}/gi, ""); // fonte vem do Google
  css = css.replace(/url\(("?)\.\.\/marca\/([^")]+)\1\)/g, (_, _q, arq) => `url("${marca(arq, 520, 80)}")`);
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guia de Formulações — ${esc(p.titulo)}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap">
<style>${css}</style>
<style>${varsTema}</style>
</head><body>
${paginas.join("\n")}
<script>${conectores}</script>
<script>addEventListener("load",function(){(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){window.desenharConectores&&window.desenharConectores();});});</script>
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

// Só roda o build de PDF quando chamado direto (node scripts/build.mjs),
// não quando importado (ex.: scripts/portal-sync.mjs usa renderizar()).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
