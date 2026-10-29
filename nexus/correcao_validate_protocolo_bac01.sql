-- Correção da regra BAC-01 em public.validate_protocolo() — projeto supabase_ativos (emzkiemgizgmggthaeia)
--
-- Problema: associacoes_ativos guarda cada par uma única vez, com codigo_a < codigo_b (ordem de texto).
-- A BAC-01 só procurava codigo_a = âncora NAF e codigo_b = ativo BAC, então reprovava associações
-- reais quando o código do BAC vem antes do código da âncora (ex.: Valeriana 1008 → Magnésio 4167).
--
-- O script troca só o trecho da BAC-01 por uma busca nas duas direções. Se o trecho original não for
-- encontrado (função já alterada), ele aborta sem mudar nada.
--
-- DDL: aplicar manualmente pelo owner (SOP — Enriquecimento e Auditoria, §4 e §12).

DO $$
DECLARE
  def_atual text := pg_get_functiondef('public.validate_protocolo(jsonb)'::regprocedure);
  trecho_antigo text := $old$        SELECT COUNT(DISTINCT aa.codigo_a)::INTEGER INTO qtd_ancoras
        FROM associacoes_ativos aa
        WHERE aa.codigo_b = cdpro_val::TEXT
          AND aa.codigo_a = ANY(SELECT unnest(naf_cdpros)::TEXT)
          AND aa.forma_farmaceutica = tp_val;$old$;
  trecho_novo text := $new$        -- BAC-01 bidirecional: o par pode estar gravado como (âncora, BAC) ou (BAC, âncora)
        SELECT COUNT(DISTINCT CASE WHEN aa.codigo_a = cdpro_val::TEXT THEN aa.codigo_b ELSE aa.codigo_a END)::INTEGER
          INTO qtd_ancoras
        FROM associacoes_ativos aa
        WHERE aa.forma_farmaceutica = tp_val
          AND (   (aa.codigo_b = cdpro_val::TEXT AND aa.codigo_a = ANY(SELECT unnest(naf_cdpros)::TEXT))
               OR (aa.codigo_a = cdpro_val::TEXT AND aa.codigo_b = ANY(SELECT unnest(naf_cdpros)::TEXT)));$new$;
BEGIN
  IF position(trecho_antigo in def_atual) = 0 THEN
    RAISE EXCEPTION 'Trecho da BAC-01 não encontrado — a função já foi alterada? Nada foi mudado.';
  END IF;
  EXECUTE replace(def_atual, trecho_antigo, trecho_novo);
  RAISE NOTICE 'validate_protocolo(): BAC-01 agora verifica as duas direções.';
END $$;

-- Conferência (deve retornar PASS: Valeriana 1008 tem 160 associações com Magnésio 4167 em cápsula)
-- select regra, status, mensagem from validate_protocolo('{"categorias_objetivo":[251],"formulas":[{"id":"F5","tpformafarma":1,"ativos":[{"cdpro":4167,"camada":"NAF"},{"cdpro":1008,"camada":"BAC"}]}]}'::jsonb) where regra='BAC-01';
