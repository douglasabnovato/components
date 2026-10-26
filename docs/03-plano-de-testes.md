# 03 · Plano de testes

## Objetivo

Provar automaticamente que **todo elemento clicável funciona** e impedir regressões, em desenvolvimento e na versão publicada.

## Pirâmide de testes

| Nível | Ferramenta | O que cobre | Situação |
| --- | --- | --- | --- |
| Unidade | Vitest | Regras de negócio em funções puras | ✅ Presente em todos os projetos |
| Componente | Vitest + Testing Library + axe | Telas, interação e acessibilidade | ✅ Presente; fraco no hub (A-14) |
| Integração | Vitest + PGlite em memória | Rotas da API com banco real | ✅ Presente na API |
| Integração do servidor | Vitest | Composição de API, SSR e ensaio (`apps/servidor`) | ✅ 11 casos |
| Ponta a ponta (projeto) | Playwright | Formulários com e sem JavaScript | ✅ Só no projeto 04 |
| **Navegação do ecossistema (T-01)** | Playwright | Hub ↔ filhos | ✅ 11 de 11 em desenvolvimento e no ensaio |
| **Clicáveis por projeto (T-02)** | Playwright | Todo botão e link de cada filho | ❌ A criar (A-12) |
| **Fumaça em produção (T-05)** | Playwright | Navegação contra a URL publicada | ⏳ Ferramenta pronta; aguarda o Render (A-11) |

## Cobertura atual por projeto

| Projeto | Arquivos de teste | Avaliação |
| --- | --- | --- |
| Laboratório | 18 | Referência do projeto |
| Flix | 4 | Bom |
| Formulários | 3 (inclui Playwright) | Bom |
| Pelada, Trilha, UI | 3 cada | Adequado |
| Cadastro, Heróis, Tarefas | 2 cada | Ampliar fluxos principais |
| **Hub** | **1** | **Insuficiente para o centro da navegação** |
| API, Contratos, Servidor | 1 cada | Adequado ao tamanho |
| Testes de ponta a ponta | 1 (T-01, 11 casos) | Cobre a navegação entre projetos |

## Novos testes

### T-01 · Navegação do ecossistema

**Situação:** ✅ implementado (A-03). 11 de 11 em desenvolvimento (1,9 min) e no ensaio de produção (26 s).

Pacote `packages/testes-e2e` (Playwright), usando o `ecossistema.ts` como gabarito. Uso detalhado no [README do pacote](../packages/testes-e2e/README.md). Sobe a API, o hub e os 8 filhos automaticamente, nas portas de desenvolvimento (reaproveita os que já estiverem rodando, por exemplo com `pnpm dev:tudo`).

```bash
pnpm --filter @components/testes-e2e exec playwright install chromium   # só na primeira vez
pnpm test:navegacao
```

Todo teste do pacote falha se a página registrar erro de console ou exceção (`suporte/teste.ts`); ruídos inofensivos só entram na lista de ignorados com o motivo.

| Caso | Pronto quando |
| --- | --- |
| Hub carrega sem erros de console | Nenhum erro ou exceção |
| Toda âncora interna do hub tem destino | Nenhuma âncora órfã |
| Hub tem link para os 8 filhos | 8 de 8 |
| Cada filho abre a partir do hub | 8 de 8, sem erros de console |
| Cada filho volta ao hub | 8 de 8 |

### T-02 · Clicáveis por projeto

**Situação:** a criar (A-12), no mesmo pacote `packages/testes-e2e`, em `testes/clicaveis/`, reaproveitando o teste base que falha com erro de console.

Para cada filho: percorrer botões e links visíveis, acionar cada um e falhar se houver erro de console, exceção ou link para página inexistente. Fluxos destrutivos (excluir, limpar) entram com confirmação controlada no teste.

### T-03 · Fluxos principais

**Situação:** a criar (A-15). O fluxo do Formulários já existe.

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

**Situação:** a criar (A-14).

Seções renderizadas, demos funcionando com dados reais, cabeçalho destacando a seção ativa e links para os filhos.

### T-05 · Fumaça em produção

**Situação:** ⏳ validado no ensaio local; falta rodar contra o site publicado, depois do Render (A-11). Automatizar após cada deploy é o A-28.

Rodar T-01 contra a URL publicada (ou contra o ensaio de produção local), depois de cada deploy. Com `URL_BASE`, o Playwright não sobe servidores e testa o endereço informado:

```bash
# PowerShell
$env:URL_BASE="http://localhost:3333/"; pnpm test:navegacao   # ensaio local
$env:URL_BASE="https://components-dusky-nine.vercel.app/"; pnpm test:navegacao   # publicado
Remove-Item Env:URL_BASE   # volta ao modo de desenvolvimento
```

## Integração contínua

Workflow no GitHub Actions, em todo push e pull request:

| Etapa | Comando |
| --- | --- |
| Instalação | `pnpm install --frozen-lockfile` |
| Verificação | `pnpm verificar` |
| Navegadores | `pnpm --filter @components/testes-e2e exec playwright install --with-deps chromium` |
| Navegação | `pnpm test:navegacao` |
| Ponta a ponta do 04 | `pnpm test:e2e` |

**Situação:** ✅ configurado (A-04); falta confirmar a execução verde na `main` e torná-lo obrigatório (A-27).

Arquivo: `.github/workflows/ci.yml`. Execuções simultâneas da mesma branch são canceladas, mantendo só a mais recente. A versão do Node vem do arquivo `.node-version` e a do pnpm, do campo `packageManager`. Em caso de falha, os relatórios do Playwright ficam como artefato da execução por 7 dias.

## Definição de pronto (testes)

| Critério | Situação |
| --- | --- |
| `pnpm verificar` verde | ✅ |
| T-01 verde em desenvolvimento | ✅ |
| T-01 verde em produção (T-05) | ⏳ A-11 |
| T-02 verde nos 8 filhos | ❌ A-12 |
| Um fluxo principal (T-03) por filho | ❌ A-15 |
| CI obrigatório para merge na `main` | ❌ A-27 |

## Como acrescentar um teste de navegador

1. Criar o arquivo `*.spec.ts` em `packages/testes-e2e/testes/<grupo>/`.
2. Importar `test` e `expect` de `../../suporte/teste` (não de `@playwright/test`), para herdar a verificação de erros de console.
3. Usar o `ecossistema.ts` como gabarito, nunca endereços escritos à mão.
4. Rodar em desenvolvimento e no ensaio antes do commit.
