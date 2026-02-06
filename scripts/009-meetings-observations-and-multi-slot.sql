-- Script 009: Adiciona coluna observations em meetings e remove constraint unique de horário
-- Permite múltiplas reuniões no mesmo horário

-- 1) Adicionar coluna de observações
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS observations TEXT;

-- 2) Remover CONSTRAINT unique de (meeting_date, meeting_time) ANTES dos indexes
-- A constraint deve ser removida primeiro pois ela depende do index
ALTER TABLE meetings DROP CONSTRAINT IF EXISTS meetings_meeting_date_meeting_time_key;
ALTER TABLE meetings DROP CONSTRAINT IF EXISTS meetings_date_time_unique;
ALTER TABLE meetings DROP CONSTRAINT IF EXISTS unique_meeting_slot;

-- 3) Agora podemos dropar os indexes (se ainda existirem após remoção das constraints)
DROP INDEX IF EXISTS meetings_meeting_date_meeting_time_key;
DROP INDEX IF EXISTS meetings_meeting_date_meeting_time_idx;
DROP INDEX IF EXISTS idx_meetings_date_time;
