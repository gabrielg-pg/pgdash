-- Create daily_operations table for Scale Global clients
CREATE TABLE IF NOT EXISTS daily_operations (
  id SERIAL PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operation_date DATE NOT NULL,
  obs TEXT,
  vendas INTEGER DEFAULT 0,
  valor_vendas DECIMAL(12, 2) DEFAULT 0,
  adspend DECIMAL(12, 2) DEFAULT 0,
  cogs DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, operation_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_operations_client_date ON daily_operations(client_id, operation_date);
CREATE INDEX IF NOT EXISTS idx_daily_operations_date ON daily_operations(operation_date);
