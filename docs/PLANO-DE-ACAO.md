# Plano de ação

Plano por ciclo. O estado dos critérios fica só no [`MVP.md`](MVP.md).

## Ciclo de 09/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-09`, criada a partir da `developer/sprint-2026-11-12`, com PR para a sprint. A `main` fica com o responsável (PR #35). Nível: Produto (N3). Escopo: só os critérios que o código resolve (6, 7, 8); o servidor no Render (#28) é do responsável.

### Produto
- **Problema e público:** quem avalia o portfólio abre o site sem o servidor no ar. Hoje Cadastro (origem API) e Tarefas ficam em "Carregando…" sem fim, e o texto de falha manda rodar `pnpm dev:api`, que não serve para quem está no site.
- **Hipótese e meta:** se a falha aparecer em até 15 s com uma explicação do site, quem avalia entende que é a demonstração fora do ar, não um defeito do código. Meta: falha visível e testada nas duas demos que usam a API; acessibilidade sem alertas no Lighthouse; os 8 aplicativos percorridos por teclado com teste.
- **O que a pesquisa trouxe:**
  - O `fetchBaseQuery` do RTK Query aceita `timeout`; quando o prazo estoura, o erro vem com status `TIMEOUT_ERROR`, separado de `FETCH_ERROR` ([Redux Toolkit, fetchBaseQuery](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery)). Uma página de erro em HTML (502/504 do encaminhamento) chega como `PARSING_ERROR`, com o status real em `originalStatus` (conferido no teste).
  - Slides de carrossel que não estão em destaque não devem receber foco; o atributo `inert` tira o conteúdo do foco e da árvore de acessibilidade de uma vez, o que `tabindex="-1"` no contêiner não faz ([WebKit, inert](https://webkit.org/blog/12578/non-interactive-elements-with-the-inert-attribute/); [WebAIM, carrosséis](https://webaim.org/techniques/carousels/)).
  - O atraso de renderização do LCP vem de JavaScript ou tarefas longas antes da pintura, inclusive hidratação; o Lighthouse simula a rede e a CPU, então serve para comparar versões, não para prever o campo ([web.dev, otimizar o LCP](https://web.dev/articles/optimize-lcp); [DebugBear, atraso de renderização](https://www.debugbear.com/blog/lcp-render-delay)).
- **Backlog (impacto × esforço):**
  1. Prazo e 502/503/504 como "API fora do ar", com texto do site (alto × baixo). Este ciclo.
  2. Contraste dos cartões de vídeo (#24) (médio × baixo). Este ciclo.
  3. Teste de teclado nos 8 aplicativos (#25) (médio × médio). Este ciclo.
  4. LCP local de 3,88 s: atraso de renderização do topo (alto × alto). Experimento feito, vira #36.
  5. Aviso no hub quando o Formulários está fora do ar (médio × baixo). Vira #37.
- **Fora do escopo:** servidor no Render, hospedagem, fontes.

### Engenharia
- **Arquitetura:** `packages/ui/src/utilitarios/api.ts` reúne o prazo (`PRAZO_API_MS`, 15 s), os status de servidor fora do ar (502, 503, 504) e o texto da falha (desenvolvimento ou site). O Cadastro aplica o prazo no `criarRepositorioHttp` (cancela o pedido com `AbortController`); as Tarefas usam o `timeout` do `fetchBaseQuery` e `apiForaDoAr` para escolher o estado de falha.
- **Contraste:** a coluna `.categorias` da seção Flix ganhou `min-width: 0`; antes, no celular, o trilho alargava a coluna e a seção cortava cartões e a lista de tecnologias fora da tela. Os cartões têm fundo próprio. No carrossel "espiar", os vizinhos esmaecidos ficam `inert`.
- **Teclado:** `packages/testes-e2e/testes/navegacao/teclado.spec.ts` varre as 25 primeiras paradas de Tab de cada filho (nome, foco visível no elemento ou no contêiner, sem foco preso) e conclui o fluxo principal só com teclado.
- **Teclado por aplicativo (ensaio de produção local, 09/11/2026, 2 de 2 testes em cada):** Flix (abrir vídeo), Cadastro (cadastrar cliente), Portal de Heróis (abrir ficha), Formulários (ir ao contato), Tarefas (criar tarefa), Lista da Pelada (abrir jogo), Laboratório (abrir lição) e Trilha React (abrir aprendizado). Em todos, 25 paradas de Tab com nome e foco visível, sem foco preso.
- **LCP:** a pré-renderização do `App` (`renderToString` no `dist/index.html` + `hydrateRoot`) foi testada e descartada: LCP simulado de 3,62 a 4,40 s, igual ao de antes. Registro em #36.
- **Riscos:** prazo de 15 s pode cortar um servidor que acorda devagar; o botão "Tentar de novo" cobre esse caso.
- **Definição de pronto:** CI do GitHub verde, PR para a sprint aberto ou mesclado, comentário no PR #35.

### Plano de ação
- **Executa:** critérios 6 e 8; medição local do 7 com fases e elemento do LCP; `MVP.md` com a tabela do ciclo; README.
- **Vira issue:** #36 (atraso de renderização do topo), #37 (aviso do Formulários no hub). Seguem: #23 (LCP no site), #26, #27, #28 (responsável).

## Ciclo de 07/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `main` (o merge na `main` fica com o responsável). Nível: Produto (N3), 12 critérios.

### Produto
- **Problema e público:** quem avalia o portfólio precisa ver as 8 aplicações rodando sem esperar. Hoje o topo do hub leva 3,41 s (mediana de 06/11) para aparecer no celular.
- **Hipótese e meta:** se o topo aparecer em até 2,5 s, quem chega rola até pelo menos uma demo. Meta técnica: LCP móvel de até 2,5 s (#23).
- **O que a pesquisa trouxe:**
  - O Chrome não conta como candidato a LCP um elemento com opacidade 0; o LCP só é marcado quando ele fica visível. Uma entrada animada com `opacity: 0` feita por JavaScript atrasa o LCP até o script rodar ([web.dev, LCP](https://web.dev/lcp/); [Shopify, não esconder o LCP atrás de animações](https://shopify.dev/docs/storefronts/themes/best-practices/performance/dont-hide-lcp-image-behind-animations)).
  - `React.lazy` com `Suspense` e `import()` dinâmico faz o Vite gerar um arquivo separado, baixado só quando o componente aparece ([web.dev, divisão de código com React.lazy e Suspense](https://web.dev/articles/code-splitting-suspense)).
- **Backlog (impacto × esforço):**
  1. Tirar as seções de projeto do pacote inicial (alto × baixo). Este ciclo.
  2. Topo visível no primeiro quadro, sem `opacity: 0` (alto × baixo). Este ciclo.
  3. Contraste dos cartões de vídeo (#24) e teclado nos aplicativos internos (#25) (médio × médio). Issues.
  4. Servidor no Render (#28) e medição de uso (#27) (alto, dependem do responsável).
- **Fora do escopo:** trocar fontes, remover demos, mexer na hospedagem (Vercel e Render).

### Engenharia
- **Arquitetura:** o `App` carrega eagerly só `Cabecalho`, `Topo` e `Rodape`. As 9 seções (8 projetos e arquitetura) ficam em `apps/hub/src/secoes/SecoesProjetos.tsx`, carregado com `React.lazy`, junto com o `MotionConfig`; a entrada do texto do topo passou a ser uma animação CSS só de deslocamento, então o Motion saiu do pacote inicial. Quando as seções montam, o `App` passa a observar todos os ids em `useSecaoAtiva` e rola até a âncora do endereço, se houver.
- **Riscos:** âncora aberta direto (`/#filho-3`) antes do carregamento, coberta por teste; acento da seção ativa, que dependia dos ids já existirem.
- **Qualidade:** testes do hub esperam as seções carregarem; teste novo da âncora; axe sem violações; `pnpm verificar`, `test:navegacao` e `test:e2e` no CI.
- **Definição de pronto:** pacote inicial do hub abaixo de 300 KB no `vite build`, CI verde, PR para a sprint mesclado e PR para a `main` aberto com `revisao-responsavel`.

### Plano de ação
- **Executa:** divisão do pacote inicial (de 685 KB para 241 KB no `vite build` de 09/11/2026); topo sem `opacity: 0`; `MVP.md` com uma tabela só; README com o estado de 07/11.
- **Vira issue:** LCP medido no site publicado depois do merge (#23 segue aberta até a medição), contraste (#24), teclado (#25), servidor (#28), medição de uso (#27), proteção da `main` (#26).

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `main`. Nível: Produto (N3), 12 critérios.

### Produto

**Problema e público.** Quem avalia um dev front-end (recrutador, pessoa técnica) quer ver, numa visita, várias abordagens de React funcionando e o código por trás delas.

**Hipótese e meta.** Se o hub mostrar 8 aplicações React em um só lugar, quem avalia abre ao menos 2 delas na mesma visita. Meta proposta; medir depende da conta de medição (#27).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Cada projeto do portfólio com demo e código lado a lado | Cada seção ganhou o link "Ver o código de …", que abre a pasta do projeto no GitHub, ao lado do botão "Abrir" | [Codecademy: dicas de portfólio](https://www.codecademy.com/resources/blog/software-developer-portfolio-tips), [8seneca: guia de portfólio](https://www.8seneca.com/blog/technology/software-engineer-portfolio-guide-what-to-include-and-what-to-avoid) |
| Dividir o JavaScript por rota ou seção, sem atrasar o que aparece primeiro | O topo fica no pacote inicial; as seções dos projetos podem carregar sob demanda. Virou a #23 | [Steve Kinney: code splitting](https://stevekinney.com/courses/react-performance/code-splitting-and-lazy-loading), [Dynatrace: lazy loading](https://developer.dynatrace.com/develop/guides/code-optimization/lazy-loading/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Link para o código em cada seção | Médio | Baixo | Este ciclo |
| 2 | Detalhar cada "Parcial" do `MVP.md` | Alto | Baixo | Este ciclo |
| 3 | Dividir o JavaScript da primeira carga | Alto | Médio | Issue (#23) |
| 4 | Contraste dos cartões de vídeo | Médio | Baixo | Issue (#24) |
| 5 | Teclado nos aplicativos internos | Médio | Médio | Issue (#25) |
| 6 | Servidor no Render fora do ar | Alto | Baixo | Responsável (#28) |
| 7 | Proteger a `main` | Alto | Baixo | Responsável (#26) |
| 8 | Medição de uso | Médio | Baixo | Responsável (#27) |

**Fora do escopo.** Novas aplicações, conta única entre aplicações, publicação do pacote de interface.

### Engenharia

**Arquitetura.** Monorepo pnpm com o hub (React 19 + Vite), 8 filhos, uma API (Hono, Drizzle) e um servidor Node de produção. A Vercel serve as partes estáticas e repassa `/api` e `/formularios` para o Render. Os dados do hub saem de `apps/hub/src/dados/projetos.ts`.

**Riscos.**
- O servidor no Render não respondeu em 60 s em 06/11/2026 (#28). As demos que usam a API ficam sem servidor no site.
- Um só arquivo JavaScript de 685 KB na primeira carga (#23).
- Sem proteção na `main`, um push direto publica sem CI (#26).

**Qualidade.**
- Testes: Vitest no hub e nos filhos, Playwright para navegação e Formulários. Novo teste: cada seção liga para a pasta certa do código.
- Acessibilidade: axe no teste do hub; o link novo tem foco visível próprio.
- Desempenho: LCP 3,32 s (02/11/2026), sem nova medida neste ciclo, porque o código da primeira carga não mudou.
- Segurança: nenhum dado pessoal novo; links só para o próprio repositório.

**Definição de pronto.** `pnpm verificar`, `pnpm test:navegacao` e `pnpm test:e2e` verdes no CI; `MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Link "Ver o código de …" em cada seção, com teste.
2. `MVP.md` com cada "Parcial" explicado, linha de nível e "Finalizado".
3. README com a seção de estado e próximos passos.

**Vira issue.** #23, #24, #25 (agente); #26, #27, #28 (responsável).
