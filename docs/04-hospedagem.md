# 04 · Hospedagem

Guia de operação da publicação: onde cada parte roda, como foi configurada e como validar, atualizar e diagnosticar. A decisão e as alternativas estão na [ADR 0003](adr/0003-hospedagem-vercel-render.md).

## Visão geral

| Parte | Provedor | Endereço | Situação |
| --- | --- | --- | --- |
| Hub e 7 filhos estáticos | Vercel (Hobby) | https://components-dusky-nine.vercel.app | ✅ No ar |
| API e Formulários (`apps/servidor`) | Render (Free) | https://components-servidor.onrender.com | ⏳ A criar (A-09) |

O visitante usa só o domínio da Vercel. Os caminhos `/api` e `/formularios` são repassados ao Render pelo `vercel.json`, sem o visitante perceber.

| Critério | Vercel + Render |
| --- | --- |
| Hub e 7 filhos estáticos | Sempre rápidos, sem espera |
| Custo | Planos gratuitos |
| Limitação | O Render gratuito dorme após 15 minutos sem acesso e leva até cerca de 1 minuto para acordar; afeta só Cadastro (modo API), Tarefas e Formulários na primeira visita |
| Dados | Disco temporário no Render gratuito: a API volta aos dados de exemplo a cada reinício, deploy ou hibernação |

## Pré-requisitos no código

| # | Item | Ajuste | Situação |
| --- | --- | --- | --- |
| 1 | `.node-version` e `engines` corretos | A-01 | ✅ |
| 2 | API lendo `PORT` | A-05 | ✅ |
| 3 | Servidor de produção `apps/servidor` | A-06 | ✅ |
| 4 | Script `scripts/montar-publicacao.mjs` | A-07 | ✅ |
| 5 | `vercel.json` | A-08 | ✅ Escrito; validação completa depende do Render |

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

1. Em https://dashboard.render.com, entrar com a conta do GitHub.
2. **+ New → Web Service** e escolher o repositório `douglasabnovato/components`.
3. Preencher:

| Campo | Valor |
| --- | --- |
| Name | `components-servidor` (é o endereço que o `vercel.json` usa; se for outro, atualizar as regras de `/api` e `/formularios`) |
| Language | Node |
| Branch | `main` |
| Region | Oregon (US West), a mesma dos outros serviços da conta |
| Root Directory | vazio (raiz do repositório) |
| Build Command | `corepack pnpm install --frozen-lockfile && corepack pnpm --filter @components/formularios build` |
| Start Command | `corepack pnpm --filter @components/servidor start` |
| Instance Type | Free |

4. Em **Environment Variables**:

| Variável | Valor |
| --- | --- |
| `NODE_VERSION` | `24.22.1` (a mesma do `.node-version`) |
| `ORIGENS` | `https://components-dusky-nine.vercel.app` |
| `COREPACK_ENABLE_DOWNLOAD_PROMPT` | `0` |

5. Em **Advanced → Health Check Path**: `/api/saude`.
6. **Deploy Web Service**. O deploy termina quando o log mostra `Servidor do components em http://localhost:10000 · produção (API e Formulários)`. A porta é a que o Render informa em `PORT`.

### O que o build faz

| Etapa | Comando | Por quê |
| --- | --- | --- |
| Usar o pnpm do projeto | `corepack pnpm ...` | Roda a versão do campo `packageManager` (10.28.0). O Render já traz um pnpm próprio em `/usr/bin`, numa área somente leitura; por isso `corepack enable` falha ali (`EROFS: read-only file system`) e o Corepack é chamado diretamente |
| Instalar | `pnpm install --frozen-lockfile` | Falha se o `pnpm-lock.yaml` estiver desatualizado, em vez de instalar versões diferentes |
| Compilar o Formulários | `pnpm --filter @components/formularios build` | Gera `build/server` e `build/client`, que o servidor carrega. A API e o servidor rodam direto do TypeScript, com `tsx` |

## Vercel (parte estática)

### Criação do projeto

1. Em https://vercel.com, **Add New… → Project** e importar `douglasabnovato/components`.
2. Preencher:

| Campo | Valor |
| --- | --- |
| Vercel Team | `douglasabnovato's projects` (Hobby) |
| Project Name | `components` |
| Root Directory | `./` |
| Application Preset | **Other** |
| Build, Output e Install | Sem alteração: o `vercel.json` define os três |
| Environment Variables | Nenhuma |

3. **Deploy**. O domínio gerado foi `components-dusky-nine.vercel.app`, porque `components.vercel.app` já pertence a outra conta.

> **Atenção ao importar.** A Vercel detecta várias aplicações no repositório e sugere o preset **Services**, com um `vercel.json` próprio e um texto para assistentes de código. Não usar: o preset precisa ser **Other**, para o nosso `vercel.json` controlar o build. Depois do deploy, a tela oferece "Deploy another project from this repository" com 13 pastas; também não usar, porque cada pasta viraria um site com domínio próprio (ver [ADR 0003](adr/0003-hospedagem-vercel-render.md)).

### `vercel.json`

| Chave | Valor | Função |
| --- | --- | --- |
| `framework` | `null` | Desliga a detecção automática de framework |
| `installCommand` | `pnpm install --frozen-lockfile` | Instalação reprodutível |
| `buildCommand` | `pnpm build && node scripts/montar-publicacao.mjs` | Compila tudo e monta `publicar/` |
| `outputDirectory` | `publicar` | Pasta publicada |
| `rewrites` `/api/:caminho*` e `/formularios/:caminho*` | `https://components-servidor.onrender.com/...` | Repasse ao Render |
| `rewrites` `/<filho>/:caminho*` | `/<filho>/index.html` | Rotas internas carregam o app do filho |

As regras por pasta só valem quando o arquivo pedido não existe: arquivos JS e CSS continuam sendo entregues normalmente. O repasse ao Render é resolvido a cada requisição, então criar ou recriar o serviço no Render não exige novo deploy na Vercel.

## Validação

| # | Verificação | Esperado | Situação |
| --- | --- | --- | --- |
| 1 | Abrir o hub | Carrega na hora | ✅ |
| 2 | Abrir `https://components-servidor.onrender.com/api/saude` | `{"ok":true}` | ⏳ A-09 |
| 3 | Abrir `/api/saude` pelo domínio da Vercel | `{"ok":true}` | ⏳ A-09 |
| 4 | Clicar nos 8 projetos e voltar | Todos funcionam | ⏳ Formulários depende do A-09 |
| 5 | Abrir uma rota interna direto (`/trilha/aprendizado/1`) | Carrega o app | ⏳ A-08 |
| 6 | Criar cliente (modo API) e concluir tarefa | Funcionam | ⏳ A-09 |
| 7 | Enviar formulário com JavaScript desligado | Funciona | ⏳ A-09 |
| 8 | Rodar o T-05 | 11 de 11 | ⏳ A-11 |

Para o item 8, acordar o Render antes (abrir a URL do item 2) e rodar:

```powershell
$env:URL_BASE="https://components-dusky-nine.vercel.app/"; pnpm test:navegacao
Remove-Item Env:URL_BASE
```

## Publicar uma nova versão

Os dois provedores publicam automaticamente a cada push na `main`:

1. Trabalho em `feature/*`, pull request para `developer-mvp`, CI verde.
2. Pull request de `developer-mvp` para `main`, CI verde, merge.
3. Vercel e Render fazem o deploy sozinhos. Cada branch enviada ao GitHub também ganha uma prévia na Vercel.
4. Rodar o T-05 contra o domínio publicado.

Para voltar a uma versão anterior: na Vercel, **Deployments → (versão anterior) → Promote to Production**; no Render, **Events → (deploy anterior) → Rollback**.

## Problemas comuns

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| Render: `EROFS: read-only file system, unlink '/usr/bin/pnpm'` | `corepack enable` tentando substituir o pnpm do Render | Usar `corepack pnpm ...` nos comandos, sem `corepack enable` |
| Render: `pnpm: command not found` ou versão errada do pnpm | Comando sem o Corepack | Conferir `corepack pnpm` no Build e no Start Command |
| Render: erro de versão do Node ou `Unsupported engine` | `NODE_VERSION` ausente ou diferente | Definir `24.22.1` e fazer **Manual Deploy** |
| Render ou Vercel: `ERR_PNPM_OUTDATED_LOCKFILE` | `pnpm-lock.yaml` desatualizado | Rodar `pnpm install` local, fazer commit do lockfile e push |
| Vercel usa outra versão do pnpm | Vercel ignorou o `packageManager` | Variável `ENABLE_EXPERIMENTAL_COREPACK=1` no projeto e novo deploy |
| `/api/...` ou `/formularios/` com erro pela Vercel | Render fora do ar, dormindo ou com outro nome | Abrir a URL do Render direto; conferir o nome no `vercel.json` |
| Formulários responde 503 | Build do Formulários não foi gerado | Conferir o Build Command do Render |
| Primeira resposta da API leva cerca de 1 minuto | Render acordando | Esperado no plano gratuito |
| Clientes e tarefas criados somem | Disco temporário do Render | Esperado no plano gratuito (A-37) |

Ao atualizar o Node para a linha 25 ou superior, o Corepack deixa de vir junto com o Node: será preciso trocar a estratégia no build (por exemplo, `npx corepack pnpm ...`).

## Variáveis de ambiente

| Variável | Onde | Valor |
| --- | --- | --- |
| `NODE_VERSION` | Render | `24.22.1`, a versão do `.node-version` |
| `PORT` | Render | Definida pelo próprio Render (10000) |
| `ORIGENS` | Render | `https://components-dusky-nine.vercel.app` |
| `COREPACK_ENABLE_DOWNLOAD_PROMPT` | Render | `0`, para o Corepack baixar o pnpm sem pedir confirmação |
| `PASTA_DADOS` | Render | Opcional; padrão `apps/api/.dados` |
| `SERVIR_ESTATICOS` | Só no ensaio local | `1` para o servidor entregar também `publicar/` (o `pnpm ensaio:producao` já faz isso com `--ensaio`) |
| `URL_BASE` | Testes | Endereço testado pelo T-01; sem ela, o Playwright sobe o ambiente de desenvolvimento |
| `ENABLE_EXPERIMENTAL_COREPACK` | Vercel | Só se a Vercel não respeitar o `packageManager` |

## Opcional

- Domínio próprio ou mais legível na Vercel (A-36); ao trocar, atualizar `ORIGENS` no Render e esta documentação.
- Se a espera do Render incomodar: plano pago do Render ou outra hospedagem sem hibernação.
