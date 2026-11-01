# MVP — critérios

> Avaliação de 31/10/2026 com os mesmos 12 critérios usados no `movies`. "Não medido" significa que não há evidência, não que falhe.

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Parcial |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Não atende |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial |
| 5 | Medição de uso | A métrica principal é coletada | Não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: 3,4 s em 01/11/2026 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: Lighthouse 94; teclado sem falha na página inicial |
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
