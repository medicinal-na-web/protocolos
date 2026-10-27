# Protocolo Capilar Genético — Revisão de Ativos

Base: orientação interna Medicinal (Fórmulas 1 a 9) + 70 laudos GeneHair/HairCode (Bioma Genetics, 27 variantes;
65 homens e 5 mulheres; coletas de dez/2025 a ago/2026). Banco `supabase_ativos` consultado em 27/10/2026.
Status: **rascunho**, aguardando revisão do prescritor e do farmacêutico responsável.

Colunas: **cdpro** e **tier** vêm da tabela `ativos`. **Moda Medicinal** é a dose mais usada em `FC12110`
desde jun/2024, na forma farmacêutica correspondente. As formas são 1 = cápsula, 2 = sérum,
3 = loção capilar, 4 = shampoo e 15 = sachê.

## Tabela de revisão

| # | Fórmula | Ativo | Dose (orientação) | cdpro · tier | Moda Medicinal | Status | Observação |
|---|---|---|---|---|---|---|---|
| 1 | F1 | Dutasterida | 0,5 mg · 3x/sem | — | — | ⚠️ | Sem cadastro em `ativos` |
| 2 | F1 | Finasterida | 1 mg/dia | — | — | ⚠️ | Sem cadastro em `ativos` |
| 3 | F2 | Minoxidil (oral) | 2,5 mg | — | — | ⚠️ | Só existe o minoxidil **sulfato tópico** (1270). Cadastrar o minoxidil base |
| 4 | F3 | Latanoprosta | 0,005% | — | — | ⚠️ | Sem cadastro |
| 5 | F4 | Minoxidil sulfato | 5% | 1270 · S | 5% (loção) | ✅ | |
| 6 | F4 | Finasterida tópica | 0,10 / 0,15% | — | — | ⚠️ | Sem cadastro |
| 7 | F4 | Alfa-estradiol 1:100 | 0,025% | 6217 · B | 0,025% | ✅ | |
| 8 | F4 | Cetirizina | 1 / 2% | 2433 · B | 1% | ✅ | |
| 9 | F4 | Tretinoína | 0,015% | 1686 · A | 0,015% | ✅ | |
| 10 | F4 | D-Pantenol | 2% | 52553 · A | 2% | ✅ | |
| 11 | F4 | Auxina Tricógena® | 5 / 10% | 2396 · A | 10% | ✅ | |
| 12 | F4 | Capilia Longa™ | 2 / 3,5% | 10480 · B | 1% | ⚠️ | A ficha indica 0,5–2%. **3,5% fica acima da faixa** |
| 13 | F4 | Veículo | qsp 100 ml | 11143 · A | 100 g | ❓ | A orientação diz "Trichocol". O banco tem **TrichoSol®**, usado no guia. Confirmar |
| 14 | F5 | ProHairin Complex | 1,5% | 7633 · **C** | — | ⚠️ | Tier C, fora do FGTS. Entra como PAR (invocação nominal) |
| 15 | F5 | Nanofactor aFGF | 1,5% | 4526 · A | 1,5% (sérum) | ✅ | |
| 16 | F5 | Nanofactor VEGF | 1,0% | 4602 · A | 1,5% (sérum) | ✅ | |
| 17 | F5 | Procapil® | 1,5% | FC 16750 | 1,5% | ✅ | Sem ficha em `ativos` |
| 18 | F6 | Vitamina D3 | 1.000 UI/gota · 10 gotas | — | — | ⚠️ | Sem cadastro (a mesma pendência do protocolo Menopausa) |
| 19 | F7 | Biotina | 2 / 5 / 10 mg | FC 38015 | — | ⚠️ | Sem ficha em `ativos` |
| 20 | F7 | Piridoxal 5-fosfato | 50 / 75 mg | 3331 · S | 50 mg | ✅ | Única fonte de B6 da F7 (ver alerta 1) |
| 21 | F7 | Zinco quelato | 25 / 35 mg | 15374 · S | 30 mg | ✅ | |
| 22 | F7 | Pantotenato de cálcio | 150 / 200 mg | 55463 · S | — | ✅ | |
| 23 | F7 | L-cistina | 20 / 30 mg | 51780 · S | 20 mg | ✅ | |
| 24 | F7 | Metilfolato | 1 mg | — | — | ⚠️ | Sem cadastro. A farmácia usa **ácido folínico** (616), com moda de 400 mcg |
| 25 | F7 | Metilcobalamina | 1 mg | — | — | ⚠️ | Sem cadastro |
| 26 | F7 | CavaCurcumin® | 50 mg | — | — | ⚠️ | Sem cadastro. Alternativa cadastrada: Cureit® (11894 · S) |
| 27 | F7 | CavaQ10® | 50 mg | 15364 · S | — | ✅ | |
| 28 | F7 | Vitamina E acetato | 200–600 UI | 57800 · S | — | ✅ | |
| 29 | F7 | In.Cell® | 150 mg | 9359 · A | — | ✅ | |
| 30 | F8 | Piritionato de zinco | 1% | 56042 · B | 1% (shampoo) | ✅ | |
| 31 | F8 | Jaborandi extrato | 10% | 9910 · B | — | ✅ | |
| 32 | F9 | L-glutamina | 5 g | 1552 · S | 1 g (sachê) | ✅ | Dose acima da moda, mas dentro do uso clínico |
| 33 | F9 | L. acidophilus / rhamnosus / bifidum / reuteri / gasseri | 5 / 5 / 5 / 2 / 2 BLH | 999 · S, 1144 · S, 1143 · A, 7314 · A, 8113 · A | — | ✅ | GER-08: probióticos em sachê |

Ainda não conferidos no banco: tiamina, Nigella sativa, PQQ, riboflavina, vitamina C, magnésio, cobre e selênio.

## Alertas clínicos para o farmacêutico

1. **B6 duplicada: corrigido.** A piridoxina (25–35 mg) saiu do bloco nutricional da F7. A B6 fica só no bloco obrigatório, como P5P 50–75 mg/dia. Acima de 50 mg/dia em uso contínuo por meses, acompanhar sinais de **neuropatia periférica** e preferir 50 mg.
2. **Tiamina duplicada: corrigido.** A vitamina B1 (35–50 mg) saiu do bloco nutricional da F7. A tiamina fica só no bloco obrigatório, com 60–75 mg.
3. **Biotina de 5–10 mg interfere em imunoensaios** (TSH, T4, troponina, hormônios). Suspender 72 h antes de exames.
4. **Vitamina D de 10.000 UI/dia em uso contínuo** está acima do limite superior tolerável (4.000 UI). Exige 25(OH)D e cálcio de controle.
5. **Minoxidil oral "sempre prescrever".** Em 7% dos laudos a SULT1A1 está **aumentada**, e o laboratório tira o minoxidil da conduta nesses casos. Também exige avaliação cardiovascular.
6. **Critério da Fórmula 1.** A orientação diz "conforme intensidade da via androgênica". No guia, a dutasterida entra com SRD5A2 aumentado **mais** SRD5A1 alterado, AR aumentado ou HDAC9 alterado (57% dos laudos). A finasterida entra com achado isolado no SRD5A2 (20%). Confirmar esse critério.
7. **Finasterida e dutasterida em mulheres.** Os 5 laudos femininos receberam espironolactona no laboratório. A orientação não tem fórmula feminina.

## Pendências de arte

- Frascos da loção: propostas geradas a partir das referências enviadas (sem logo), `locao-bico.jpg` (F4) e `locao-pente.jpg` (F3).
- Link do QR `medicinal.vip/protoc_Capilar` ainda não foi criado.

## Associações do motor NEXUS (rodada de 27/10/2026)

O motor seguiu a ordem obrigatória da GER-02:
1. **FGTS:** só ativos com tier S, A ou B.
2. **Pool por forma farmacêutica:** registro em `FC12110` na forma da fórmula.
3. **NAF:** âncoras com indicação nas categorias 185 Alopecia, 188 Crescimento capilar e 189 Seborregulação. Para o sachê, 264, 268 e 269. Para a cápsula, também 157, 161 e 300.
4. **BAC:** associados com registro em `associacoes_ativos` na mesma forma, ranqueados pela BAC-02 (nº de âncoras, depois frequência total, depois o par mais forte).

As consultas leram os pares **nas duas direções**. A tabela grava cada par uma única vez, com `codigo_a < codigo_b`, e a mesma falha já tinha sido vista na `validate_protocolo()` do protocolo Menopausa. As doses são a **moda** em `FC12110` na mesma forma, desde jan/2024.

Formas: 1 = cápsula, 3 = loção capilar e soro, 4 = shampoo, 15 = sachê.

| Fórmula | Forma | Âncoras NAF (cdpro · tier) | Associados BAC usados (cdpro · tier · coprescrições com a âncora) |
|---|---|---|---|
| F1N (nova) | 1 | Saw palmetto 1619 · S | Zinco quelato 15374 · S · 2.647; Pygeum 4028 · B · 1.229; Licopeno 2319 · A · 1.071; Urtiga dioica 6009 · B · 468; Androtase® 15353 · A · 238 |
| F4 | 3 | Minoxidil sulfato 1270 · S (+ Auxina 2396, Capilia 10480, Alfa-estradiol 6217, Cetirizina 2433, Tretinoína 1686, D-pantenol 52553) | Ciclopirox 2112 · A · 2.945; GHK-Cu 4603 · A · 1.100; Cafeína 51469 · S · 945; IGF 4601 · A · 668; Trichoxidil 13683 · B · 434; L-arginina 50659 · S · 267; Capixyl 6073 · B · 253; Adenosina 50908 · B · 240; Tintura de Serenoa 14545 · B · 217; L-carnitina 98589 · A · 171; Ginkgo glicólico 781 · B · 127; Espironolactona 52693 · A · 119; Niacinamida PC 6032 · S · 37 |
| F5 | 3 | aFGF 4526, VEGF 4602, IGF 4601, GHK-Cu 4603 (A) | bFGF 4527 · B · 493 (VEGF); Follicusan 4198 · B · 246 (VEGF); Cafeína · 64 (aFGF); Kopexyl 5592 · B · 44; EGF 4525 · B · 28 |
| F7 | 1 | Zinco quelato 15374, Exsynutriment 866, L-cistina 51780, P5P 3331 (S) | Riboflavina 56110 · S · 5.387 (P5P); L-metionina 60604 · A · 5.016; Ácido alfa-lipoico 98577 · S · 4.117; Queratina 7148 · A · 4.076; Pinus pinaster 2605 · S · 2.524; Betaína 4134 · A · 2.326; Resveratrol 2671 · S · 2.022; Astaxantina 7219 · A · 1.500; Glutationa 942 · A · 1.269; Ubiquinol 6955 · A · 713 |
| F8 | 4 | Piritionato de zinco 56042, Jaborandi 9910 (B), Auxina 2396 (A) | D-pantenol 52553 · A · 131 (Auxina); Ácido salicílico 50283 · A · 85; Cetoconazol 54409 · B · 64; DefensCalp 11195 · B · 57; Cafeína · 51; Octopirox 72795 · **C** · 20 |
| F9 | 15 | L-glutamina 1552, L. acidophilus 999, L. rhamnosus 1144 (S) | Fibregum B 5212 · A · 423; B. lactis 10960 · A · 391 (acidophilus); Inulina 4173 · A · 241; B. longum 9533 · A · 213 (rhamnosus); Akkermansia 14490 · A · 145; L. plantarum 7335 · A · 135; PreticX 10267 · B · 89; CoreBiome 13990 · A · 9; Lactoferrina 12628 · B · 7 |

Observações:
- **Octopirox (72795) é tier C.** Na F8-B ele entra como PAR, por invocação nominal, e não pelo motor.
- **CoreBiome e Lactoferrina** têm poucas coprescrições no sachê (9 e 7). São inovação com indicação primária, não rotina.
- **F2, F3 e F6 ficaram fora do motor**, porque minoxidil oral, latanoprosta e vitamina D3 não têm cadastro. Para a F6, a associação sugerida é a vitamina K2 MK-7 (7040 · S). A moda em gotas é 100 mcg.
- **Riboflavina:** quem usar a variação de metilação não deve somar a riboflavina do bloco nutricional.

## Novas seções (27/10/2026)

### Fórmula 4C · Clascosterona (proposta)
- **Fora do motor.** Não há cadastro em `ativos` nem uso em `FC12110` (busca por clascoster, cortexolon, Winlevi e Breezula). Entra pela camada **PAR**.
- **Dose:** solução 5%, 2 vezes ao dia, a usada nos estudos de fase 3 em alopecia androgenética. O veículo é anidro, por causa da hidrólise do éster.
- **Pendências:** fornecedor de matéria-prima com laudo, enquadramento regulatório (não há registro na ANVISA para alopecia), estudo de estabilidade e validade, e definição do monitoramento do eixo HPA em uso prolongado.

### Subseção de fatores de crescimento
- As doses são a moda em loção capilar (forma 3): aFGF 1,5%, bFGF 1%, VEGF 1%, IGF 1%, KGF 1,5%, IDP-2 0,5%, GHK-Cu 1%, Capilia Longa 1%, EGF 1% e TGF-β3 2%.
- Os pares mais fortes vêm de `associacoes_ativos` (forma 3): bFGF–IGF 578, aFGF–GHK-Cu 591, VEGF–GHK-Cu 612 e VEGF–minoxidil 779.
- **TGF-β3 restrito à área doadora.** A família TGF-β (β1 e β2) induz catágeno; o β3 entra só pela ação anticicatricial.

### Pós-transplante
- O **Foam Pós-Transplante** segue exatamente a fórmula do prescritor: ácido salicílico 0,5% e óleo essencial de alecrim 0,25% em **Base Foam** qsp 100 ml. Aplicar 1 vez ao dia, deixar agir por 5 minutos e enxaguar (confirmado pelo prescritor em 27/10/2026).
- As variações do foam vêm do NEXUS com as âncoras ácido salicílico (50283 · A) e alecrim (1808 · B), na forma 3:
  - bisabolol 10601 · A · 121
  - alantoína 50416 · A · 86
  - mentol 54719 · B · 145
  - BioEcolia 8376 · B · 92
  - niacinamida PC 6032 · S · 71
  - melaleuca 19940 · B · 118 (alecrim)
  - D-pantenol 52553 · A · 41
  - babosa 70154 · B · 16
- **Mentol a 0,25%:** abaixo da moda da farmácia (0,5%), por causa da sensibilidade do pós-operatório.
- **Sérum calmante:** bisabolol + alantoína (151), camomila + bisabolol (121) e bisabolol + D-pantenol (36).
- **Sérum reparador da área doadora:** GHK-Cu + TrichoSol (241) e GHK-Cu + D-pantenol (182). EGF e TGF-β3 entram por indicação, com poucas coprescrições na loção.
