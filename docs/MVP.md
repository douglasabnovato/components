# MVP — critérios

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

## Medições de 01/11/2026

Lighthouse 12.8.2 local, móvel, na página inicial do site publicado. O resultado varia entre execuções.

| Execução | LCP | FCP | CLS | TBT | Desempenho | Acessibilidade |
|---|---|---|---|---|---|---|
| 1 | 3,49 s | 2,87 s | 0 | 794 ms | 66 | 94 |
| 2 | 3,42 s | 2,60 s | 0 | 1372 ms | 62 | 94 |
| 3 | 3,40 s | 2,57 s | 0,001 | 1355 ms | 62 | 94 |

**Mediana do LCP:** 3,42 s, acima da meta de 2,5 s. O TBT indica JavaScript pesado na primeira carga.

**Falhas de acessibilidade:** contraste em textos dos cartões de vídeo e tamanho dos pontos do carrossel.

**Teclado:** 40 tabulações em 412 px, nas quais todo elemento teve nome e foco visível. Testei só a sequência de foco da página inicial, sem percorrer os aplicativos internos nem usar leitor de tela.

## Revisão de 02/11/2026

**Hipótese (proposta, sem validação):** Se o hub mostrar 7 aplicações React funcionando em um só lugar, quem avalia abre ao menos 2 delas na mesma visita.

**Fora do MVP (proposta):** Novas aplicações, conta única entre as aplicações e publicação do pacote de interface.

**Medição:** Lighthouse 12.8.2 local, móvel, 3 execuções no site publicado. LCP 3,34 / 3,11 / 3,32 s (mediana 3,32 s), acessibilidade 97. O alerta de contraste que resta aponta cor de tema durante a animação: na página parada, a seção tem fundo claro e o texto escuro, mas não revisei cada elemento. O resultado varia entre execuções, e não houve teste em celular real.

**Critério 5:** segue sem atender, porque nada coleta uso; depende de uma conta de medição do responsável.

## Revisão de 06/11/2026 (ciclo de 03/11/2026)

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

**Novo neste ciclo:** cada seção do hub tem o link "Ver o código de …" para a pasta do projeto no GitHub, com teste em `apps/hub/src/testes/hub.test.tsx`.

**Para "Finalizado":** atender 3, 6, 7, 8 e 9 pelo código e pelo servidor (#23, #24, #25, #28). Os critérios 5 e 10 dependem do responsável (#27, #26).
