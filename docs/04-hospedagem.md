# 04 · Hospedagem

Guia de operação da publicação: onde cada parte roda, como foi configurada e como validar, atualizar e diagnosticar. A decisão e as alternativas estão na [ADR 0003](adr/0003-hospedagem-vercel-render.md).

## Visão geral

| Parte                               | Provedor       | Endereço                                 | Situação                                                                                                                                                                                          |
| ----------------------------------- | -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hub e 7 filhos estáticos            | Vercel (Hobby) | https://components-dusky-nine.vercel.app | ✅ No ar                                                                                                                                                                                          |
| API e Formulários (`apps/servidor`) | Render (Free)  | https://components-servidor.onrender.com | ⏳ Fora do ar em 18/11/2026 (`/api/saude` sem resposta em 40 s). O `render.yaml` (Blueprint) está pronto; criar o serviço é do responsável (#28). Passo a passo curto em [`DEPLOY.md`](DEPLOY.md) |

O visitante usa só o domínio da Vercel. Os caminhos `/api` e `/formularios` são repassados ao Render pelo `vercel.json`, sem o visitante perceber.

| Critério                 | Vercel + Render                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hub e 7 filhos estáticos | Sempre rápidos, sem espera                                                                                                                                           |
| Custo                    | Planos gratuitos                                                                                                                                                     |
| Limitação                | O Render gratuito dorme após 15 minutos sem acesso e leva até cerca de 1 minuto para acordar; afeta só Cadastro (modo API), Tarefas e Formulários na primeira visita |
| Dados                    | Disco temporário no Render gratuito: a API volta aos dados de exemplo a cada reinício, deploy ou hibernação                                                          |

## Pré-requisitos no código

| #   | Item                                   | Ajuste | Situação                                         |
| --- | -------------------------------------- | ------ | ------------------------------------------------ |
| 1   | `.node-version` e `engines` corretos   | A-01   | ✅                                               |
| 2   | API lendo `PORT`                       | A-05   | ✅                                               |
| 3   | Servidor de produção `apps/servidor`   | A-06   | ✅                                               |
| 4   | Script `scripts/montar-publicacao.mjs` | A-07   | ✅                                               |
| 5   | `vercel.json`                          | A-08   | ✅ Escrito; validação completa depende do Render |

## Antes de publicar: ensaio de produção local

Reproduz no computador o site exatamente como fica publicado, num único endereço:

```bash
pnpm build
pnpm montar:publicacao
pnpm ensaio:producao
```

Abra `http://localhost:3333/` e teste os cliques, ou rode o T-01 contra o ensaio:

```powershell
$env:URL_BASE="http://localhost:3333/"; pnpm test:navegacao
Remove-Item Env:URL_BASE
```

O ensaio usa a porta da API: pare o `pnpm dev:api` antes, ou defina outra porta com `PORT`. Ele aplica as mesmas regras do `vercel.json`: rota interna de um filho (ex.: `/trilha/aprendizado/1`) carrega o `index.html` da pasta, e caminho desconhecido na raiz responde 404.

## Render (parte dinâmica)

### Criação do serviço

O serviço nasce do Blueprint (`render.yaml` na raiz), não de um Web Service montado à mão. O passo a passo, clique a clique, está em [`docs/DEPLOY.md`](DEPLOY.md#render-pelo-blueprint-responsável-28) (issue #28, do responsável): **New → Blueprint** → `douglasabnovato/components` → branch `main` → **Apply**. Nenhum valor é pedido.

O que o `render.yaml` define (os mesmos valores, para conferir no painel depois do **Apply**):

| Campo                   | Valor no `render.yaml`                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome                    | `components-servidor` (é o endereço que o `vercel.json` usa; se o Render der outro, atualizar as regras de `/api` e `/formularios` por PR)                             |
| Runtime, plano e região | `node`, `free`, `oregon`                                                                                                                                               |
| Branch                  | `main`                                                                                                                                                                 |
| `rootDir`               | `apps/servidor`                                                                                                                                                        |
| `buildCommand`          | `cd ../.. && corepack pnpm install --frozen-lockfile && corepack pnpm --filter @components/formularios build && corepack pnpm --filter @components/api banco:preparar` |
| `startCommand`          | `node --max-old-space-size=200 --import tsx src/servidor.ts` (roda dentro de `apps/servidor`)                                                                          |
| `healthCheckPath`       | `/api/saude`                                                                                                                                                           |
| `buildFilter.paths`     | `apps/servidor/**`, `apps/api/**`, `apps/formularios/**`, `packages/**`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`, `.node-version`                      |
| Variáveis               | `NODE_VERSION=24.22.1` (a mesma do `.node-version`), `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, `ORIGENS=https://components-dusky-nine.vercel.app`                           |

Com `rootDir: apps/servidor`, o build volta à raiz (`cd ../..`) porque o pnpm instala o monorepo inteiro. O Render só reimplanta quando muda um dos caminhos do `buildFilter`. O deploy termina quando o log mostra `Servidor do components em http://localhost:10000 · produção (API e Formulários)`; a porta é a que o Render informa em `PORT`.

Para mudar build, start ou variáveis, editar o `render.yaml` por PR: o Blueprint reaplica a cada commit na `main`.

### O que o build faz

| Etapa                  | Comando                                        | Por quê                                                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usar o pnpm do projeto | `corepack pnpm ...`                            | Roda a versão do campo `packageManager` (10.28.0). O Render já traz um pnpm próprio em `/usr/bin`, numa área somente leitura; por isso `corepack enable` falha ali (`EROFS: read-only file system`) e o Corepack é chamado diretamente |
| Instalar               | `pnpm install --frozen-lockfile`               | Falha se o `pnpm-lock.yaml` estiver desatualizado, em vez de instalar versões diferentes                                                                                                                                               |
| Compilar o Formulários | `pnpm --filter @components/formularios build`  | Gera `build/server` e `build/client`, que o servidor carrega. A API e o servidor rodam direto do TypeScript, com `tsx`                                                                                                                 |
| Preparar o banco       | `pnpm --filter @components/api banco:preparar` | Cria o banco com os dados de exemplo em `apps/api/.dados`. O Render guarda essa pasta com o resultado do build, e o servidor sobe sem rodar o `initdb`                                                                                 |

O `startCommand` não usa o Corepack nem o pnpm: chama o Node direto, num único processo (ver Memória).

### Memória (limite de 512 MB)

O plano gratuito encerra o serviço acima de 512 MB (`Out of memory (used over 512Mi)`). Boa parte da memória é do banco: o PGlite é um Postgres em WebAssembly dentro do processo, com um piso fixo de 128 MB declarado no próprio `pglite.wasm`. Essa memória fica fora do limite do JavaScript, então `--max-old-space-size` não a controla. Três medidas mantêm o servidor dentro do limite:

| Medida                     | Onde                                                             | Efeito                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Banco criado no build      | `banco:preparar` no `buildCommand` (`render.yaml`)               | Evita o `initdb` na subida, o maior pico                                                                                                                                             |
| Modo econômico do Postgres | `abrirBanco({ memoriaReduzida: true })` no preparo e no servidor | `shared_buffers` de 16 MB e áreas de trabalho pequenas, gravados com `ALTER SYSTEM` no preparo e em vigor quando o servidor abre o banco. O PGlite ignora parâmetros `-c` na partida |
| Um único processo Node     | `startCommand` com `node --import tsx`                           | Sem Corepack, pnpm e processo pai do tsx ocupando memória                                                                                                                            |

O log do servidor mostra a memória em cada etapa (`[memória] início`, `banco aberto`, `Formulários carregado`, `porta aberta`), se o banco veio pronto do build e o `shared_buffers` em vigor (deve ser 16MB). A aba **Metrics** do Render mostra o uso ao longo do tempo. Se ainda faltar memória, a próxima medida é compilar o servidor para JavaScript no build, eliminando o tsx e o esbuild da execução.

## Vercel (parte estática)

### Criação do projeto

1. Em https://vercel.com, **Add New… → Project** e importar `douglasabnovato/components`.
2. Preencher:

| Campo                   | Valor                                         |
| ----------------------- | --------------------------------------------- |
| Vercel Team             | `douglasabnovato's projects` (Hobby)          |
| Project Name            | `components`                                  |
| Root Directory          | `./`                                          |
| Application Preset      | **Other**                                     |
| Build, Output e Install | Sem alteração: o `vercel.json` define os três |
| Environment Variables   | Nenhuma                                       |

3. **Deploy**. O domínio gerado foi `components-dusky-nine.vercel.app`, porque `components.vercel.app` já pertence a outra conta.

> **Atenção ao importar.** A Vercel detecta várias aplicações no repositório e sugere o preset **Services**, com um `vercel.json` próprio e um texto para assistentes de código. Não usar: o preset precisa ser **Other**, para o nosso `vercel.json` controlar o build. Depois do deploy, a tela oferece "Deploy another project from this repository" com 13 pastas; também não usar, porque cada pasta viraria um site com domínio próprio (ver [ADR 0003](adr/0003-hospedagem-vercel-render.md)).

### `vercel.json`

| Chave                                                  | Valor                                              | Função                                     |
| ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------ |
| `framework`                                            | `null`                                             | Desliga a detecção automática de framework |
| `installCommand`                                       | `pnpm install --frozen-lockfile`                   | Instalação reprodutível                    |
| `buildCommand`                                         | `pnpm build && node scripts/montar-publicacao.mjs` | Compila tudo e monta `publicar/`           |
| `outputDirectory`                                      | `publicar`                                         | Pasta publicada                            |
| `rewrites` `/api/:caminho*` e `/formularios/:caminho*` | `https://components-servidor.onrender.com/...`     | Repasse ao Render                          |
| `rewrites` `/<filho>/:caminho*`                        | `/<filho>/index.html`                              | Rotas internas carregam o app do filho     |

As regras por pasta só valem quando o arquivo pedido não existe: arquivos JS e CSS continuam sendo entregues normalmente. O repasse ao Render é resolvido a cada requisição, então criar ou recriar o serviço no Render não exige novo deploy na Vercel.

## Validação

Situação em 18/11/2026, 18h09. Comandos: `curl -s -o /dev/null -w "%{http_code}" -m 40 <endereço>` e `URL_BASE=https://components-dusky-nine.vercel.app/ pnpm test:navegacao`.

| #   | Verificação                                                       | Esperado                   | Situação em 18/11/2026                                                                                                                           |
| --- | ----------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Abrir o hub (`/`)                                                 | 200                        | ✅ 200                                                                                                                                           |
| 2   | Abrir `https://components-servidor.onrender.com/api/saude`        | `{"ok":true,"banco":"ok"}` | ⏳ sem resposta (000); o serviço ainda não existe (#28)                                                                                          |
| 3   | Abrir `/api/saude` pelo domínio da Vercel                         | `{"ok":true,"banco":"ok"}` | ⏳ sem resposta (000), mesmo motivo (#28)                                                                                                        |
| 4   | Abrir `/formularios/` pelo domínio da Vercel                      | 200                        | ⏳ 404 (#28)                                                                                                                                     |
| 5   | Abrir uma rota interna direto (`/trilha/aprendizado/1`)           | 200, carrega o app         | ✅ 200                                                                                                                                           |
| 6   | Rodar a navegação contra o site (`test:navegacao` com `URL_BASE`) | 37 de 37                   | ⏳ 32 de 37. As 5 falhas dependem do servidor: 4 do Formulários (abrir pelo hub, axe e dois de teclado) e o fluxo das Tarefas pelo teclado (#28) |

Para o item 6, acordar o Render antes (abrir a URL do item 2) e rodar:

```powershell
$env:URL_BASE="https://components-dusky-nine.vercel.app/"; pnpm test:navegacao
Remove-Item Env:URL_BASE
```

## Publicar uma nova versão

Os dois provedores publicam automaticamente a cada push na `main`:

1. Trabalho em `feature/AAAA-MM-DD`, pull request para `developer/sprint-<próxima quinta>`, CI verde.
2. Pull request da sprint para a `main`, CI verde, merge feito pelo responsável (a `main` é protegida pelo ruleset `principal-protegida`).
3. Vercel e Render fazem o deploy sozinhos. Cada branch enviada ao GitHub também ganha uma prévia na Vercel.
4. Rodar a navegação contra o domínio publicado (`URL_BASE=https://components-dusky-nine.vercel.app/ pnpm test:navegacao`, item 6 da Validação).

Para voltar a uma versão anterior: na Vercel, **Deployments → (versão anterior) → Promote to Production**; no Render, **Events → (deploy anterior) → Rollback**.

## Problemas comuns

| Sintoma                                                                                                 | Causa provável                                                      | Ação                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Render: `EROFS: read-only file system, unlink '/usr/bin/pnpm'`                                          | `corepack enable` tentando substituir o pnpm do Render              | Usar `corepack pnpm ...` nos comandos, sem `corepack enable`                                                                                |
| Render: `pnpm: command not found` ou versão errada do pnpm                                              | Comando sem o Corepack                                              | Conferir `corepack pnpm` no `buildCommand` (`render.yaml`)                                                                                  |
| Render: `Out of memory (used over 512Mi)`                                                               | Pico de memória na subida                                           | Conferir o `banco:preparar` no `buildCommand` (`render.yaml`) e o `startCommand` de processo único; ver a seção Memória e o log `[memória]` |
| Render ou local: `LinkError ... memory import has ... pages which is smaller than the declared initial` | Memória inicial do PGlite abaixo do piso de 128 MB do `pglite.wasm` | Não usar a opção `initialMemory` abaixo de 128 MB                                                                                           |
| Log mostra `Banco ausente: criando agora.` ou `shared_buffers de 128MB`                                 | Banco não foi preparado no build                                    | Conferir o fim do `buildCommand` (`render.yaml`)                                                                                            |
| Render: erro de versão do Node ou `Unsupported engine`                                                  | `NODE_VERSION` ausente ou diferente                                 | Conferir `NODE_VERSION` (`24.22.1`) no `render.yaml` e corrigir por PR                                                                      |
| Render ou Vercel: `ERR_PNPM_OUTDATED_LOCKFILE`                                                          | `pnpm-lock.yaml` desatualizado                                      | Rodar `pnpm install` local, fazer commit do lockfile e push                                                                                 |
| Vercel usa outra versão do pnpm                                                                         | Vercel ignorou o `packageManager`                                   | Variável `ENABLE_EXPERIMENTAL_COREPACK=1` no projeto e novo deploy                                                                          |
| `/api/...` ou `/formularios/` com erro pela Vercel                                                      | Render fora do ar, dormindo ou com outro nome                       | Abrir a URL do Render direto; conferir o nome no `vercel.json`                                                                              |
| Formulários responde 503                                                                                | Build do Formulários não foi gerado                                 | Conferir o `buildCommand` do `render.yaml` e o log do build no Render                                                                       |
| Primeira resposta da API leva cerca de 1 minuto                                                         | Render acordando                                                    | Esperado no plano gratuito                                                                                                                  |
| Clientes e tarefas criados somem                                                                        | Disco temporário do Render                                          | Esperado no plano gratuito (A-37)                                                                                                           |

Ao atualizar o Node para a linha 25 ou superior, o Corepack deixa de vir junto com o Node: será preciso trocar a estratégia no build (por exemplo, `npx corepack pnpm ...`).

## Variáveis de ambiente

| Variável                          | Onde               | Valor                                                                                                 |
| --------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `NODE_VERSION`                    | Render             | `24.22.1`, a versão do `.node-version`                                                                |
| `PORT`                            | Render             | Definida pelo próprio Render (10000)                                                                  |
| `ORIGENS`                         | Render             | `https://components-dusky-nine.vercel.app`                                                            |
| `COREPACK_ENABLE_DOWNLOAD_PROMPT` | Render             | `0`, para o Corepack baixar o pnpm sem pedir confirmação                                              |
| `PASTA_DADOS`                     | Render             | Opcional; padrão `apps/api/.dados`                                                                    |
| `SERVIR_ESTATICOS`                | Só no ensaio local | `1` para o servidor entregar também `publicar/` (o `pnpm ensaio:producao` já faz isso com `--ensaio`) |
| `URL_BASE`                        | Testes             | Endereço testado pelo T-01; sem ela, o Playwright sobe o ambiente de desenvolvimento                  |
| `ENABLE_EXPERIMENTAL_COREPACK`    | Vercel             | Só se a Vercel não respeitar o `packageManager`                                                       |

## Opcional

- O portfólio usa só planos gratuitos e os domínios gerados pelos provedores (regra do responsável): nada de domínio próprio nem plano pago. Se o endereço da Vercel mudar, atualizar `ORIGENS` no `render.yaml` e esta documentação.
- A espera do Render ao acordar (cerca de 1 minuto) é aceita no plano gratuito; o hub avisa quando o servidor não responde (#37).
