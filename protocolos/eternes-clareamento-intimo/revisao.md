# ETERNES CLUB · Clareamento Íntimo — Revisão de Ativos (NEXUS)

Sessão 2026.11.05 · banco `supabase_ativos` · regras do `nexus_motor` (FGTS → pool por forma → NAF → BAC).
Status: **rascunho (prévia)**, aguardando revisão da Dra. Mariana Amalia e do farmacêutico responsável.

Categorias do objetivo: Hiperpigmentação (183), Clareamento (184), Melasma (299), Hidratação cutânea (191),
Menopausa (232) e Saúde sexual feminina (236). O banco **não tem** categoria específica de clareamento
íntimo nem de atrofia vulvovaginal. Fica como sugestão de cadastro.

Formas: TP2 = semissólido (creme/gel-creme), TP4 = sabonete/xampu (base com Olivem 300 e Comperlan KD no histórico).

Âncoras por instrução do prescritor (NAF-06 / GER-04):
- **F1 Sabonete (TP4):** ácido clareador que não agrida → **Ácido mandélico** (50210), já usado na casa como "SAB LIQ MANDELICO".
- **F2 Creme (TP2):** ativo do **Pigmentbio® Sensitive Areas** (Bioderma), que usa **azelato de lisina** + ácido salicílico 0,1% + extrato de Laminaria ochroleuca → **Azeloglicina** (2012), o derivado hidrossolúvel do ácido azelaico disponível no banco.
- **F3 Hidratante (TP2):** ácido hialurônico → **Hyaxel** (4889) + "estradiol-like" → **Promestrieno** (14573), estrogênio de ação local.

## Tabela de revisão

Para trocar ativos, informe os números com ❌ (ex.: "4 ❌, 12 ❌").

| # | Fórmula | Camada | Ativo (cdpro) · tier | Dose | Origem da dose | Assoc. com a âncora | Observação |
|---|---|---|---|---|---|---|---|
| 1 | F1 Sabonete | NAF | Ácido mandélico (50210) · A | 2,5% | FC12110 (2 reg.), moda TP4 = 5% | — | **Reduzido** de 5% por ser área íntima. Confirmar |
| 2 | F1 | BAC | Niacinamida PC (6032) · S | 2% | FC12110 (moda TP4) | 46 (TP4) | |
| 3 | F1 | BAC | Ácido kójico (2161) · A | 1% | FC12110 (moda TP4) | 5 (TP4) | |
| 4 | F1 | BAC | Camomila EG (3326) · B | 5% | FC12110 (moda TP4) | 4 (TP4) | Adjuvante (P2) |
| 5 | F1 | BAC | D-pantenol (52553) · A | 2% | FC12110 (moda TP4) | 2 (TP4) | |
| 6 | F1 | veículo | Sabonete líquido íntimo pH 4,5 | 150 ml | — | — | Ajustar pH com ácido lático |
| 7 | F2 Creme | NAF | Azeloglicina (2012) · B | 10% | FC12110 (2ª dose mais comum) | — | Âncora do Pigmentbio (azelato de lisina) |
| 8 | F2 | BAC | Niacinamida PC (6032) · S | 4% | FC12110 (moda) | 644 | |
| 9 | F2 | BAC | Ácido tranexâmico (5615) · A | 3% | FC12110 (moda) | 35 | |
| 10 | F2 | BAC | Alfa-arbutin (6031) · A | 2% | FC12110 (moda) | 82 | |
| 11 | F2 | BAC | Belides® (4199) · B | 2% | FC12110 (moda) | 150 | |
| 12 | F2 | BAC | Bisabolol (10601) · A | 1% | FC12110 (moda) | 313 | Calmante, adjuvante (P2) |
| 13 | F2 | veículo | Creme não iônico | 30 g | — | — | |
| 14 | F3 Gel-creme | NAF | Promestrieno 10 mg/g (14573) · B | 10 mg/g | FC12110 (moda) | — | Tarja vermelha, uso vaginal |
| 15 | F3 | NAF | Hyaxel (4889) · A | 5% | FC12110 (moda) | — | |
| 16 | F3 | BAC | Genisteína (7050) · B | 1% | FC12110 (moda) | 545 c/ promestrieno | |
| 17 | F3 | BAC | D-pantenol (52553) · A | 5% | FC12110 (moda) | 61 c/ Hyaxel | |
| 18 | F3 | BAC | Aroeira EG (5110) · A | 5% | FC12110 (moda) | 13 c/ promestrieno | |
| 19 | F3 | BAC | Vitamina E óleo (57794) · S | 2% | FC12110 (moda) | 151 c/ Hyaxel · 1 c/ promestrieno | |
| 20 | F3 | veículo | Gel-creme vaginal + aplicadores | 30 g | — | — | |

Descartados de propósito: hidroquinona, ácido retinoico e ácido glicólico (irritantes na área íntima),
e **prasterona/DHEA** (396 associações com o promestrieno). A DHEA é uma opção aprovada para atrofia
vaginal, mas é Lista C5 e duplicaria o hormônio. Fica como alternativa à escolha da prescritora.

## Pendências antes da versão oficial

1. Rodar a `validate_protocolo()` (não rodei nesta prévia).
2. Confirmar a dose do mandélico no sabonete (2,5% contra a moda de 5%) e a base de sabonete íntimo pH 4,5.
3. Confirmar o veículo do F3 (gel-creme vaginal com aplicador) e o regime 21 dias → 2 a 3x/semana.
4. Validar com o regulatório a menção ao Pigmentbio® como referência.
5. **Identidade ETERNES CLUB:** não encontrei material oficial do clube. A prévia usa a marca da Dra. Mariana
   (bordô #80003d, nude e dourado do monograma MA, Raleway + serifada). Trocar pela identidade oficial do clube quando ela for enviada (logo, cores e fontes).
6. Artes: a prévia é só tipográfica (sem fotos). Se quiserem fotos de produto, gerar no Runway.
7. Criar o link `https://medicinal.vip/protoc_ClareamentoIntimo?r=qr`.
8. Registrar em `protocolos_matriz` como `rascunho` v1.0 após aprovação.
