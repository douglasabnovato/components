# Documentação do components

Documentação técnica do monorepo **components**: estado atual, arquitetura, testes, operação da hospedagem, backlog, próximos passos e registro de decisões. A visão geral do projeto está no [readme da raiz](../readme.md).

| Documento | Conteúdo |
| --- | --- |
| [01 · Estado atual](01-estado-atual.md) | Inventário, qualidade, publicação e riscos de hoje, com a linha de base de 24/10 |
| [02 · Arquitetura](02-plano-de-arquitetura.md) | Arquitetura em produção, os três ambientes e o caminho de cada requisição |
| [03 · Plano de testes](03-plano-de-testes.md) | Estratégia de testes, situação de cada nível e critério "todo clicável funciona" |
| [04 · Hospedagem](04-hospedagem.md) | Guia de operação: Render, Vercel, validação, nova versão e problemas comuns |
| [05 · Ajustes e backlog](05-ajustes-e-backlog.md) | Ajustes identificados, prioridade, status e histórico |
| [06 · Próximos passos](06-proximos-passos.md) | O que falta para o MVP estável e a evolução depois dele, sob a ótica de engenharia |
| [ADRs](adr/) | Decisões de arquitetura registradas (0001 a 0004) |

Documentação por pacote:

| Pacote | README |
| --- | --- |
| Servidor de produção | [apps/servidor](../apps/servidor/README.md) |
| Testes de ponta a ponta | [packages/testes-e2e](../packages/testes-e2e/README.md) |
| UI e mapa do ecossistema | [packages/ui](../packages/ui/README.md) |
| API e cada projeto filho | README na pasta de cada um |

## Definição de MVP estável

O components é considerado MVP estável quando:

| # | Critério | Situação |
| --- | --- | --- |
| 1 | **Todo elemento clicável funciona** no hub e nos 8 filhos, comprovado por teste automatizado | ⏳ Navegação hub ↔ filhos comprovada (T-01); clicáveis dentro dos filhos pendentes (A-12) |
| 2 | `pnpm verificar` passa (lint, tipos, testes e build) | ✅ |
| 3 | O CI roda a verificação e os testes de navegação em todo pull request | ✅ Configurado; tornar obrigatório na `main` (A-27) |
| 4 | O projeto está publicado e os testes de navegação passam contra a versão publicada | ⏳ Estático publicado; Render (A-09) e fumaça (A-11) pendentes |
| 5 | Esta documentação está atualizada | ✅ |

_Última revisão: 26/10/2026._
