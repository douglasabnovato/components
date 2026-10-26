# 06 · Próximos passos

Visão de engenharia sobre o que falta para o MVP estável e como o projeto deve evoluir depois dele. Cada item aponta para um ID do [backlog](05-ajustes-e-backlog.md), onde ficam o status e o histórico.

## Onde estamos (26/10/2026)

| Área | Situação |
| --- | --- |
| Código | Hub, 8 filhos, API e servidor de produção na `main` |
| Verificação | `pnpm verificar` verde; CI configurado para todo push e pull request |
| Navegação | T-01 com 11 de 11 em desenvolvimento e no ensaio de produção |
| Publicação | Parte estática no ar (Vercel); parte dinâmica (Render) pendente |

O único bloqueio funcional do MVP é a parte dinâmica: sem o Render, a API (Tarefas e Cadastro no modo API) e o Formulários não respondem no site publicado.

## Critério de priorização

Os itens foram ordenados por quatro perguntas, nesta ordem:

1. **Risco para o MVP:** bloqueia a definição de MVP estável ([docs/README.md](README.md))?
2. **Impacto para quem visita:** o problema é visível para quem abre o portfólio?
3. **Proteção contra regressão:** reduz a chance de algo que funciona hoje quebrar sem aviso?
4. **Esforço e reversibilidade:** é barato e fácil de desfazer?

## Horizonte 1 · Concluir o MVP

Itens que fecham a definição de MVP estável.

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-09 | Serviço `components-servidor` no Render | API e Formulários não respondem no site publicado | `/api/saude` responde pelo Render e pela Vercel |
| A-38 | Servidor dentro de 512 MB | O primeiro deploy estourou a memória do plano gratuito na subida | Serviço Live, sem `Out of memory`, com a memória de cada etapa no log |
| A-08 | Validar o `vercel.json` em produção | Rotas internas e encaminhamentos só se comprovam publicados | `/trilha/aprendizado/1`, `/api/saude` e `/formularios/` funcionam pelo domínio da Vercel |
| A-11 | Fumaça em produção (T-05) | Provar que o site publicado se comporta como o ensaio | T-01 com `URL_BASE` do site publicado em 11 de 11 |
| A-04 | Confirmar o CI na `main` | O CI só cumpre o papel se estiver verde na branch publicada | Execução verde do merge na `main` |
| A-27 | Proteger a `main` | Hoje um merge pode entrar com o CI vermelho | Regra de proteção exigindo o job "Verificação e navegação" |
| A-12, A-13 | Clicáveis por projeto (T-02) e correções | O critério "todo clicável funciona" ainda não é medido dentro dos filhos | T-02 verde nos 8 filhos |

## Horizonte 2 · Consolidar a qualidade

Itens que reduzem regressões e dívidas visíveis, sem mudar a arquitetura.

### Testes

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-14 | Testes do hub (T-04) | O hub é o centro da navegação e tem só 1 arquivo de teste | Seções, demos e links cobertos |
| A-15 | Fluxos principais (T-03) | Os testes de navegação não exercitam as regras de negócio pela tela | Um fluxo por filho |
| A-32 | Acessibilidade nos testes de navegador | O axe hoje roda só em componentes isolados | Verificação axe nas páginas do T-01 |

### Manutenção

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-26 | Título e descrição do hub | A aba e os buscadores dizem "7 projetos"; são 8 | `index.html` do hub com 8 projetos e a Trilha |
| A-16 | `strictPort: true` no hub | Se a porta 5170 estiver ocupada, os botões de voltar quebram em desenvolvimento | Hub falha em vez de mudar de porta |
| A-17 | Flix usar `enderecoDoHub(1)` | Único filho fora da fonte única de endereços | Todos os filhos usam o mapa do ecossistema |
| A-19 | Ignorados órfãos no ESLint e Prettier | Configuração com pastas que não existem | Sem entradas órfãs |

### Processo

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-23 | `CONTRIBUTING.md` | Fluxo de branches (`feature/*` → `developer-mvp` → `main`) e padrão de commits só existem na prática | Fluxo e Conventional Commits documentados |
| A-35 | Modelo de pull request | PRs sem roteiro de verificação | `.github/pull_request_template.md` com checklist |
| A-24 | `CLAUDE.md` | Contexto e regras repetidos a cada sessão de trabalho | Arquivo na raiz com regras do projeto |

## Horizonte 3 · Evoluir

Itens que melhoram desempenho, segurança e operação. Nenhum bloqueia o MVP.

### Desempenho

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-20 | Carregamento sob demanda no hub | 685 kB de JavaScript na primeira visita | JavaScript inicial bem abaixo de 685 kB |
| A-21 | Fontes só com alfabeto latino | Arquivos de cirílico, grego e vietnamita sem uso | Build sem esses subconjuntos |
| A-33 | Orçamento de desempenho no CI | Sem medida, o tamanho volta a crescer | CI falha acima de um limite de JavaScript inicial |

### Segurança

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-30 | Atualização automática de dependências e `pnpm audit` no CI | A-02 foi manual; novas vulnerabilidades surgem sem aviso | Dependabot ou Renovate ativo e audit de nível alto no CI |
| A-31 | Cabeçalhos de segurança na Vercel | Sem `Content-Security-Policy`, `X-Content-Type-Options` e afins | Cabeçalhos no `vercel.json`, sem quebrar os filhos |
| A-25 | ESLint 10 | A linha 9 saiu de suporte | `pnpm lint` verde no ESLint 10 |

### Operação e observabilidade

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-28 | Fumaça automática após cada deploy | Hoje o T-05 depende de alguém rodar | Workflow que roda o T-01 contra produção após o deploy |
| A-29 | Monitoramento de disponibilidade | Uma queda só é percebida por quem visita | Verificação periódica de `/` e `/api/saude` com alerta |
| A-34 | Captura de erros em produção | Erros no navegador e no servidor não são registrados | Erros do navegador e do servidor visíveis num painel |

### Dados

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-37 | Banco persistente (condicional) | No Render gratuito, o PGlite volta aos dados de exemplo a cada reinício | Só se a persistência passar a ser requisito: Postgres gerenciado via Drizzle, registrado em ADR |

### Estrutura

| ID | Item | Motivação | Pronto quando |
| --- | --- | --- | --- |
| A-18 | Mover `1-flix` para `apps/flix` | Único projeto fora do padrão de pastas | Todos os apps em `apps/` |
| A-36 | Domínio mais legível (opcional) | `components-dusky-nine.vercel.app` foi gerado automaticamente | Domínio escolhido, refletido no `ORIGENS` e na documentação |

## Sequência recomendada

1. **A-38 → A-09 → A-08 → A-11:** cabe na memória, sobe o Render, valida as regras da Vercel e roda a fumaça. Fecha a publicação.
2. **A-04 → A-27:** confirma o CI e torna-o obrigatório. A partir daqui, nada entra na `main` sem verificação.
3. **A-26:** correção pequena e visível para todo visitante.
4. **A-12 → A-13:** mede e corrige os clicáveis. Fecha o critério central do MVP.
5. **A-23 e A-35:** registra o processo antes de o projeto crescer.
6. **Horizonte 2 restante e Horizonte 3**, na ordem das tabelas, revisando a prioridade a cada ciclo.

## Decisões futuras a registrar

| Tema | Quando registrar |
| --- | --- |
| Persistência dos dados (A-37) | Se a persistência virar requisito |
| Ferramenta de monitoramento e de captura de erros (A-29, A-34) | Ao escolher o serviço |
| Saída do plano gratuito do Render | Se a espera para acordar prejudicar a demonstração |
