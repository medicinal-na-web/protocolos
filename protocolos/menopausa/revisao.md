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
| 3 | F2 Progesterona | TP1 cápsula | NAF | Progesterona micronizada (55670) · S | 100 mg | FC12110 (moda) | ✅ | **Aprovado:** usar progesterona micronizada (o cadastro 55670 ainda diz "não micronizada", então corrigir a ficha) |
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
| 19 | F8 | TP15 | PAR | Genu-in Skin® (17239) | 2,5 g | ficha (17/10/2026) | ⏳ | Ficha cadastrada; categorias vinculadas em 29/10/2026 (Rugas · primária, Hidratação, Flacidez, Antiaging). Ainda sem tier e sem histórico na FC12110. Existe também o código antigo 16184 "Genu-In" (tier C, 20 sachês até 30/03/2026, dose mais comum 5 g) |
| 20 | F8 | TP15 | BAC | Ácido hialurônico oral (5690) · A | 100 mg | FC12110 | ✅ | P2 |
| 21 | F8 | TP15 | BAC | Cerasomosides (9425) · B | 40 mg | FC12110 | ✅ | |
| 22 | F8 | TP15 | BAC | SiliciuMax® (11161) · A | 50 mg | FC12110 | ✅ | P2 |
| 23 | F9 Metabolismo | TP15 sachê | NAF | Akkermansia Bio MAMPs (14490) · A | 50 mg | FC12110 | ✅ | GER-08: sachê de probióticos |
| 24 | F9 | TP15 | BAC | B. lactis (10960) · A | 1 BLH | FC12110 | ✅ | |
| 25 | F9 | TP15 | BAC | L. gasseri (8113) · A | 2 BLH | FC12110 | ✅ | |
| 26 | F9 | TP15 | BAC | PreticX™ XOS (10267) · B | 1,4 g | FC12110 | ✅ | |
| 27 | F10 Urinário | TP1 | NAF | Cranberry (3376) · A | 500 mg | FC12110 | ✅ | |
| 28 | F10 | TP1 | BAC | D-manose (10221) · B | 500 mg | FC12110 | ✅ | |
| 29 | F11 Libido | TP1 | PAR | **Elibrya™** (17258) | 150 mg | ficha (17/10/2026) | ⏳ | Ficha cadastrada; ainda sem tier e sem histórico na FC12110 (base parada em 04/04/2026) |
| 30 | F11 | TP1 | NAF | Maca peruana (23) · S | 500 mg | FC12110 (moda) | ✅ | Âncora das associações |
| 31 | F11 | TP1 | BAC | Tribulus terrestris (104) · S | 500 mg | FC12110 (moda) | ✅ | 4.976 associações |
| 32 | F12 Sintomas gerais | TP1 | NAF | S-equol 1:10 (14034) · B | 10 mg | literatura | ✅ | **Aprovado:** manter 10 mg (o histórico registra 2,5 mg) |
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

## Revalidação de 29/10/2026

A base **não foi atualizada** antes desta revalidação. Nenhum dos 102 workflows do n8n self-hosted
(n8nbmmed.medicinal.far.br) carrega a FC12110 nem recalcula associações e tiers na `supabase_ativos`.
O n8n cloud (ricardo-medicinal.app.n8n.cloud) **ainda não foi consultado**: o conector estava desconectado.
Os que leem a FC12110 ("Ativação - prescrições", "CMV - margem e markup") gravam em outros projetos
(formulaCerta e supint). Estado do banco nesta data: FC12110 e `associacoes_ativos` até 04/04/2026, e tiers recalculados
pela última vez em 08/05/2026. Por isso a revalidação abaixo usa a mesma base da sessão de 24/10.

Rodei a `validate_protocolo()` de novo com as 12 fórmulas da tabela. Ficaram de fora o octisalato,
o fezolinetanto e a vitamina D3, que não têm cadastro, e o Verisol, que foi substituído.

- **Sem mudança:** FGTS, NAF-01 (12 âncoras), GER-07 (a maior soma agora é 1.150 mg na F11, contando o Elibrya) e GER-08 passam.
  Os alertas BAC-05 P2 continuam os mesmos.
- **BAC-01:** reprovou as mesmas 11 associações. Conferi nas duas direções e todas existem (Relora × EVA360® segue com 1 ocorrência). O bug da função continua.
- **PAR:** Genu-in Skin (17239) e Elibrya (17258) continuam **FAIL** (sem histórico na FC12110, sem tier).
- **Novo · BAC-05 FAIL no Tribulus (104, F11):** as categorias do ativo são só masculinas (Libido masculina · primária,
  Fertilidade masculina, Disfunção erétil, Hipogonadismo). Ele não está vinculado a Saúde sexual feminina (236).
  A revisão de 24/10 não registrou essa falha. É preciso vincular o Tribulus à 236 (se o farmacêutico concordar) ou trocá-lo.
- **Novo · F8 sem âncora:** as BACs da F8 (ácido hialurônico, Cerasomosides, SiliciuMax) foram ancoradas no Verisol (8194), que saiu da fórmula.
  O Genu-in Skin entra como PAR e não tem associações. A F8 está hoje sem NAF.
- **Correção na linha 19:** o código 16184 está cadastrado como "GENU-IN LIFE", e não "Genu-In".

## Pendências antes da versão oficial

1. Cadastrar **Fezolinetanto**, **Genu-in Skin** (TP15) e **Elibrya** (TP1 + dose).
2. Incluir **vitamina D3** na tabela `ativos`.
3. Corrigir a direção do BAC-01 em `validate_protocolo()` (script pronto em `nexus/correcao_validate_protocolo_bac01.sql`, aplicar pelo owner).
7. Reimportar a FC12110 a partir do ERP (última carga: 04/04/2026) e recalcular associações e tiers (scripts locais do owner).
4. Confirmar a matéria-prima do estradiol tópico. Progesterona micronizada e S-equol 10 mg já foram aprovados (29/10/2026). Falta ajustar a ficha da 55670 para "micronizada".
5. Validar com o regulatório o uso da marca Lenzetto® e a concentração do spray.
6. Registrar em `protocolos_matriz` como `rascunho` v1.0 (GER-05). Ainda não registrei: depende da aprovação de vocês.
