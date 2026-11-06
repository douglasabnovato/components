# Plano de ação

Plano por ciclo. O estado dos critérios fica só no [`MVP.md`](MVP.md).

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
