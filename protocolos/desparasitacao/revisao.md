# Desparasitação — Revisão de Ativos (NEXUS)

Sessão 2026.11.10 · banco `supabase_ativos` · associações de `associacoes_ativos` e doses (moda) da FC12110 desde 01/2024.
Status: **rascunho v2**, aguardando revisão do prescritor e do farmacêutico responsável.

Ponto de partida: referência da equipe (v1, abaixo). A v2 mantém o núcleo fitoterápico e reorganiza tudo em
**3 fases simultâneas** (eliminar · proteger · reparar), com ativos e doses sustentados pelo histórico da farmácia.

## O que o banco mostrou

- **Tintura:** nogueira-preta + absinto + cravinho é o tripé real da casa (**172 / 162 / 159** associações entre si).
  A dose mais prescrita é **20%** ou **33%** de cada. A tintura de orégano (15304) é **tier C** e aparece só ~20 vezes com o tripé.
- **Óleo de orégano (14547):** dose moda **200 mg**. A v1 usava 300 mg 3x/dia (900 mg/dia).
  Em cápsula, associa com **berberina** (11).
- **Berberina (9099, tier A, 900 prescrições/ano):** dose moda 500 mg. Associa com **alicina** (47), **silimarina** (101) e óleo de orégano (11).
  É o antiparasitário fitoterápico com melhor evidência (Giardia) e faltava na v1.
- **Silimarina (61682, tier A):** dose moda **200 mg**. Associações mais fortes: **L-metionina (1.252)** e **NAC (1.155)**.
- **Menta piperita (974):** dose moda **250 mg**. Associa com **Biointestil (129)** e **bromelina (116)**.
- **Aloe vera 200:1 (31690):** associa com **L-glutamina (38)**: faz mais sentido no sachê de reparo do que na cápsula antiparasitária.
- **Ornitina (55426):** no histórico aparece com arginina, cafeína, creatina e HMB, ou seja, uso esportivo/GH, sem ligação com desparasitação.
  A detoxificação hepática fica coberta por NAC + metionina + silimarina.
- **Alecrim:** não existe extrato seco oral cadastrado (só tintura 57186 e óleo essencial tópico).

## Tabela de revisão (v2)

Para trocar ativos, informe os números com ❌ (ex.: "4 ❌, 12 ❌").

| # | Fórmula | Forma | Camada | Ativo (cdpro) · tier | Dose | Origem da dose | Status | Observação |
|---|---|---|---|---|---|---|---|---|
| 1 | F1 Cápsulas Antiparasitárias | TP1 | NAF | Berberina (9099) · A | 500 mg | FC12110 (moda) | ✅ | Novo. Interage com medicamentos (CYP3A4, metformina) |
| 2 | F1 | TP1 | BAC | Óleo de orégano (14547) · B | 200 mg | FC12110 (moda) | ✅ | Era 300 mg 3x/dia. Confirmar adsorção em cápsula dura (Aerosil) |
| 3 | F1 | TP1 | PAR | Alicina (11875) · C | 150 mg | FC12110 | ⚠️ | Substitui "alho 200 mg". Tier C → PAR. 47 associações com berberina |
| 4 | F2 Tintura Antiparasitária | TP5 | NAF | Tintura de nogueira-preta (15417) · B | 33% | FC12110 | ✅ | Era 25% |
| 5 | F2 | TP5 | BAC | Tintura de absinto (15415) · B | 33% | FC12110 | ✅ | Tujona: contraindicado em epilepsia e gestação |
| 6 | F2 | TP5 | BAC | Tintura de cravinho (15416) · B | 34% | FC12110 | ✅ | |
| 7 | F2 | | — | ~~Tintura de orégano (15304) · C~~ | — | — | ↺ | Removida: o orégano já está no F1 |
| 8 | F3 Proteção Hepática | TP1 | NAF | Silimarina (61682) · A | 200 mg | FC12110 (moda) | ✅ | Era 300 mg na cápsula da v1 |
| 9 | F3 | TP1 | BAC | N-acetilcisteína (4285) · S | 600 mg | FC12110 (moda) | ✅ | Novo. Também ajuda a romper biofilme |
| 10 | F3 | TP1 | BAC | L-metionina (60604) · A | 100 mg | FC12110 (moda) | ✅ | Novo |
| 11 | F4 Conforto Digestivo | TP1 | NAF | Biointestil® (11437) · A | 300 mg | FC12110 (moda) | ✅ | Novo |
| 12 | F4 | TP1 | BAC | Menta piperita (974) · B | 250 mg | FC12110 (moda) | ✅ | Substitui "hortelã 400 mg" |
| 13 | F4 | TP1 | BAC | Bromelina (54781) · A | 100 mg | FC12110 (moda) | ✅ | Novo |
| 14 | F4 | TP1 | BAC | Papaína (55888) · A | 100 mg | FC12110 (moda) | ✅ | Novo. 1.682 associações com bromelina |
| 15 | F5 Sachê Reparador | TP15 | NAF | L-glutamina (1552) · S | 5 g | FC12110 | ✅ | Novo |
| 16 | F5 | TP15 | BAC | Saccharomyces boulardii (8583) · B | 250 mg | FC12110 | ✅ | GER-08: probiótico em sachê. Confirmar unidade (MLH/BLH) |
| 17 | F5 | TP15 | BAC | Aloe vera 200:1 (31690) · B | 100 mg | FC12110 | ⚠️ | Movido da cápsula. Contém antraquinonas: confirmar teor |
| 18 | — | | — | ~~L-ornitina (55426) · B~~ | — | — | ↺ | Removida (uso esportivo no histórico). Volta se o prescritor quiser |
| 19 | — | | — | ~~Alecrim 300 mg~~ | — | — | ↺ | Sem extrato seco oral cadastrado |

## Regras do motor

- **GER-07:** cápsulas abaixo de 2.000 mg (F1 850 mg · F3 900 mg · F4 750 mg).
- **GER-08:** o único probiótico (S. boulardii) está em sachê.
- **GER-11:** nenhum ativo repetido entre fórmulas (a v1 repetia o orégano em tintura e óleo).
- **BAC-01:** todos os BAC têm associação direta com o NAF da própria fórmula, conferida nas duas direções.
- **PAR:** alicina (tier C) entra por invocação do prescritor.

## Posologia da v2 (rotina diária)

| Horário | O que tomar |
|---|---|
| Manhã | F2 Tintura (30 gotas em água) + F3 Proteção Hepática após o café |
| Antes do almoço | F4 Conforto Digestivo |
| Após almoço e jantar | F1 Cápsulas Antiparasitárias |
| À noite | F5 Sachê Reparador (60 dias) |

Fases 1 e 2: 30 dias. Fase 3: 60 dias.

## Opcional para o prescritor (tarja vermelha, fora do guia)

O banco tem **ivermectina (1928)**, **tinidazol (588)**, **secnidazol (2024)** e **metronidazol (54835)**.
Podem ser associados ao protocolo fitoterápico conforme o parasita identificado no exame. Albendazol, mebendazol e
nitazoxanida não estão cadastrados.

## Pendências antes da versão oficial

1. Aprovar a v2 (ou marcar ❌ na tabela).
2. Confirmar forma do óleo de orégano no F1 (cápsula dura com Aerosil ou cápsula oleosa separada).
3. Confirmar teor de antraquinonas do Aloe 200:1 e a unidade do S. boulardii.
4. Artes: capa 3:4 em tons de verde-oliva e fotos de produto (cápsulas, frasco conta-gotas, sachê).
5. Criar o link `https://medicinal.vip/protoc_Desparasitacao?r=qr`.
6. Registrar em `protocolos_matriz` como `rascunho` v1.0 (GER-05) depois da aprovação.

## Referência original (v1)

| Fórmula | Ativos | Posologia |
|---|---|---|
| Cápsulas | Hortelã 400 mg · Aloe vera 100 mg · Alho 200 mg · Alecrim 300 mg · Silimarina 300 mg | 1 dose pela manhã, 30 dias |
| Tintura | Nogueira 25% · Absinto 25% · Orégano 25% · Cravo-da-índia 25% | 30 gotas 1x ao dia, 30 dias |
| Óleo de orégano | 300 mg | 3x ao dia (café, almoço e jantar), 30 dias |
| Ornitina | 550 mg | 1 dose ao deitar, ≥ 1 h após a última refeição |
