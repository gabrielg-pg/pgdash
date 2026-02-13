-- Create stores table if not exists
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  store_number VARCHAR(50),
  region VARCHAR(50) DEFAULT 'brasil',
  plan VARCHAR(100),
  progress INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'em_andamento',
  drive_link TEXT,
  collections TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table if not exists
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255),
  birth_date DATE,
  cpf VARCHAR(20),
  address TEXT,
  address_number VARCHAR(20),
  cep VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create store_accounts table if not exists
CREATE TABLE IF NOT EXISTS store_accounts (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  account_type VARCHAR(100),
  login VARCHAR(255),
  password VARCHAR(255),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add collections column if stores already existed without it
ALTER TABLE stores ADD COLUMN IF NOT EXISTS collections TEXT;
