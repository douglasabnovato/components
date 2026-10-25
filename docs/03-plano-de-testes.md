# 03 · Plano de testes

## Objetivo

Provar automaticamente que **todo elemento clicável funciona** e impedir regressões, em desenvolvimento e na versão publicada.

## Pirâmide de testes

| Nível | Ferramenta | O que cobre | Situação |
| --- | --- | --- | --- |
| Unidade | Vitest | Regras de negócio em funções puras | ✅ Presente em todos os projetos |
| Componente | Vitest + Testing Library + axe | Telas, interação e acessibilidade | ✅ Presente; fraco no hub |
| Integração | Vitest + PGlite em memória | Rotas da API com banco real | ✅ Presente na API |
| Ponta a ponta (projeto) | Playwright | Formulários com e sem JavaScript | ✅ Só no projeto 04 |
| **Navegação do ecossistema** | Playwright | Hub ↔ filhos | ❌ A criar |
| **Clicáveis por projeto** | Playwright | Todo botão e link de cada filho | ❌ A criar |
| **Fumaça em produção** | Playwright | Navegação contra a URL publicada | ❌ A criar |

## Cobertura atual por projeto

| Projeto | Arquivos de teste | Avaliação |
| --- | --- | --- |
| Laboratório | 18 | Referência do projeto |
| Flix | 4 | Bom |
| Formulários | 3 (inclui Playwright) | Bom |
| Pelada, Trilha, UI | 3 cada | Adequado |
| Cadastro, Heróis, Tarefas | 2 cada | Ampliar fluxos principais |
| **Hub** | **1** | **Insuficiente para o centro da navegação** |
| API, Contratos | 1 cada | Adequado ao tamanho |

## Novos testes

### T-01 · Navegação do ecossistema

Pacote `testes-e2e` (Playwright), usando o `ecossistema.ts` como gabarito. Sobe a API, o hub e os 8 filhos automaticamente.

| Caso | Pronto quando |
| --- | --- |
| Hub carrega sem erros de console | Nenhum erro ou exceção |
| Toda âncora interna do hub tem destino | Nenhuma âncora órfã |
| Hub tem link para os 8 filhos | 8 de 8 |
| Cada filho abre a partir do hub | 8 de 8, sem erros de console |
| Cada filho volta ao hub | 8 de 8 |

### T-02 · Clicáveis por projeto

Para cada filho: percorrer botões e links visíveis, acionar cada um e falhar se houver erro de console, exceção ou link para página inexistente. Fluxos destrutivos (excluir, limpar) entram com confirmação controlada no teste.

### T-03 · Fluxos principais

| Projeto | Fluxo |
| --- | --- |
| Flix | Filtrar categoria e abrir um vídeo |
| Cadastro | Criar, editar e excluir cliente no modo API |
| Heróis | Filtrar, abrir ficha e comparar dois heróis |
| Formulários | Enviar com e sem JavaScript (já existe) |
| Tarefas | Criar, concluir e buscar tarefa |
| Pelada | Inscrever, encher vagas, ir para espera e sortear |
| Laboratório | Abrir uma lição e alternar desafio e solução |
| Trilha | Marcar aprendizado e ver o progresso mantido |

### T-04 · Testes do hub

Seções renderizadas, demos funcionando com dados reais, cabeçalho destacando a seção ativa e links para os filhos.

### T-05 · Fumaça em produção

Rodar T-01 contra a URL publicada (ou contra o ensaio de produção local), depois de cada deploy.

## Integração contínua

Workflow no GitHub Actions, em todo push e pull request:

| Etapa | Comando |
| --- | --- |
| Instalação | `pnpm install --frozen-lockfile` |
| Verificação | `pnpm verificar` |
| Navegadores | `pnpm --filter @components/testes-e2e exec playwright install --with-deps chromium` |
| Navegação | `pnpm test:navegacao` |
| Ponta a ponta do 04 | `pnpm test:e2e` |

A versão do Node vem do arquivo `.node-version`.

## Definição de pronto (testes)

- `pnpm verificar` verde.
- T-01 verde em desenvolvimento e em produção.
- T-02 verde nos 8 filhos.
- Um fluxo principal (T-03) por filho.
- CI obrigatório para merge na `main`.
