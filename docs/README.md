# Documentação do components

Documentação técnica do monorepo **components**: estado atual, planos para o MVP e registro de decisões.

| Documento | Conteúdo |
| --- | --- |
| [01 · Estado atual](01-estado-atual.md) | Inventário, arquitetura, qualidade e riscos do projeto hoje |
| [02 · Plano de arquitetura](02-plano-de-arquitetura.md) | Arquitetura-alvo do MVP publicado |
| [03 · Plano de testes](03-plano-de-testes.md) | Estratégia de testes e critério "todo clicável funciona" |
| [04 · Hospedagem](04-hospedagem.md) | Onde e como publicar, passo a passo |
| [05 · Ajustes e backlog](05-ajustes-e-backlog.md) | Registro dos ajustes identificados, prioridade e status |
| [ADRs](adr/) | Decisões de arquitetura registradas |

## Definição de MVP estável

O components é considerado MVP estável quando:

1. **Todo elemento clicável funciona** no hub e nos 8 filhos, comprovado por teste automatizado.
2. `pnpm verificar` passa (lint, tipos, testes e build).
3. O CI roda a verificação e os testes de navegação em todo pull request.
4. O projeto está publicado e os testes de navegação passam contra a versão publicada.
5. Esta documentação está atualizada.

_Última revisão: 24/10/2026._
