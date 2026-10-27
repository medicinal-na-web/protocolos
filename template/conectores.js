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

    // Cada fórmula forma um grupo com os destaques que vêm logo depois dela,
    // para o tronco não atravessar de uma fórmula para a outra.
    // Quando duas fórmulas vêm seguidas e os textos só depois, cada texto vai para o
    // card que tem o ativo com o mesmo nome (primeira palavra); senão, o último card.
    const chave = (el) =>
      el.textContent.toLowerCase().replace(/[*®™()]/g, " ").trim().split(/\s+/)[0];
    const grupos = [];
    let pendentes = [];
    for (const bloco of conteudo.children) {
      if (bloco.querySelector(".card")) {
        const g = { ativos: [...bloco.querySelectorAll(".ativo-destaque .n")], titulos: [] };
        if (!grupos.length || grupos[grupos.length - 1].titulos.length) pendentes = [];
        pendentes.push(g);
        grupos.push(g);
      } else if (bloco.querySelector(".destaque h4") && pendentes.length) {
        for (const h of bloco.querySelectorAll(".destaque h4")) {
          const dono = pendentes.find((g) => g.ativos.some((a) => chave(a) === chave(h))) || pendentes[pendentes.length - 1];
          dono.titulos.push(h);
        }
      }
    }

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

    const faixas = []; // troncos já desenhados: { x, y1, y2 }
    for (const { ativos, titulos } of grupos) {
      if (!ativos.length || !titulos.length) continue;
      // y de cada ponta, para saber se este tronco cruza a altura de outro já desenhado
      const yA = ativos.map((a) => { const r = a.getBoundingClientRect(); return r.top + r.height * 0.55 - base.top; });
      const yT = titulos.map((h) => { const r = h.getBoundingClientRect(); return r.top + r.height / 2 - base.top; });
      const y1 = Math.min(...yA, ...yT), y2 = Math.max(...yA, ...yT);
      let tronco = 9 * pxPorMm;
      while (faixas.some((f) => Math.abs(f.x - tronco) < 1 && f.y1 < y2 && y1 < f.y2)) tronco += 4 * pxPorMm;
      faixas.push({ x: tronco, y1, y2 });
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
    }
    if (svg.childNodes.length) conteudo.appendChild(svg);
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
