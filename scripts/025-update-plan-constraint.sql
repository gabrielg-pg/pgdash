-- Remove o constraint antigo de planos
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_plan_check;

-- Adiciona o novo constraint com os 4 planos actuais + SCALE legado
ALTER TABLE clients 
ADD CONSTRAINT clients_plan_check 
CHECK (plan IN ('START', 'PRO', 'SCALE', 'SCALE_VERTEBRA', 'SCALE_GLOBAL'));
