-- Update Nexus Growth role permissions:
-- 1. Remove: Configurações (settings.view)
-- 2. Add: Ver Acessos (accesses.view)

-- Remove settings.view permission from Nexus Growth
DELETE FROM role_permissions 
WHERE role_id = (SELECT id FROM roles WHERE name = 'Nexus Growth')
  AND permission_id = (SELECT id FROM permissions WHERE code = 'settings.view');

-- Add accesses.view permission to Nexus Growth
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Nexus Growth' 
  AND p.code = 'accesses.view'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Update the role description to reflect the new permissions
UPDATE roles 
SET description = 'Acesso para equipe Nexus Growth - Dashboard, Clientes, Usuarios, Mapa, Relatorios, Avisos e Acessos'
WHERE name = 'Nexus Growth';
