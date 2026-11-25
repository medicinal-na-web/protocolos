# Medicina Funcional · Dra. Giovanna — Revisão de Ativos (NEXUS)

Sessão 2026.11.25 · prescritora CRM 51626/PR · bancos `supabase_ativos` (motor NEXUS) e `formulaCerta` (faturamento).
Status: **rascunho para apresentação**, publicado no Portal do Prescritor como `funcional-giovanna`, visibilidade **restrito**
(só administradores e visitadoras veem). A prescritora ainda não tem cadastro em `entrega.prescritor`, então não há `protocolo_acesso` para ela.

## Base de dados da prescritora

- 1.440 fórmulas faturadas (03/01/2025 a 24/11/2026), filial 1.
- 816 fórmulas com itens na FC12110 (19/12/2024 a 02/04/2026; a FC12110 está parada em 04/04/2026).
- Formas: cápsula TP1 (469), oro-tab/sublingual TP5 (166), sachê TP15 (141), tópico TP2 (36).
- Perfil: medicina funcional/ortomolecular, com minerais quelados, tireoide, modulação hormonal, sono, mitocôndria e performance.

## Método

1. **Âncoras (NAF-06/GER-04):** as fórmulas que ela mais repete viram âncoras, com as doses dela.
2. **Incremento (BAC-01/02/05):** candidatos com associação registrada em `associacoes_ativos` com as âncoras, na mesma forma,
   tier S/A/B e **indicação primária** nas categorias da fórmula. Ranqueados por nº de âncoras e frequência.
3. **Fórmulas novas (NAF-02/03):** categorias que ela não cobre, com score primária 1,0 / adjuvante 0,5, ativos com histórico na forma.
4. **Validação:** todos os ativos de cada fórmula têm pares registrados com os demais na mesma forma (BAC-01 nas duas direções).
   Todas as cápsulas ficam abaixo de 2.000 mg (GER-07; a maior é o Suporte Hepático, com 1.600 mg em 2 cápsulas).
5. **Doses dos ativos novos:** a dose que a própria prescritora já usou ou o p50 da `nexus_dose_hist` na mesma forma.

## Fórmulas (✚ = ativo proposto pelo NEXUS)

| # | Fórmula | Forma | Base (vezes no histórico) | Incremento NEXUS (âncoras · frequência) |
|---|---|---|---|---|
| 1 | Base Ortomolecular | TP1 | Cu, Se, K2, Mg malato, Zn, CoQ10, B6, B2 (23x idêntica) | ✚ Vit C revestida 300 mg (8 âncoras · 81.789) · ✚ Pantotenato de Ca 100 mg (8 · 51.945) |
| 2 | Mitocôndria Sublingual | TP5 | NADH, K2, CavaQ10, retinol (13x) | ✚ Ubiquinol 10 mg (4 · Longevidade*) · ✚ Riboflavina 10 mg (4) |
| 3 | Tireoide em Equilíbrio | TP15 | Zn, iodo, Se, P5P, Mg, NAC, mio-inositol, tirosina, retinol, taurina, vit C | ✚ Riboflavina 20 mg (10) · ✚ D-ribose 3 g (10 âncoras · Fadiga*) |
| 4 | Sono Profundo | TP15 | Mg bisglicinato, Mg treonato, teanina, inositol, glicina | ✚ Passiflora 200 mg (9 · Insônia*) · ✚ Melissa 200 mg (8 · Ansiedade*, evid. B) |
| 5 | Adaptógeno Energia & Estresse | TP15 | Rhodiola, ashwagandha, cordyceps, Mg, Mg treonato | ✚ Panax ginseng 100 mg (5 · Adaptógenos*) · ✚ L-teanina 200 mg (5 · evid. B) |
| 6 | Detox Estrogênico | TP1 | DIM, glucorafanina, moringa, Ca D-glucarato, iodo, Se, Resvitech, Dimpless, retinol | ✚ P5P 20 mg (9) · ✚ Chlorella 200 mg (6 · Detox hepática*) |
| 7 | Modulação Androgênica | TP1 | Crisina, BioPerine, P5P, saw palmetto, vit C, Zn | ✚ Licopeno 10 mg (8 · Próstata*, evid. B) · ✚ Urtiga raiz 250 mg (8 · evid. B) |
| 8 | Sachê Antioxidante, Pele & Vascular | TP15 | Glutamina, glicina, NAC, vit C, Se, astaxantina, pinus, quercetina, CavaQ10, Dimpless, Cureit, cavalinha | ✚ Verisol 2,5 g (12) · ✚ Exsynutriment 100 mg (12 · Antiaging*) |
| 9 | Recuperação Muscular | TP15 | Bodybalance, ClonaPure, PeptiStrong (16x idêntica) | ✚ HMB cálcio 2 g (3 · Sarcopenia*) |
| 10 | Articulações em Movimento | TP15 | Glucosamina, condroitina, UC-II, garra-do-diabo | ✚ HydroCurc 200 mg (6) · ✚ Ácido hialurônico 80 mg (6 · evid. B) |
| 11 | Cabelos & Unhas | TP1 | Cistina, metionina, cisteína, MSM, SiliciuMax, Zn | ✚ Queratina hidrolisada 50 mg (7 · 20.357) · ✚ Actrisave 100 mg (7 · Alopecia*) |
| 12 | Suporte Hepático | TP1 | NAC, ornitina, silimarina (5x) + Se e molibdênio (5x) | ✚ Fosfatidilcolina 200 mg (4 · Saúde hepática*) |
| N1 | Sensibilidade à Insulina | TP1 | **nova** | Berberina 500 · Morosil 400 · Crominex 10 · ALA 300 (cats 216/220/231) |
| N2 | Foco & Cognição | TP1 | **nova** | Mg treonato 200 · Bacopa 250 (evid. B) · ALCAR 250 · Colina 300 · Teanina 200 · Fosfatidilserina 100 |
| N3 | Equilíbrio Feminino (TPM) | TP1 | **nova** | Mg inositol 200 · P5P 30 · Açafrão 30 · 5-HTP 50 (cat 228) |
| N4 | Barreira Intestinal | TP15 | **nova** | Glutamina 5 g · Fibregum 3 g · CoreBiome 300 mg · StomaZinc 100 mg (cats 264/268) |

## Pontos para revisão antes de oficializar

1. **Tier abaixo de S/A/B (FGTS), mantidos porque a prescritora já usa (NAF-06):** Cordyceps (C), Moringa (C), Cálcio D-glucarato (C, consta "em falta"), Glucorafanina (D).
2. **Phenibut** ficou fora do Sono Profundo (alerta de abuso e abstinência na ficha). Ela o usa em cerca de 14 fórmulas; incluir só se ela pedir.
3. **Clomifeno** (Rx) ficou como opcional no modo de uso da Modulação Androgênica, e não na lista de ativos.
4. **Medicamentos** que ela prescreve sozinhos (bupropiona + naltrexona, naltrexona, lisdexanfetamina, testosterona, DHEA) não entram no guia de formulações.
5. **Iodo 500 mcg** (Tireoide) é a dose modal dela; está acima da IDR (150 mcg) e abaixo do limite superior (1.100 mcg). Vale confirmar.
6. **Ferro** foi retirado de Cabelos & Unhas e deve ser usado só com ferritina baixa.
7. **Interações:** berberina (hipoglicemiantes), 5-HTP e açafrão (antidepressivos serotoninérgicos), ginseng (anticoagulantes).
8. Fichas com `status_ficha = pendente` em vários ativos-base (Zn, Cu, K2, P5P, NAC etc.): sem dose min/máx cadastrada.
9. A capa no portal reaproveita a imagem do protocolo NAD+. Trocar quando houver arte própria.
10. Para liberar à prescritora: cadastrá-la no Portal (`entrega.prescritor`) e inserir `entrega.protocolo_acesso ('funcional-giovanna', <id>)`.

## Marcação ✚ (ajuste de 25/11/2026)

O ✚ indica ativo que a prescritora **ainda não usa naquela fórmula**. Nas 4 fórmulas novas, a combinação é nova, mas ela já
prescreve quase todos os ativos em outras fórmulas: glutamina 30×, Fibregum 5×, CoreBiome 2×, StomaZinc 3×, berberina 8×,
Crominex 12×, ácido lipoico 18×, Mg L-treonato 43×, teanina 35×, colina 16×, P5P 57×, Mg inositol 10×, 5-HTP 10×,
fosfatidilserina 4×, ALCAR 2× e bacopa 1×. Só **Morosil®** e **açafrão (Crocus sativus)** nunca aparecem no histórico dela, e só eles mantêm o ✚.
