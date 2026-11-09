# MVP — critérios

**Nível:** Produto (N3), 12 critérios. Estado em 09/11/2026 (ciclo de 07/11/2026).

**Resumo:** 5 de 12 aplicáveis atendidos

**Finalizado:** não

| # | Critério | Situação em 09/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Um hub para avaliar 7 aplicações React de um monorepo, e uma trilha de estudo | — |
| 2 | Hipótese a validar | Atende | Hipótese com meta na seção de 02/11/2026 do Histórico | — |
| 3 | Fluxo principal completo | Parcial | `curl -m 30 https://components-dusky-nine.vercel.app/api/saude` em 09/11/2026: sem resposta em 30 s. Cadastro com API, Tarefas com API e Formulários não funcionam no site | #28 (responsável) |
| 4 | Escopo enxuto | Atende | Lista "Fora do MVP" no Histórico (02/11/2026) | — |
| 5 | Medição de uso | Não atende | Nada coleta uso; depende de conta de medição | #27 (responsável) |
| 6 | Falhas tratadas | Parcial | As demos tratam erro e vazio nos testes; sem o servidor, a falha da API no site não está testada | #28 (responsável) |
| 7 | Desempenho aceitável | Não atende | Última medição no site: mediana de 3,41 s (06/11/2026). Neste ciclo, `pnpm --filter @components/hub build` (09/11/2026) levou o JavaScript inicial de 685 KB para 241 KB (77 KB com gzip); falta medir no site depois do merge na `main` | #23 |
| 8 | Acessibilidade básica | Parcial | Lighthouse 97 e axe sem violações no hub; falta o contraste dos cartões de vídeo e percorrer os aplicativos internos por teclado | #24, #25 |
| 9 | Segurança e conformidade | Parcial | Sem segredo no código; o servidor publicado não pôde ser conferido | #28 (responsável) |
| 10 | Entrega confiável | Parcial | `main` sem proteção (regra 3 do processo) | #26 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | CI do GitHub roda `pnpm verificar`, `test:navegacao` e `test:e2e` em todo push e PR; o hub tem 12 testes (`apps/hub/src/testes/hub.test.tsx`, 12 de 12 passando em 09/11/2026) | — |
| 12 | Documentação honesta | Atende | README e este arquivo dizem o que está no ar e o que não está, com issue | — |

**Atendidos:** 1, 2, 4, 11 e 12. **Parciais:** 3, 6, 8, 9 e 10. **Não atendidos:** 5 e 7.

**Para "Finalizado":** medir o LCP no site depois do merge (#23), corrigir o contraste (#24) e percorrer os aplicativos por teclado (#25). Os critérios 3, 5, 6, 9 e 10 dependem do responsável (#28, #27, #26), cada um com o rótulo `depende-do-responsavel`.

## Histórico

Tabelas e revisões anteriores, mantidas como registro. O estado vale só na tabela do topo.

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
