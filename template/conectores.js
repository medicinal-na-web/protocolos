// Desenha as linhas que ligam os ativos em destaque (ativo-destaque) aos
// textos explicativos (.destaque h4) de cada página, como no guia original.
window.desenharConectores = function () {
  const pxPorMm = (() => {
    const d = document.createElement("div");
    d.style.width = "100mm";
    document.body.appendChild(d);
    const v = d.getBoundingClientRect().width / 100;
    d.remove();
    return v;
  })();

  for (const conteudo of document.querySelectorAll(".pagina .conteudo")) {
    const base = conteudo.getBoundingClientRect();
    const ativos = [...conteudo.querySelectorAll(".ativo-destaque .n")];
    const titulos = [...conteudo.querySelectorAll(".destaque h4")];
    if (!ativos.length || !titulos.length) continue;

    const tronco = 9 * pxPorMm;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "conectores");
    const traco = (x1, y1, x2, y2) => {
      const l = document.createElementNS(ns, "line");
      Object.entries({ x1, y1, x2, y2, stroke: "#6b6b70", "stroke-width": 0.3 * pxPorMm }).forEach(([k, v]) =>
        l.setAttribute(k, v),
      );
      svg.appendChild(l);
    };
    const ys = [];

    for (const a of ativos) {
      const r = a.getBoundingClientRect();
      const y = r.top + r.height * 0.55 - base.top;
      traco(tronco, y, r.left - base.left - 1.2 * pxPorMm, y);
      ys.push(y);
    }
    for (const h of titulos) {
      const r = h.getBoundingClientRect();
      const y = r.top + r.height / 2 - base.top;
      const ponta = r.left - base.left - 1.5 * pxPorMm;
      const t = 1.6 * pxPorMm;
      traco(tronco, y, ponta - t, y);
      const seta = document.createElementNS(ns, "path");
      seta.setAttribute("d", `M${ponta - t * 1.5},${y - t} L${ponta},${y} L${ponta - t * 1.5},${y + t} Z`);
      seta.setAttribute("fill", "#6b6b70");
      svg.appendChild(seta);
      ys.push(y);
    }
    traco(tronco, Math.min(...ys), tronco, Math.max(...ys));
    conteudo.appendChild(svg);
  }
};

// Avisa quando o conteúdo de uma página passa da área útil (precisa dividir a página).
window.verificarTransbordo = function () {
  const avisos = [];
  document.querySelectorAll(".pagina.interna").forEach((pag, i) => {
    const c = pag.querySelector(".conteudo");
    if (c.scrollHeight > c.clientHeight + 2) avisos.push(`página ${i + 2} passou da área útil`);
  });
  return avisos;
};
