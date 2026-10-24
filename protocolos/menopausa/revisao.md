# Bem-Estar na Menopausa — Revisão de Ativos (NEXUS)

Sessão 2026.10.24 · banco `supabase_ativos` · regras do `nexus_motor` (FGTS → NAF → BAC → PAR → `validate_protocolo()`).
Status: **rascunho**, aguardando revisão do prescritor e do farmacêutico responsável.

Contexto: mulheres em peri e pós-menopausa. As categorias do objetivo foram Menopausa (232), Insônia (251), Ansiedade (249),
Depressão leve (250), Memória (255), Saúde óssea (104), Rugas (193), Hidratação cutânea (191), Flacidez (194),
Síndrome metabólica (220), Resistência à insulina (216), Lipolíticos (226), Disbiose (264), ITU recorrente (128) e Saúde sexual feminina (236).

## Tabela de revisão

Para trocar ativos, informe os números com ❌ (ex.: "7 ❌, 15 ❌").

| # | Fórmula | Forma | Camada | Ativo (cdpro) | Dose | Origem da dose | Status | Observação |
|---|---|---|---|---|---|---|---|---|
| 1 | F1 Estradiol Spray | TP2 spray | NAF | Estradiol 1:10 (6161) · B | 1,53 mg/jato | Lenzetto® | ✅ | Cadastro "uso interno": confirmar matéria-prima tópica e a forma spray |
| 2 | F1 | | veículo | Octisalato 5% | 5% | referência | ⚠️ | Não cadastrado no banco |
| 3 | F2 Progesterona | TP1 cápsula | NAF | Progesterona (55670) · S | 100 mg | FC12110 (moda) | ✅ | Cadastro diz "não micronizada": uso oral exige a micronizada |
| 4 | F3 Fogachos s/ hormônio | TP1 | NAF | EVA360® (16552) · A | 200 mg | FC12110 | ✅ | |
| 5 | F3 | TP1 | PAR | **Fezolinetanto** | 45 mg | referência clínica | ⏳ | Sem cadastro (aguardando chegada) |
| 6 | F3 | TP1 | BAC | Relora® (10002) · A | 250 mg | FC12110 | ⚠️ | Associação fraca com o foco (1 ocorrência) · P2 |
| 7 | F4 Creme vaginal | TP2 | NAF | Estriol 1:10 (5004) · B | 1 mg/g | FC12110 | ✅ | Motor só achou hormônios no BAC (já usados em F1/F2) |
| 8 | F5 Sono | TP1 | NAF | Magnésio bisglicinato (4167) · S | 200 mg | FC12110 | ✅ | |
| 9 | F5 | TP1 | BAC | Valeriana (1008) · A | 200 mg | FC12110 | ✅ | 160 associações |
| 10 | F5 | TP1 | BAC | Passiflora (1704) · A | 200 mg | FC12110 | ✅ | 190 associações |
| 11 | F6 Humor | TP1 | NAF | L-teanina (2859) · S | 200 mg | FC12110 | ✅ | |
| 12 | F6 | TP1 | BAC | 5-HTP (540) · S | 50 mg | FC12110 | ✅ | 2.309 associações · atenção com antidepressivos |
| 13 | F6 | TP1 | BAC | Serenzo™ (6784) · B | 250 mg | FC12110 | ✅ | 334 associações |
| 14 | F7 Ossos | TP1 | NAF | Vitamina K2 MK-7 (7040) · S | 120 mcg | FC12110 | ✅ | |
| 15 | F7 | TP1 | BAC | Citrato malato de cálcio (8788) · A | 250 mg | FC12110 | ✅ | |
| 16 | F7 | TP1 | BAC | Boro quelado (25460) · A | 2 mg | FC12110 | ✅ | |
| 17 | F7 | | — | **Vitamina D3** | — | — | ❌ | Não encontrada na tabela `ativos` (GER-04) |
| 18 | F8 Pele | TP15 sachê | âncora | Verisol® (8194) · A | — | — | ↺ | Âncora das associações, substituída pelo Genu-in Skin |
| 19 | F8 | TP15 | PAR | Genu-in Skin® (17239) | 2,5 g | ficha | ⏳ | Sem registro em FC12110 → cadastrar forma |
| 20 | F8 | TP15 | BAC | Ácido hialurônico oral (5690) · A | 100 mg | FC12110 | ✅ | P2 |
| 21 | F8 | TP15 | BAC | Cerasomosides (9425) · B | 40 mg | FC12110 | ✅ | |
| 22 | F8 | TP15 | BAC | SiliciuMax® (11161) · A | 50 mg | FC12110 | ✅ | P2 |
| 23 | F9 Metabolismo | TP15 sachê | NAF | Akkermansia Bio MAMPs (14490) · A | 50 mg | FC12110 | ✅ | GER-08: sachê de probióticos |
| 24 | F9 | TP15 | BAC | B. lactis (10960) · A | 1 BLH | FC12110 | ✅ | |
| 25 | F9 | TP15 | BAC | L. gasseri (8113) · A | 2 BLH | FC12110 | ✅ | |
| 26 | F9 | TP15 | BAC | PreticX™ XOS (10267) · B | 1,4 g | FC12110 | ✅ | |
| 27 | F10 Urinário | TP1 | NAF | Cranberry (3376) · A | 500 mg | FC12110 | ✅ | |
| 28 | F10 | TP1 | BAC | D-manose (10221) · B | 500 mg | FC12110 | ✅ | |
| 29 | F11 Libido | TP1 | PAR | **Elibrya™** (17258) | a definir | — | ⏳ | Sem registro em FC12110 e sem dose na ficha |
| 30 | F11 | TP1 | NAF | Maca peruana (23) · S | 500 mg | FC12110 (moda) | ✅ | Âncora das associações |
| 31 | F11 | TP1 | BAC | Tribulus terrestris (104) · S | 500 mg | FC12110 (moda) | ✅ | 4.976 associações |
| 32 | F12 Sintomas gerais | TP1 | NAF | S-equol 1:10 (14034) · B | 10 mg | literatura | ⚠️ | Histórico registra 2,5 mg: confirmar se a dose é do triturado ou do S-equol |
| 33 | F12 | TP1 | BAC | Cimicifuga racemosa (557) · B | 80 mg | FC12110 | ✅ | |
| 34 | F12 | TP1 | BAC | Vitamina E acetato (57800) · S | 200 UI | FC12110 | ✅ | P2 |

## Resultado da `validate_protocolo()`

- **FGTS:** todos os ativos NAF/BAC estão no tier S/A/B.
- **NAF-01:** todas as âncoras têm registro na forma escolhida.
- **GER-07:** todas as cápsulas ficam abaixo de 2.000 mg (a maior soma é 1.000 mg).
- **GER-08:** nenhum probiótico em cápsula, e há sachê dedicado (F9).
- **Duplicatas:** nenhuma. Cada ativo aparece em uma única fórmula (GER-11).
- **BAC-01:** a função reprovou 11 associações que **existem** no banco. Os pares em `associacoes_ativos`
  são gravados uma única vez, com `codigo_a < codigo_b` em ordem de texto, e a função só procura
  `codigo_a = NAF`. Conferi as 17 associações BAC nas duas direções e todas têm âncora real.
  **Bug a corrigir na função** (não alterei o banco).
- **PAR:** Genu-in Skin e Elibrya **FAIL** por não terem registro em FC12110. Precisam de cadastro (SOP §9).
- **BAC-05:** alertas de Prioridade 2 para Relora, ácido hialurônico, SiliciuMax e vitamina E.

## Pendências antes da versão oficial

1. Cadastrar **Fezolinetanto**, **Genu-in Skin** (TP15) e **Elibrya** (TP1 + dose).
2. Incluir **vitamina D3** na tabela `ativos`.
3. Corrigir a direção do BAC-01 em `validate_protocolo()`.
4. Confirmar a dose do S-equol, a progesterona micronizada e a matéria-prima do estradiol tópico.
5. Validar com o regulatório o uso da marca Lenzetto® e a concentração do spray.
6. Registrar em `protocolos_matriz` como `rascunho` v1.0 (GER-05). Ainda não registrei: depende da aprovação de vocês.
