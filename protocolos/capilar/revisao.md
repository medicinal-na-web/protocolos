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
| 20 | F7 | Piridoxal 5-fosfato | 50 / 75 mg | 3331 · S | 50 mg | ✅ | Ver alerta 1 |
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

1. **A vitamina B6 aparece duas vezes na Fórmula 7.** O bloco obrigatório traz P5P 50–75 mg e o bloco nutricional traz piridoxina 25–35 mg, o que soma até **110 mg/dia de B6 em uso contínuo**. Acima de 50–100 mg/dia por meses, há risco de **neuropatia periférica**. Sugestão: quando os dois blocos entram juntos, usar a menor dose de P5P e tirar a piridoxina.
2. **A tiamina também aparece duas vezes.** São tiamina 60–75 mg no bloco obrigatório e vitamina B1 35–50 mg no nutricional. O risco é baixo, mas é redundância.
3. **Biotina de 5–10 mg interfere em imunoensaios** (TSH, T4, troponina, hormônios). Suspender 72 h antes de exames.
4. **Vitamina D de 10.000 UI/dia em uso contínuo** está acima do limite superior tolerável (4.000 UI). Exige 25(OH)D e cálcio de controle.
5. **Minoxidil oral "sempre prescrever".** Em 7% dos laudos a SULT1A1 está **aumentada**, e o laboratório tira o minoxidil da conduta nesses casos. Também exige avaliação cardiovascular.
6. **Critério da Fórmula 1.** A orientação diz "conforme intensidade da via androgênica". No guia, a dutasterida entra com SRD5A2 aumentado **mais** SRD5A1 alterado, AR aumentado ou HDAC9 alterado (57% dos laudos). A finasterida entra com achado isolado no SRD5A2 (20%). Confirmar esse critério.
7. **Finasterida e dutasterida em mulheres.** Os 5 laudos femininos receberam espironolactona no laboratório. A orientação não tem fórmula feminina.

## Pendências de arte

- Frascos da loção: propostas geradas a partir das referências enviadas (sem logo), `locao-bico.jpg` (F4) e `locao-pente.jpg` (F3).
- Link do QR `medicinal.vip/protoc_Capilar` ainda não foi criado.
