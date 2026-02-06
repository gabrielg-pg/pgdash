## Branch `lendaria` — instruções para a equipe

Reescrevi o histórico da branch `lendaria` para remover blobs grandes (.next cache e binários nativos). Para sincronizar com a nova história faça um dos seguintes passos localmente:

Opção 1 — atualizar a branch existente (descarta mudanças locais não commitadas na branch):

```powershell
git fetch origin
git checkout lendaria
git reset --hard origin/lendaria
```

Opção 2 — re-clonar (mais simples para evitar surpresas):

```powershell
git clone <repo-url>
git checkout lendaria
```

Notas:
- Atualizei `.gitignore` para prevenir commits futuros de `.next`/cache e do binário `next-swc`.
- Se alguém precisar preservar trabalho não commitado, faça um backup (patch ou branch temporária) antes de resetar.

Se quiser, eu também posso abrir um PR com essas mudanças ou enviar uma mensagem pronta para os colaboradores explicando o que foi feito.
