# NADH · Energia Celular: revisão de ativos (NEXUS)

Sessão 2026.11.09 · banco `supabase_ativos` · regras do motor NEXUS (FGTS → NAF → BAC → `validate_protocolo()`).
Status: **rascunho** de material de divulgação para prescritores. Aguarda revisão do farmacêutico responsável.

**Âncora (NAF):** NADH (cdpro 2157), tier A, 3.830 prescrições (1.277 nos últimos 12 meses).
Categorias: Fadiga (primária), Longevidade e Memória e concentração.
Doses mais usadas na FC12110: 10 mg em cápsula (TP1, 2.917 registros) e 5 mg em sachê (TP15, 428 registros).

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

| # | Fórmula | Forma | Camada | Ativo (cdpro) · tier | Dose | Coprescrições com o NADH | Status | Observação |
|---|---|---|---|---|---|---|---|---|
| 1 | F1 Energia & Disposição | TP1 | NAF | NADH (2157) · A | 10 mg | — | ✅ | Âncora |
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
| 17 | F6 Sachê Recuperação | TP15 | NAF | NADH (2157) · A | 5 mg | — | ✅ | Dose da moda em sachê |
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
- **DUPLICATA:** FAIL esperado. O NADH aparece nas 6 fórmulas porque o material é de ativo âncora único
  (pedido do usuário). Fora essa exceção, nenhum outro ativo se repete.

## Pendências

1. **LipoAvail® NAD+** não tem cadastro em `ativos` (busca por "lipoavail", "lipossom" e "NAD+").
   As fórmulas usam o NADH (2157). A página 2 apresenta a tecnologia lipossomal com os dados do fabricante
   (estudos em animais). Para prescrever o LipoAvail® nas fórmulas, falta cadastrar o ativo e sua forma (PAR-02).
2. Confirmar a dose da glutationa (item 13) e a base do sachê (item 21).
3. Aplicar a correção do BAC-01 (`nexus/correcao_validate_protocolo_bac01.sql`).
4. Criar o link `https://medicinal.vip/protoc_NADH?r=qr` (QR das páginas 3 a 5).
5. Depois da aprovação, registrar em `protocolos_matriz` como `rascunho` v1.0 (GER-05). Não registrei.
