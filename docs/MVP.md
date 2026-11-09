# MVP — critérios

**Nível:** Produto (N3), 12 critérios. Estado em 09/11/2026 (ciclo de 09/11/2026, segunda rodada: `feature/2026-11-09-2`).

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** sim

| # | Critério | Situação em 09/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Um hub para avaliar 7 aplicações React de um monorepo, e uma trilha de estudo | — |
| 2 | Hipótese a validar | Atende | Hipótese com meta na seção de 02/11/2026 do Histórico | — |
| 3 | Fluxo principal completo | Parcial | O código está pronto: no site, a seção 04 consulta `/api/saude` e avisa quando o servidor do Formulários está fora do ar (#37; `vitest run src/testes/servidor.test.tsx` em 09/11/2026: 6 de 6). Falta o servidor: `curl -m 40 https://components-dusky-nine.vercel.app/api/saude` em 09/11/2026 ficou sem resposta | #28 (responsável) |
| 4 | Escopo enxuto | Atende | Lista "Fora do MVP" no Histórico (02/11/2026) | — |
| 5 | Medição de uso | Não atende | Nada coleta uso; depende de conta de medição | #27 (responsável) |
| 6 | Falhas tratadas | Atende | Sem servidor, Cadastro e Tarefas desistem em 15 s e tratam 502/503/504 como "A API não respondeu"; a seção 04 do hub avisa o mesmo (#37). `vitest run` em 09/11/2026: `apps/cadastro` 29 de 29, `apps/tarefas` 14 de 14, `packages/ui` 25 de 25, `apps/hub` 18 de 18 | — |
| 7 | Desempenho aceitável | Parcial | Lighthouse 12.8.2 móvel local, build servido com gzip, 09/11/2026, execuções válidas (FCP observado < 2 s) alternadas: antes 3,91 / 3,68 / 3,43 s (mediana 3,68 s, TBT 833 a 2012 ms); depois 1,84 / 1,81 / 1,82 / 1,82 s (mediana **1,82 s**, TBT 701, 891, 1313 e 3740 ms). Elemento: `h1#topo-titulo`; atraso de renderização de ~3,2 s para ~1,37 s. O topo vem pré-renderizado e o JavaScript só é pedido depois da primeira pintura (#36). Falta medir no site, que só muda depois do merge na `main` | #23 (responsável) |
| 8 | Acessibilidade básica | Atende | Lighthouse local: acessibilidade 100. axe `color-contrast` no navegador: 0 violações. Teclado nos 8 aplicativos: `playwright test testes/navegacao` no ensaio de produção, 27 de 27 (09/11/2026). Aviso novo da seção 04 sem violações do axe | — |
| 9 | Segurança e conformidade | Parcial | Sem segredo no código. `pnpm audit --prod` em 09/11/2026: 5 → 0 vulnerabilidades (zod, hono, @hono/node-server, body-parser e qs, sem troca de versão maior). Falta conferir o servidor publicado | #28 (responsável), #41 (responsável), #40 |
| 10 | Entrega confiável | Parcial | `main` sem proteção (regra 3 do processo) | #26 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | CI do GitHub roda `pnpm verificar`, `test:navegacao` e `test:e2e` em todo push e PR | — |
| 12 | Documentação honesta | Atende | README e este arquivo dizem o que está no ar e o que não está, com issue | — |

**Atendidos:** 1, 2, 4, 6, 8, 11 e 12. **Parciais:** 3, 7, 9 e 10. **Não atendidos:** 5.

**Por que "Finalizado: sim":** tudo o que o código resolve está feito. Os critérios 3, 5, 7, 9 e 10 dependem do responsável, cada um com issue e o rótulo `depende-do-responsavel`: servidor no Render (#28), medição de uso (#27), merge na `main` e medição do LCP no site (#23), proteção da `main` (#26). Se a medição no site for exigida para "Atende" no 7, o projeto volta a "não" até ela.

## Histórico

Tabelas e revisões anteriores, mantidas como registro. O estado vale só na tabela do topo.

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
