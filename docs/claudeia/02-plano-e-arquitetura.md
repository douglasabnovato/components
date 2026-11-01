# Revisão independente · 02 · Plano e arquitetura

_27/10/2026. A arquitetura vigente está descrita em [docs/02 · Arquitetura](../02-plano-de-arquitetura.md) e as decisões em [docs/adr](../adr/). Aqui fica só o resumo, as decisões novas propostas e o plano em lotes alinhado ao [backlog](../05-ajustes-e-backlog.md)._

## Arquitetura atual e alvo

| Camada | Atual (27/10) | Alvo do MVP | Alvo depois do MVP (proposta) |
| --- | --- | --- | --- |
| Estático (hub + 7 filhos) | Vercel, no ar | Igual | Hub com carregamento sob demanda (A-20) e metadados de compartilhamento (A-45) |
| Dinâmico (API + SSR) | Render criado, não sobe (OOM, A-38) | Render Live dentro de 512 MB | Servidor compilado para JS; plano B pronto (A-40) |
| Banco | PGlite em disco temporário | Igual | Só muda se persistência virar requisito (A-37) ou se o plano B escolher Postgres gerenciado |
| Roteamento | `vercel.json` com repasse ao Render | Validado em produção (A-08) | Tempo-limite do repasse conhecido (A-41) |
| Qualidade | CI com verificar, T-01, e2e | `main` protegida (A-27), T-02 (A-12) | Memória (A-39), formatação (A-43), lint de `.mjs` (A-44) |

## Decisões novas (ADR curto, propostas)

### ADR-C1 · Plano B para o limite de memória (proposta, vira ADR 0005 no A-40)

| Campo | Conteúdo |
| --- | --- |
| Contexto | O processo usa ~229 MB antes do banco (medição do dono) e o `pglite.wasm` reserva 128 MB fixos fora do heap. Sobra pouca margem para SSR e picos em 512 MB |
| Opções | (1) Compilar `apps/servidor` e a API para JS no build, sem tsx/esbuild em execução, já previsto em docs/04. (2) Postgres gerenciado gratuito via Drizzle (`drizzle-orm/node-postgres`), removendo os 128 MB do WebAssembly. (3) Outro provedor com mais memória no plano gratuito ou plano pago |
| Proposta | Tentar (1) primeiro; se a medição do A-39 passar de 400 MB, decidir entre (2) e (3) por escrito |
| Consequência | (2) muda a operação (segredo de conexão, dados persistentes) e conversa com o A-37; (1) não muda nada visível |
| Muda o produto? | Não |

### ADR-C2 · Teste de memória como contrato (proposta, A-39)

| Campo | Conteúdo |
| --- | --- |
| Contexto | O A-38 foi resolvido por tentativa no próprio Render; nada impede regressão |
| Decisão proposta | Uma etapa no CI roda `banco:preparar`, sobe o servidor com o mesmo Start Command do Render e lê a linha `[memória] porta aberta`; falha acima do limite |
| Consequência | CI um pouco mais lento (estimativa: menos de 1 min) |

### ADR-C3 · Dados de demonstração compartilhados (proposta, A-47)

| Campo | Conteúdo |
| --- | --- |
| Contexto | Caixa do Formulários e clientes do Cadastro são globais; publicados, um visitante vê os dados de outro |
| Regra a preservar (inferido · confirmar) | A demonstração do ciclo completo (enviar, listar, esvaziar; CRUD) é o propósito do filho |
| Opções | (a) Aviso visível "não use dados reais" nos formulários. (b) Isolar por sessão (cookie) o que cada visitante vê. (c) Ambos |
| Decisão | Do dono (decisão de produto) |

## Plano em lotes

**Situação:** Feito = executado nesta revisão · Proposta = depende do dono.

### Lote 1 · Executado nesta revisão (não muda o produto)

| ID | Item | Motivo | Arquivos | Critério de pronto | Esforço | Risco | Muda o produto? | Situação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | Contagem de testes 45 → 46 e API 1 → 2 | `conexao.test.ts` entrou com o A-38 | `docs/01-estado-atual.md`, `docs/03-plano-de-testes.md` | Números iguais à contagem do `find` | 5 min | Nenhum | Não | Feito |
| R-02 | Situação do Render: "a criar" → "criado, sem subir por memória" | Histórico do 05 registra o deploy com OOM | `docs/01-estado-atual.md`, `docs/04-hospedagem.md` | Coerente com A-38 em andamento | 5 min | Nenhum | Não | Feito |
| R-03 | Indentação de `testTimeout` | Linha fora do Prettier | `apps/hub/vite.config.ts` | `pnpm format:check` sem esse arquivo na lista | 1 min | Nenhum (só espaço) | Não | Feito |
| R-04 | Itens A-39 a A-47 no backlog e link da revisão no índice | Rastreabilidade | `docs/05-ajustes-e-backlog.md`, `docs/README.md` | Itens como "A fazer"; status existentes intactos | 10 min | Nenhum | Não | Feito |
| R-05 | Relatório, plano, registro, roteiros e script de verificação | Entregáveis | `docs/claudeia/*` | Arquivos presentes | — | Nenhum | Não | Feito |

### Lote 2 · Engenharia sem mudança de produto (próximo)

| ID | Item | Motivo | Arquivos | Critério de pronto | Esforço | Risco | Muda o produto? | Situação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-38 | Servidor em 512 MB | Bloqueio do MVP | `apps/servidor`, `apps/api` | Render Live | Em andamento (dono) | Médio | Não | Existente |
| A-39 | Teste de memória no CI | Evitar regressão do A-38 | `.github/workflows/ci.yml`, script novo em `scripts/` | CI falha acima do limite | 2 h (estimativa) | Baixo | Não | Proposta |
| A-40 | ADR 0005 do plano B | Decidir antes de nova rodada | `docs/adr/0005-*.md` | ADR aceita | 1 h | Nenhum | Não | Proposta |
| A-41 | Medir repasse com Render dormindo | Risco de erro na primeira visita | `docs/04-hospedagem.md` | Tempo medido e registrado | 30 min | Nenhum | Não | Proposta |
| A-27 | Proteger `main` | Regressões | GitHub | Regra ativa | 10 min | Nenhum | Não | Existente |
| A-19 | Ignorados órfãos | 7 pastas inexistentes (conferido com `ls`) | `eslint.config.js`, `.prettierignore` | Sem entradas órfãs; comentário do topo do ESLint atualizado | 10 min | Muito baixo | Não | Existente |
| A-43 | `format:check` no CI | Formatação já divergiu uma vez | `package.json` ou `ci.yml` | CI falha com arquivo fora do Prettier | 15 min (+ rodar `pnpm format` uma vez) | Baixo | Não | Proposta |
| A-44 | Lint em `.js`/`.mjs` | Script de publicação sem lint | `eslint.config.js` | `pnpm lint` cobre `scripts/` | 30 min | Baixo | Não | Proposta |
| A-17 | Flix com `enderecoDoHub(1)` | `1-flix/src/config.ts:5` monta à mão | `1-flix/src/config.ts` | Igual aos outros filhos | 10 min | Baixo | Não | Existente |
| A-46 | Limites na API | Escrita pública sem limite | `apps/api/src/app.ts` | Limites ativos; testes da API verdes | 2 h | Baixo | Não para uso normal | Proposta |

### Lote 3 · Decisões de produto (dono decide)

| ID | Item | Motivo | Arquivos | Critério de pronto | Esforço | Risco | Muda o produto? | Situação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-26 | Título e descrição com 8 projetos | Texto errado na aba e em buscadores | `apps/hub/index.html` | Cita 8 projetos e a Trilha | 5 min | Nenhum | Sim (texto) | Existente; pronto para aplicar |
| A-47 | Aperfeiçoar a exposição de dados de visitantes | Privacidade quando o Render subir | Formulários e Cadastro | Opção escolhida e aplicada | 1 a 4 h | Baixo | Sim | Proposta |
| A-42 | Aviso de servidor acordando | Primeira visita parece erro | Tarefas, Cadastro, hub | Mensagem de espera | 2 h | Baixo | Sim (texto) | Proposta |
| A-45 | Open Graph e `canonical` | Prévia ao compartilhar o portfólio | `apps/hub/index.html`, imagem em `public/` | Prévia correta num validador | 1 h | Nenhum | Sim (metadados) | Proposta |

### Lote 4 · Evolução (sem mudança no backlog existente)

A-20, A-33, A-14, A-15, A-32, A-30, A-31, A-28, A-29, A-34, conforme docs/06. Sugestão: rebaixar o A-21 (ver relatório, seção 3).
