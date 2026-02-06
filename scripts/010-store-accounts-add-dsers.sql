-- Script 010: Adiciona 'dsers' como tipo de conta válido em store_accounts
-- Se houver CHECK constraint em account_type, atualiza para incluir dsers

-- Primeiro, tenta remover a constraint existente (se houver)
ALTER TABLE store_accounts DROP CONSTRAINT IF EXISTS store_accounts_account_type_check;
ALTER TABLE store_accounts DROP CONSTRAINT IF EXISTS check_account_type;

-- Adiciona nova constraint incluindo dsers
ALTER TABLE store_accounts ADD CONSTRAINT store_accounts_account_type_check 
CHECK (account_type IN ('gmail', 'shopify', 'yampi', 'hostinger', 'appmax', 'hypersku', 'dsers'));
