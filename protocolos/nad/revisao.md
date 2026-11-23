# NAD+ · Energia Celular: revisão de ativos (NEXUS)

Sessão 2026.11.09 · banco `supabase_ativos` · regras do motor NEXUS (FGTS → NAF → BAC → `validate_protocolo()`).
Status: **rascunho** de material de divulgação para prescritores. Aguarda revisão do farmacêutico responsável.

**Nomenclatura:** o material apresenta o ativo como **NAD+ (LipoAvail®)**, conforme pedido. O LipoAvail® NAD+
**não tem cadastro** no banco (busca por "lipoavail", "lipossom", "NAD+", "coenzima I"), então a **lógica de
associação** (quais ativos combinam, em que forma) foi rodada com a âncora real registrada: **NADH (cdpro 2157)**.
Nas cápsulas, a dose do NAD+ foi fixada em **50 mg** (teto da faixa usual do LipoAvail®, 10–50 mg/dia), e não na
moda do NADH (10 mg), porque são matérias-primas distintas.

**Âncora (NAF) no banco:** NADH (cdpro 2157), tier A, 3.830 prescrições (1.277 nos últimos 12 meses).
Categorias: Fadiga (primária), Longevidade e Memória e concentração.
Doses mais usadas na FC12110: 10 mg em cápsula (TP1, 2.917 registros) e 5 mg em sachê (TP15, 428 registros).

## NAD+ Nasal (página destaque) — fundamentação da dose

Camada **PAR** (forma tópica/nasal, fora da triagem FGTS). **Não há dose intranasal humana estabelecida** —
ClinicalTrials.gov e PubMed não têm ensaio clínico de NAD+ intranasal. A proposta é **extrapolada de dados
pré-clínicos** e por isso vem marcada como uso off-label a validar:

| Fonte | Modelo | Dose intranasal | Achado |
|---|---|---|---|
| Won SJ et al., J Neurotrauma 2012 (PMID 22352983) | ratos (TCE) | 20 mg/kg em 60 µL salina | ↑ NAD+ hipocampal, ↓ morte neuronal |
| Yoo SH et al., Exp Mol Med 2026 (PMID 42380286) | camundongos (anosmia) | 100 mg/kg/dia, 4 semanas | restaura olfato; intranasal > intraperitoneal |
| Grant R et al., Front Aging Neurosci 2019 | humanos | 750 mg IV em 6 h | NAD+ bem tolerado (referência de segurança) |

Proposta de rótulo: **NAD+ (LipoAvail®) 10 mg/mL** em **Nasalan®** (veículo nasal cadastrado, cdpro 11867,
tier B, 482 usos — forma gotas/spray 0,1 mL é a mais frequente), frasco spray 30 mL, **1 jato/narina, 1–2×/dia**
(≈ 1 mg/jato). Veículo e concentração a confirmar com o farmacêutico. A dose nasal **não** foi submetida ao motor
(é PAR); a página existe por pedido do prescritor.

**Lógica das associações:** cada fórmula parte do NADH. Os associados (BAC) saíram de `associacoes_ativos`
(pares com o NADH na mesma forma farmacêutica, buscados nas duas direções). Passaram pelo FGTS (tier S/A/B) e
foram ranqueados pelo número de coprescrições. A BAC-05 deu preferência a quem tem indicação primária na
categoria da fórmula. As doses são a moda da FC12110 nas requisições em que o ativo aparece junto com o NADH.

Categorias do objetivo: Fadiga (303), Adaptógenos (158), Performance física (114), Longevidade (159),
Antioxidantes sistêmicos (157), Memória e concentração (255), Neuroproteção (256), Saúde hepática (272),
Detoxificação hepática (160), Insuficiência cardíaca (118), Hipertensão arterial (117), Fibromialgia (109),
Recuperação pós-treino (178).

## Tabela de revisão

Para trocar ativos, informe os números com ❌ (ex.: "7 ❌, 15 ❌").

Nas fórmulas abaixo, o NAD+ (LipoAvail®) ocupa o lugar da âncora NADH (2157); as doses do NAD+ são 50 mg (oral)
e a dose nasal é tratada à parte (acima).

| # | Fórmula | Forma | Camada | Ativo (cdpro) · tier | Dose | Coprescrições com o NADH | Status | Observação |
|---|---|---|---|---|---|---|---|---|
| 1 | F1 Energia & Disposição | TP1 | NAF | NAD+ LipoAvail® (NADH 2157) · A | 50 mg | — | ✅ | Âncora. Dose 50 mg pela faixa do LipoAvail® |
| 2 | F1 | TP1 | BAC | Teacrine® (10579) · A | 150 mg | 363 | ✅ | Fadiga (primária) |
| 3 | F1 | TP1 | BAC | Sulbutiamina (19689) · B | 150 mg | 70 | ✅ | Fadiga (primária) |
| 4 | F1 | TP1 | BAC | Rhodiola rosea (4032) · A | 100 mg | 168 | ✅ | Adaptógenos (primária) |
| 5 | F2 Longevidade Celular | TP1 | BAC | PQQ: Bioactive Quinone® (6955) · A | 10 mg | 708 | ✅ | Longevidade (primária) |
| 6 | F2 | TP1 | BAC | Resveratrol (2671) · S | 100 mg | 99 | ✅ | Longevidade (primária) |
| 7 | F2 | TP1 | BAC | Nicotinamida (54951) · S | 35 mg | 75 | ⚠️ | Prioridade 2 (Longevidade como adjuvante). Precursora do NAD+ |
| 8 | F3 Foco & Memória | TP1 | BAC | Magnésio L-treonato (9875) · S | 300 mg | 74 | ✅ | Memória (primária) |
| 9 | F3 | TP1 | BAC | Acetil-L-carnitina (13899) · B | 100 mg | 175 | ✅ | Memória (primária) |
| 10 | F3 | TP1 | BAC | Bacopa monnieri (6502) · B | 100 mg | 16 | ✅ | Memória (primária) |
| 11 | F4 Fígado em Equilíbrio | TP1 | BAC | Silimarina (61682) · A | 300 mg | 94 | ✅ | Saúde hepática (primária) |
| 12 | F4 | TP1 | BAC | N-acetilcisteína (4285) · S | 200 mg | 221 | ⚠️ | Prioridade 2 (hepática como adjuvante) |
| 13 | F4 | TP1 | BAC | Glutationa reduzida (942) · A | 100 mg | 88 | ⚠️ | A moda com o NADH é 15 mg (43x). Usei 100 mg, a 2ª dose mais frequente (33x). Confirmar |
| 14 | F5 Coração Ativo | TP1 | BAC | Coenzima Q10 (38702) · S | 100 mg | 1.139 | ✅ | Par mais forte do NADH |
| 15 | F5 | TP1 | BAC | Taurina (835) · S | 200 mg | 47 | ✅ | Hipertensão (primária) |
| 16 | F5 | TP1 | BAC | Magnésio bisglicinato Quelatron (4167) · S | 200 mg | 581 | ⚠️ | Prioridade 2 (hipertensão como adjuvante) |
| 17 | F6 Sachê Recuperação | TP15 | NAF | NAD+ LipoAvail® (NADH 2157) · A | 50 mg | — | ✅ | Dose da moda em sachê |
| 18 | F6 | TP15 | BAC | D-ribose (3785) · B | 5 g | 118 | ✅ | Fadiga (primária) |
| 19 | F6 | TP15 | BAC | L-carnitina base (98589) · A | 500 mg | 190 | ⚠️ | Prioridade 2 (fadiga e recuperação como adjuvantes) |
| 20 | F6 | TP15 | BAC | Dimalato de magnésio (8799) · S | 300 mg | 19 | ✅ | Fibromialgia (primária) |
| 21 | F6 | TP15 | veículo | Base sabor neutro | q.s.p. 1 sachê | — | ⚠️ | Preferi base neutra a "base suco", porque o NADH é instável em meio ácido. Confirmar |

## Resultado da `validate_protocolo()`

- **FGTS:** PASS para os 24 ativos (todos no tier S/A/B).
- **NAF-01:** PASS. O NADH tem registro em TP1 e TP15.
- **GER-07:** PASS. A maior cápsula soma 610 mg (F4).
- **GER-08:** não se aplica (sem probióticos).
- **BAC-05:** 5 alertas de Prioridade 2 (itens 7, 12, 16, 19 e 21 acima, este sem relação com a regra).
- **BAC-01:** 2 FAIL **falsos**: Glutationa (942) e Taurina (835). Os pares existem no banco gravados como
  (942, 2157) com 88 coprescrições e (835, 2157) com 47. A função ainda procura só `codigo_a = NAF`.
  É o mesmo bug documentado em `nexus/correcao_validate_protocolo_bac01.sql`, que **ainda não foi aplicado**.
- **DUPLICATA:** FAIL esperado. O NAD+ (âncora NADH 2157) aparece em todas as fórmulas porque o material é de
  ativo âncora único (pedido do usuário). Fora essa exceção, nenhum outro ativo se repete.
- **NAD+ Nasal:** não entra na `validate_protocolo()` — é camada PAR (forma nasal), com dose extrapolada de
  dados pré-clínicos (ver seção acima).

## Pendências

1. **LipoAvail® NAD+** não tem cadastro em `ativos` (busca por "lipoavail", "lipossom", "NAD+", "coenzima I").
   A lógica de associação usa o NADH (2157). A página sobre tecnologia lipossomal traz os dados do fabricante
   (estudos em animais). Para prescrever o LipoAvail® nas fórmulas e no spray, falta cadastrar o ativo e as
   formas (cápsula, sachê e **nasal**) pela PAR-02.
2. **NAD+ Nasal:** validar com o farmacêutico/regulatório a concentração (10 mg/mL), o veículo (Nasalan®), a
   dose por jato e o uso **off-label** (não há dose intranasal humana estabelecida).
3. Confirmar a dose da glutationa (item 13) e a base do sachê (item 21).
4. Aplicar a correção do BAC-01 (`nexus/correcao_validate_protocolo_bac01.sql`).
5. Criar o link `https://medicinal.vip/protoc_NAD?r=qr` (QR das fórmulas).
6. Depois da aprovação, registrar em `protocolos_matriz` como `rascunho` v1.0 (GER-05). Não registrei.
