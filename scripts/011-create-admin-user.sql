-- Script 011: Cria usuário admin com senha 'admin'
-- Hash bcrypt para a senha 'admin'

-- Primeiro, deleta o usuário admin se existir para garantir a senha correta
DELETE FROM users WHERE username = 'admin';

-- Insere o usuário admin com senha 'admin'
-- Hash gerado com bcrypt (10 rounds) para a string 'admin'
INSERT INTO users (username, email, password_hash, name, role, status)
VALUES (
  'admin',
  'admin@progrowth.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Y6VdBkXpLmJeUqTDmu',
  'Administrador',
  'admin',
  'ativo'
);
