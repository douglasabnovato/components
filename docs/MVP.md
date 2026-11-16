# MVP — critérios

**Nível:** Produto (N3), 12 critérios. Estado em 16/11/2026 (ciclo de 16/11/2026, `feature/2026-11-16` → `developer/sprint-2026-11-19`).

**Revisto em:** 16/11/2026, 14h39 (critério 9 revisto com a ADR 0005 dos alertas do Dependabot).

**Resumo:** 10 de 12 aplicáveis atendidos

**Finalizado:** sim

**Problema e público:** quem avalia o portfólio quer ver, num só lugar, 8 projetos React funcionando com dados e regras reais, sem instalar nada.

**Hipótese:** acreditamos que mostrar os 8 projetos funcionando num só lugar fará quem avalia abrir ao menos 2 deles na mesma visita. **Meta:** na primeira semana com dados, eventos `abrir-filho-N` em número igual ou maior que o dobro das visitas em `/`. **Saberemos quando** o painel do GoatCounter (`douglasabnovato`) mostrar essa razão, que depende da conta (#27).

**Fora do MVP:** novas aplicações, conta única entre as aplicações, publicação do pacote de interface, banco persistente no Render (o disco gratuito volta aos dados de exemplo) e domínio próprio ou plano pago.

| # | Critério | Situação em 16/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase "Problema e público" acima e o início do README | — |
| 2 | Hipótese a validar | Atende | Hipótese, meta e "saberemos quando" acima. A validação em si depende do critério 5 | #27 |
| 3 | Fluxo principal completo | Parcial | No CI, Playwright de ponta a ponta no navegador: `test:navegacao` (hub abre e volta de cada um dos 8 filhos; fluxo principal de cada filho só por teclado) e `test:e2e` (Formulários com POST real). Run 43821216220 do PR #51: verde. Falta o servidor no ar: em 16/11/2026, `curl -m 60 https://components-dusky-nine.vercel.app/api/saude` ficou sem resposta (000) e `/formularios/` deu 404, então Cadastro (modo API), Tarefas e Formulários não funcionam no site | #28 (responsável) |
| 4 | Escopo enxuto | Atende | Lista "Fora do MVP" acima | — |
| 5 | Medição de uso | Parcial | O código está no site: o `index-CuG9TW5l.js` publicado contém `douglasabnovato.goatcounter.com/count` (`curl` + `grep`, 16/11/2026), e `vitest run src/testes/medicao.test.tsx` em `apps/hub` passa (6 de 6, dentro dos 28 do hub em 16/11/2026). A conta não existe: `https://douglasabnovato.goatcounter.com/` respondeu 400 em 16/11/2026. Sem painel com visitas, não atende | #27 (responsável) |
| 6 | Falhas tratadas | Atende | Falha de rede, prazo de 15 s e 502/503/504 viram "A API não respondeu" (`apps/cadastro/src/dados/repositorios.test.ts`; tela em `apps/cadastro/src/testes/app.test.tsx`, "mostra o aviso de API desligada"). Lista vazia ("mostra o estado vazio quando a busca não encontra ninguém") e espera ("marca a tabela como ocupada enquanto a API ainda não respondeu") no mesmo arquivo, novos em 16/11/2026. A seção 04 do hub avisa quando o servidor não responde (`apps/hub/src/testes/servidor.test.tsx`), e o aviso aparece no site (Playwright, 16/11/2026). `vitest run` em 16/11/2026: `apps/cadastro` 31 de 31, `apps/tarefas` 16 de 16, `packages/ui` 25 de 25, `apps/hub` 28 de 28. Nas Tarefas, os testes novos "mostra o estado vazio quando a busca não casa com nenhuma tarefa" e "anuncia o carregamento enquanto a API ainda não respondeu" (`apps/tarefas/src/testes/app.test.tsx`, #50) | — |
| 7 | Desempenho aceitável | Atende | `npx lighthouse@12.8.2 https://components-dusky-nine.vercel.app/ --only-categories=performance,accessibility --form-factor=mobile --output=json --chrome-flags="--headless --no-sandbox"` (móvel, **site publicado**), 16/11/2026, entre 03h04 e 03h06, 3 execuções válidas (FCP observado abaixo de 2 s): LCP 1,74 / 1,61 / 1,67 s, **mediana 1,67 s**; TBT 605 / 338 / 388 ms; elemento do LCP `h1#topo-titulo`. Na série anterior do mesmo dia, 5 execuções: 3 descartadas por FCP observado de 9,1 s (cache frio), 2,1 s e 2,9 s; as 2 válidas deram 1,68 e 1,66 s | #23 |
| 8 | Acessibilidade básica | Atende | axe completo (`@axe-core/playwright`, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `wcag22aa`) no navegador, com os dados reais de cada projeto: `packages/testes-e2e/testes/navegacao/acessibilidade.spec.ts`, hub e 8 filhos em 1280 px e o hub em 412 px, sem violações no run 43821216220 do CI. O axe achou e o ciclo corrigiu o contraste do selo "concluída" das Tarefas (4,1:1 → 5,9:1); antes da correção, o teste falhou com `color-contrast` no run 43816560648 do CI. No run 43819879782 o axe do hub oscilou no meio do fade do Motion (seção 04); o teste passou a esperar as animações finitas e, no run 43821216220, o Playwright deu 37 de 37 sem repetição. O mesmo arquivo contra o site publicado (`URL_BASE=https://components-dusky-nine.vercel.app`, 16/11/2026): 9 de 10, e a falha é o Formulários, que dá 404 sem o servidor (#28). Teclado (Tab, Enter, foco visível, sem armadilha) nos 8 filhos: `teclado.spec.ts`, no mesmo run. Lighthouse no site: acessibilidade 100 nas 8 execuções de 16/11/2026. Os projetos não seguem o tema do sistema (não há `prefers-color-scheme`; cada um tem tema fixo), por isso não há teste de modo escuro | — |
| 9 | Segurança e conformidade | Atende | Sem segredo no código (o banco é o PGlite, sem senha). `pnpm audit --prod` em 16/11/2026, 14h39: "No known vulnerabilities found". `gh api "repos/douglasabnovato/components/dependabot/alerts?state=open&per_page=100"` às 14h39: 1 aberto, o #5 (`minimatch` 10.2.6, moderada, desenvolvimento, GHSA-g3hv-75wg-m249), e 0 sem decisão. Ele está na [ADR 0005](adr/0005-aceitar-alertas-de-desenvolvimento-do-dependabot.md): vem do `typescript-eslint` (só lint, `devDependencies` da raiz) e não chega ao site nem ao servidor; o `pnpm audit` completo mostra só ele, pelo caminho `.>typescript-eslint>@typescript-eslint/typescript-estree>minimatch`. O `typescript-eslint` 8.73.0, publicado em 16/11/2026, já aceita o `minimatch` 11; a atualização fica na #46 | #46 |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/components/rulesets/26932515` em 16/11/2026: `principal-protegida` ativo, com `deletion`, `non_fast_forward`, `pull_request` e o check obrigatório "Verificação e navegação". O CI roda em todo push e PR; o último da `main` (run 43799396804, 16/11/2026) passou | — |
| 11 | Testes dos fluxos críticos | Atende | O run 43821216220 do CI roda `pnpm verificar` (lint, tipos, 293 testes Vitest, build), `test:navegacao` (Playwright: navegação, teclado e axe, 37 de 37) e `test:e2e` (Formulários), sem `# skipped` no log | — |
| 12 | Documentação honesta | Atende | README com "Estado e próximos passos" de 16/11/2026, link do site conferido no mesmo dia (200), comandos iguais aos do `package.json`; `docs/DEPLOY.md` com o estado de cada parte | — |

**Atendidos:** 1, 2, 4, 6, 7, 8, 9, 10, 11 e 12. **Parciais:** 3 e 5. **Não atendidos:** nenhum.

**Por que "Finalizado: sim":** os parciais 3 e 5 dependem do responsável, cada um com issue e o rótulo `depende-do-responsavel`: servidor no Render pelo Blueprint (#28, passo a passo em `docs/DEPLOY.md`) e conta do GoatCounter (#27). O 9 voltou a Atende em 16/11/2026 com a ADR 0005.

## Histórico

Tabelas e revisões anteriores, mantidas como registro. O estado vale só na tabela do topo.

### Revisão de 16/11/2026, 14h39 (ADR 0005)

Antes: **Resumo** 9 de 12, **Finalizado:** não, com o 9 em Parcial pelo alerta do `minimatch` sem decisão (#46). Depois: a ADR 0005 registra o alerta, que não chega à produção, pela ordem do responsável. O 9 vai para Atende; Resumo de 9 para 10 de 12; Finalizado de não para sim.

### Revisão de 16/11/2026, 12h04 (alertas do Dependabot)

Antes: **Resumo** 9 de 12, **Finalizado:** sim, com o 9 em Parcial por alertas desligados (403, #41). Depois: os alertas foram ligados; resta 1 aberto (`minimatch`, #46), sem correção sem versão maior. O 9 segue Parcial, agora por um motivo que não é só do responsável, e o Finalizado cai para não. Resumo segue 9 de 12.

### Estado de 10/11/2026 (ciclo da faixa de 90%)

**Resumo declarado:** 8 de 12 (1, 2, 4, 6, 8, 10, 11 e 12). **Finalizado:** sim. Revisão de 16/11/2026: o critério 8 estava "Atende" só com a regra `color-contrast` do axe, sem o axe completo no navegador que a régua pede; pela régua, eram 7 de 12.

| # | Critério | Situação | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 3 | Fluxo principal completo | Parcial | Servidor sem resposta (000) em 10/11/2026 | #28 |
| 5 | Medição de uso | Parcial | Código pronto; falta a conta | #27 |
| 7 | Desempenho aceitável | Parcial | LCP local 1,82 s; faltava medir no site | #23 |
| 9 | Segurança e conformidade | Parcial | `pnpm audit --prod` sem vulnerabilidades; Dependabot 403 | #28, #41 |

### Estado de 09/11/2026 (ciclo de 09/11/2026, segunda rodada)

**Resumo:** 8 de 12 aplicáveis atendidos (1, 2, 4, 6, 8, 10, 11 e 12). **Finalizado:** sim.

| # | Critério | Situação | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 3 | Fluxo principal completo | Parcial | Servidor sem resposta em 40 s; sem Blueprint e com `/api/saude` sem tocar o banco | #28 |
| 5 | Medição de uso | Não atende | Nada coleta uso | #27 |

Os demais critérios seguiam como na tabela do topo.

### Estado de 09/11/2026 (ciclo de 09/11/2026, primeira rodada)

**Resumo:** 7 de 12 aplicáveis atendidos (1, 2, 4, 6, 8, 11 e 12). **Finalizado:** não.

| # | Critério | Situação | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 3 | Fluxo principal completo | Parcial | Servidor sem resposta em 40 s; `/formularios/` com 404; o hub não avisava | #28, #37 |
| 7 | Desempenho aceitável | Não atende | LCP local 3,68 a 4,01 s (mediana 3,88 s), atraso de renderização de 3,2 a 3,5 s | #23, #36 |
| 9 | Segurança e conformidade | Parcial | Servidor publicado não conferido | #28 |

Os critérios 5 e 10 seguiam como na tabela do topo.

### Estado de 09/11/2026 (ciclo de 07/11/2026)

**Resumo:** 5 de 12 aplicáveis atendidos (1, 2, 4, 11 e 12). **Finalizado:** não.

| # | Critério | Situação | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 3 | Fluxo principal completo | Parcial | `curl -m 30 .../api/saude`: sem resposta em 30 s | #28 |
| 5 | Medição de uso | Não atende | Nada coleta uso | #27 |
| 6 | Falhas tratadas | Parcial | Sem o servidor, a falha da API no site não estava testada | #28 |
| 7 | Desempenho aceitável | Não atende | 3,41 s no site (06/11); JavaScript inicial de 685 para 241 KB no PR #33 | #23 |
| 8 | Acessibilidade básica | Parcial | Faltavam o contraste dos cartões de vídeo e o teclado nos aplicativos internos | #24, #25 |
| 9 | Segurança e conformidade | Parcial | Servidor publicado não conferido | #28 |
| 10 | Entrega confiável | Parcial | `main` sem proteção | #26 |

Os critérios 1, 2, 4, 11 e 12 estavam em "Atende".

### Avaliação de 31/10/2026
> Avaliação de 31/10/2026 com os mesmos 12 critérios usados no `movies`. "Não medido" significa que não há evidência, não que falhe.

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: um hub para avaliar 7 aplicações React de um monorepo |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: proposta abaixo |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: lista abaixo |
| 5 | Medição de uso | A métrica principal é coletada | Não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: 3,32 s em 02/11/2026; o limite é o JavaScript da primeira carga |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: Lighthouse 97; Tab sem falha na página inicial; aplicativos internos não percorridos |
| 9 | Segurança e conformidade | Riscos decididos; termos cumpridos | Parcial |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Parcial |

### Medições de 01/11/2026

Lighthouse 12.8.2 local, móvel, na página inicial do site publicado. O resultado varia entre execuções.

| Execução | LCP | FCP | CLS | TBT | Desempenho | Acessibilidade |
|---|---|---|---|---|---|---|
| 1 | 3,49 s | 2,87 s | 0 | 794 ms | 66 | 94 |
| 2 | 3,42 s | 2,60 s | 0 | 1372 ms | 62 | 94 |
| 3 | 3,40 s | 2,57 s | 0,001 | 1355 ms | 62 | 94 |

**Mediana do LCP:** 3,42 s, acima da meta de 2,5 s. O TBT indica JavaScript pesado na primeira carga.

**Falhas de acessibilidade:** contraste em textos dos cartões de vídeo e tamanho dos pontos do carrossel.

**Teclado:** 40 tabulações em 412 px, nas quais todo elemento teve nome e foco visível. Testei só a sequência de foco da página inicial, sem percorrer os aplicativos internos nem usar leitor de tela.

### Revisão de 02/11/2026

**Hipótese (proposta, sem validação):** Se o hub mostrar 7 aplicações React funcionando em um só lugar, quem avalia abre ao menos 2 delas na mesma visita.

**Fora do MVP (proposta):** Novas aplicações, conta única entre as aplicações e publicação do pacote de interface.

**Medição:** Lighthouse 12.8.2 local, móvel, 3 execuções no site publicado. LCP 3,34 / 3,11 / 3,32 s (mediana 3,32 s), acessibilidade 97. O alerta de contraste que resta aponta cor de tema durante a animação: na página parada, a seção tem fundo claro e o texto escuro, mas não revisei cada elemento. O resultado varia entre execuções, e não houve teste em celular real.

**Critério 5:** segue sem atender, porque nada coleta uso; depende de uma conta de medição do responsável.

### Revisão de 06/11/2026 (ciclo de 03/11/2026)

**Nível:** Produto (N3), 12 critérios. **Resumo:** 5 de 12 atendidos (1, 2, 4, 11 e 12), 5 parciais (3, 6, 8, 9 e 10) e 2 não atendidos (5 e 7). **Finalizado:** não.

| # | Situação em 06/11/2026 | O que falta | Issue |
|---|---|---|---|
| 3 | Parcial | O servidor no Render não respondeu em 60 s; Cadastro com API, Tarefas com API e Formulários não funcionam no site | #28 |
| 5 | Não atende | Nada coleta uso | #27 |
| 6 | Parcial | As demos tratam erro e vazio nos testes; sem o servidor, o site publicado não mostra a falha da API de forma testada | #28 |
| 7 | Não atende | LCP 3,32 s (02/11/2026); um só arquivo de 685 KB na primeira carga | #23 |
| 8 | Parcial | Contraste dos cartões de vídeo; aplicativos internos não percorridos por teclado | #24, #25 |
| 9 | Parcial | Sem segredo no código; o servidor publicado não pôde ser conferido | #28 |
| 10 | Parcial | `main` sem proteção (decisão 3 do processo) | #26 |
| 12 | Atende | README e este arquivo dizem o que está no ar e o que não está, com issue | — |

**Medição depois do merge (06/11/2026):** Lighthouse 12.8.2 local, móvel, no site publicado. LCP 3,41 / 3,35 / 3,94 s (mediana 3,41 s), acessibilidade 97 nas 3 execuções. Uma rodada anterior no mesmo dia deu 4,00 e 3,51 s, e a terceira falhou. A máquina rodava outros processos ao mesmo tempo, então o número pode estar inflado; o critério 7 segue "Não atende" (#23).

**Novo neste ciclo:** cada seção do hub tem o link "Ver o código de …" para a pasta do projeto no GitHub, com teste em `apps/hub/src/testes/hub.test.tsx`.

**Para "Finalizado":** atender 3, 6, 7, 8 e 9 pelo código e pelo servidor (#23, #24, #25, #28). Os critérios 5 e 10 dependem do responsável (#27, #26).
