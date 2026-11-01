# Revisão independente · 01 · Relatório

_Revisão de 27/10/2026, branch `feature/claudeia-2026-10-27`. Só leitura de código e documentação; nenhum comando de build, teste, git ou pnpm foi executado. A documentação do projeto ([docs/README.md](../README.md), 01 a 06 e ADRs) continua sendo a fonte da verdade: este relatório não a repete, avalia e aponta lacunas._

## Notas

| Área | Nota | Resumo |
| --- | --- | --- |
| Objetivo | 8,5 | Claro e coerente no código e na documentação |
| Eficiência de produto digital | 6,0 | Fluxo hub ↔ filhos sólido, mas 3 de 8 filhos dependem de um servidor que não está no ar, sem aviso ao visitante |
| Performance de software | 6,5 | Estático bem resolvido; hub monolítico e servidor acima de 512 MB |
| UX design | 7,5 | Acessibilidade levada a sério; evidência visual não medida nesta revisão |
| Engenharia | 8,5 | Tipagem, testes, CI e documentação acima da média; faltam proteções de produção |

## Método e limites

| Item | Como |
| --- | --- |
| Evidência | Arquivo:linha ou contagem feita nesta revisão (find, grep, wc, gzip em Python) |
| Bundle | Medido nos arquivos de `apps/*/dist` do build local de 26/10/2026 (não reconstruído) |
| Não feito | Não abri o site no navegador, não rodei testes, não medi memória do servidor |
| Objetivo e regras deduzidos | Marcados como _inferido · confirmar_ |

## 1 · Objetivo · 8,5

**Objetivo (inferido · confirmar):** portfólio de engenharia front-end que prova competência em React com 8 demonstrações reais, cada uma com stack diferente, e com a própria engenharia (testes, CI, ADRs) como parte da vitrine. Público provável: recrutadores e pares técnicos.

| Evidência | Onde |
| --- | --- |
| Proposta explícita | `readme.md:3` |
| Fonte única de dados do hub | `apps/hub/src/dados/projetos.ts` (8 projetos, todos com `status: 'publicado'`, linhas 62 a 244) |
| Engenharia como vitrine | Seção "Engenharia" do `readme.md` e seção Arquitetura do hub (`apps/hub/src/secoes/Arquitetura`) |

| Pontos fortes | Falhas |
| --- | --- |
| Cada filho tem demo com dados e regras reais, não captura de tela | O visitante não tem um "por onde começar" para quem tem 2 minutos (inferido · confirmar) |
| Créditos de ideia explícitos (`creditoIdeia`) | Título e descrição do hub ainda dizem 7 projetos (A-26) |

## 2 · Eficiência de produto digital · 6,0

| Fluxo | Situação | Evidência |
| --- | --- | --- |
| Hub → filho → hub | ✅ Comprovado por T-01 (11 casos, segundo docs/01) | `packages/testes-e2e/testes/navegacao/ecossistema.spec.ts` |
| Hub → Formulários no site publicado | ❌ Quebra: `/formularios/*` é repassado a um Render que não sobe | `vercel.json` (regra `/formularios/:caminho*`), A-38 |
| Tarefas e Cadastro (modo API) publicados | ⚠️ Abrem, mas sem dados; a tela mostra "Não foi possível listar" | `apps/tarefas/src/paginas/Tarefas/Tarefas.tsx:217`, `apps/cadastro/src/paginas/Clientes/Clientes.tsx:45` |
| Primeira visita após hibernação | ⚠️ Até ~1 min de espera sem mensagem específica (o código trata indisponível, não "acordando") | Mesmos arquivos; docs/04 |
| Conteúdo desatualizado | ❌ `<title>components · 7 projetos React</title>` e descrição citando 7 | `apps/hub/index.html:9` e `:12` (A-26) |
| Compartilhamento em redes | ❌ Sem Open Graph, Twitter card ou `canonical` | `apps/hub/index.html` (16 linhas, só `description` e `theme-color`) |
| Coerência | ⚠️ O hub marca os 8 como `publicado`, mas 1 não abre e 2 abrem sem dados no domínio publicado | `projetos.ts:140`, docs/01 · Publicação |

**Regra de negócio a preservar (inferido · confirmar):** a caixa do Formulários (`/formularios/mensagens`) mostra todas as mensagens recebidas e permite esvaziá-la (`apps/formularios/app/dominio/mensagens.server.ts:10`, `routes/mensagens.tsx:20`). Isso é a demonstração do ciclo loader → action → redirect e deve continuar. Publicado, porém, nome, e-mail e mensagem de um visitante ficam visíveis para qualquer outro; o mesmo vale para os clientes do Cadastro na API. Proposta de aperfeiçoamento, não de remoção: A-47.

## 3 · Performance de software · 6,5

| Medida | Valor | Evidência |
| --- | --- | --- |
| JavaScript inicial do hub | 685.302 bytes; **206.419 bytes com gzip -9** | `apps/hub/dist/assets/index-CoJvEpic.js` (medido) |
| CSS do hub | 49.006 bytes; 11.438 com gzip | `apps/hub/dist/assets/index-BB9m8FuO.css` |
| JS dos filhos (soma dos `.js` em `dist/assets`) | 371 kB (Pelada) a 506 kB (Heróis) | medido em `*/dist/assets` |
| Aviso de tamanho silenciado | `chunkSizeWarningLimit: 900` | `apps/hub/vite.config.ts:18` |
| Fontes | 19 `@font-face`, **todas com `unicode-range`** | contagem no CSS do hub |
| Memória do servidor | 229 MB antes de abrir o banco (medição do dono) + piso de 128 MB do `pglite.wasm` | docs/05 · Histórico, docs/04 · Memória |

| Comparação com a documentação | Posição |
| --- | --- |
| A-20 (685 kB no hub) | **Concorda** com o número. Acrescenta: o que trafega é ~206 kB com gzip (estimativa: a Vercel usa Brotli, que costuma ser menor). Continua P2 |
| A-21 (fontes sem cirílico, grego e vietnamita) | **Discorda da motivação.** Com `unicode-range`, o navegador só baixa os subconjuntos que a página usa; os arquivos extras pesam no deploy, não no visitante. Ganho real próximo de zero; pode cair para "se sobrar tempo" |
| A-38 (512 MB) | **Concorda** com o diagnóstico. Falta: um teste que impeça a memória de voltar a subir (A-39) e um plano B decidido antes de nova rodada de tentativas (A-40) |
| Cold start | **Concorda** que é aceitável no MVP. Falta confirmar se o repasse da Vercel espera o Render acordar ou devolve erro antes (A-41, risco a confirmar) |

## 4 · UX design · 7,5

| Aspecto | Evidência | Avaliação |
| --- | --- | --- |
| Hierarquia | Um único `<h1>` no hub (`componentes/Topo/Topo.tsx:34`) | ✅ |
| Acessibilidade | `SkipLink`, `main` com `tabIndex={-1}` (`App.tsx:39`), `MotionConfig reducedMotion="user"`, axe nos testes de componente (`packages/ui/src/testes/axe.ts`), teste de contraste (`contraste.test.ts`), `eslint-plugin-jsx-a11y` | ✅ Acima da média |
| Responsivo | 10 blocos `@media` entre hub e UI | ⚠️ Existe, não verificado em tela nesta revisão |
| Temas | Tema fixo por seção (`tema: 'claro' \| 'escuro'` em `projetos.ts`), acento muda com a rolagem (`App.tsx:32`) | ✅ Coerente; não há alternância pelo usuário nem `prefers-color-scheme`, o que é escolha de design, não falha |
| Primeira impressão | Hub longo (topo, 8 seções, arquitetura, rodapé) | ⚠️ Sem medida de tempo até a primeira interação; ver A-20 |
| Navegação | Megamenu dos 8 projetos (`componentes/Cabecalho`) e âncoras `#filho-n` | ✅ |

Concorda com docs/03 e A-32 (axe só em componentes isolados, não nas páginas).

## 5 · Engenharia · 8,5

| Aspecto | Evidência | Avaliação |
| --- | --- | --- |
| Arquitetura | Um domínio com pastas, servidor que só compõe peças (ADR 0002 e 0004) | ✅ Simples e reversível |
| Tipagem | `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (`packages/config/tsconfig.base.json`); **0** ocorrências de `any`, `@ts-ignore`, `@ts-expect-error` e `eslint-disable` (medido) | ✅ Excelente |
| Testes | **46** arquivos de teste (medido; docs dizia 45, corrigido) | ✅; hub com 1 arquivo (A-14) |
| CI | `.github/workflows/ci.yml`: verificar, T-01 e e2e do Formulários | ✅; `main` sem proteção (A-27) |
| Lint | ESLint só em `**/*.{ts,tsx}` (`eslint.config.js:34`); `scripts/montar-publicacao.mjs` fica fora | ⚠️ A-44 |
| Formatação | `format:check` existe (`package.json`), mas não está no `verificar` nem no CI; havia linha fora do Prettier em `apps/hub/vite.config.ts:21` | ⚠️ Corrigida a linha; A-43 |
| Configuração órfã | 7 pastas inexistentes nos ignorados do ESLint e do Prettier (`2-cadastro` a `7-laboratorio`, `_referencia`) | ⚠️ Concorda com A-19 |
| Robustez | API com validação Zod, 404 e 500 em JSON (`apps/api/src/app.ts:19-23`) | ✅ |
| Segurança | CORS por `ORIGENS`; sem limite de corpo nem de taxa nas rotas de escrita (`apps/api/src/rotas/clientes.ts`, 0 ocorrências de `bodyLimit` ou limite de taxa) | ⚠️ A-46 (P2: dados efêmeros reduzem o impacto) |
| Documentação | Completa, com backlog e histórico | ✅; 3 pontos desatualizados corrigidos nesta revisão |

## Comparação com docs/01 e docs/06

| Tema | Concorda | Discorda | Falta nos docs |
| --- | --- | --- | --- |
| Bloqueio do MVP | A-38 → A-09 → A-08 → A-11 é a sequência certa | — | Plano B do A-38 (A-40) e teste de memória (A-39) |
| Situação do Render | — | docs/01 e 04 diziam "serviço a criar"; o histórico do 05 mostra que foi criado e estourou memória (corrigido) | — |
| Testes | Pirâmide e T-01/T-02 | — | Contagem desatualizada (corrigida) |
| Desempenho | A-20 | Motivação do A-21 | Tamanho com gzip |
| Riscos | Hibernação, disco temporário | — | Exposição de dados entre visitantes (A-47); tempo-limite do repasse (A-41) |
| Produto | A-26 | — | Metadados de compartilhamento (A-45); aviso de espera (A-42) |

## Falhas em ordem de gravidade

### Engenharia

| # | Falha | Evidência | Item |
| --- | --- | --- | --- |
| 1 | Servidor de produção não cabe em 512 MB; parte dinâmica fora do ar | docs/05 · Histórico | A-38 (existente) |
| 2 | Nenhuma proteção automática contra regressão de memória | CI sem etapa de memória (`ci.yml`) | A-39 |
| 3 | Sem plano B decidido para o A-38 | docs/06 só cita "compilar o servidor" | A-40 |
| 4 | `main` sem proteção | docs/01 · Qualidade | A-27 (existente) |
| 5 | Tempo-limite do repasse da Vercel não verificado | `vercel.json` repassa para serviço que hiberna | A-41 |
| 6 | Formatação e `.mjs` fora das verificações | `package.json`, `eslint.config.js:34` | A-43, A-44 |
| 7 | API de escrita sem limites | `apps/api/src/rotas/*` | A-46 |

### Decisão de produto

| # | Falha | Evidência | Item |
| --- | --- | --- | --- |
| 1 | Dados de um visitante visíveis a outros (Formulários e Cadastro) quando o Render subir | `mensagens.server.ts:10`, `routes/mensagens.tsx:20` | A-47 (aperfeiçoar, não remover) |
| 2 | Filhos marcados como publicados que não funcionam no domínio publicado | `projetos.ts`, docs/01 · Publicação | A-42 (aviso) |
| 3 | Título e descrição do hub com 7 projetos | `apps/hub/index.html:9,12` | A-26 (existente) |
| 4 | Sem prévia ao compartilhar o link do portfólio | `apps/hub/index.html` | A-45 |
