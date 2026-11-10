# Desparasitação Completa (com ivermectina e albendazol) — Revisão

Sessão 2026.11.10 · banco `supabase_ativos` · FC12110.
Status: **rascunho**, aguardando revisão do prescritor e do farmacêutico responsável.

Esta versão é a **v2 do protocolo fitoterápico** (ver `protocolos/desparasitacao/revisao.md`) com uma
**fase de ataque** de antiparasitários de prescrição (tarja vermelha) nos dias 1 e 15.

## Fase de ataque

| # | Fórmula | Forma | Ativo (cdpro) · tier | Dose | Origem da dose | Status | Observação |
|---|---|---|---|---|---|---|---|
| R1 | Ivermectina | TP1 cápsula | Ivermectina (1928) · B | 6 mg/cápsula | FC12110 (moda: 1.981 receitas de 6 mg) | ✅ | 200 mcg/kg: 1 cápsula a cada 30 kg, em jejum, dias 1 e 15 |
| R2 | Albendazol | TP1 cápsula | Albendazol (1034) · C | 400 mg | FC12110 (moda: 84 receitas) | ⚠️ | **Sem ficha técnica no banco** (nome, mecanismo e contraindicações vazios). Dias 1 e 15; 3 dias seguidos para tênia/estrongiloidíase |

## Pontos para o prescritor confirmar

1. Esquema dias 1 e 15 para as duas (a 2ª dose atinge os parasitas que eclodiram dos ovos). Alternativas comuns:
   albendazol 400 mg por 3 dias; ivermectina repetida em 7 a 10 dias.
2. Ivermectina por peso: a tabela do card arredonda para cápsulas de 6 mg (até 30 kg: 1; até 60 kg: 2; até 90 kg: 3).
   Acima de 90 kg, o prescritor ajusta (ex.: cápsula de 18 mg, 76 receitas na FC12110).
3. Contraindicações no guia: gestação, amamentação, crianças < 15 kg (ivermectina), doença hepática. Validar texto.
4. Albendazol: preencher a ficha do cdpro 1034 (nome técnico, mecanismo, contraindicações, dose).
5. Nitazoxanida, mebendazol e praziquantel não estão cadastrados. Tinidazol (588) e secnidazol (2024) existem, para Giardia/ameba.
6. Criar o link `https://medicinal.vip/protoc_DesparasitacaoRx?r=qr`.
