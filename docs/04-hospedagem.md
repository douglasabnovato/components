# 04 · Hospedagem

## Decisão

**Vercel** para o hub e os filhos estáticos, **Render** para a API e o SSR do Formulários, sob um único domínio. Detalhes e alternativas em [ADR 0003](adr/0003-hospedagem-vercel-render.md).

## Por que essa combinação

| Critério | Vercel + Render |
| --- | --- |
| Hub e 6 filhos estáticos | Sempre rápidos, sem espera |
| Custo | Planos gratuitos |
| Limitação | O Render gratuito dorme após 15 minutos sem acesso e leva cerca de 1 minuto para acordar; afeta só Cadastro (modo API), Tarefas e Formulários na primeira visita |
| Dados | Disco temporário no Render gratuito: a API recria os dados de exemplo a cada reinício |

## Pré-requisitos no código

| # | Item | Ajuste |
| --- | --- | --- |
| 1 | `.node-version` e `engines` corretos | A-01 |
| 2 | API lendo `PORT` | A-05 |
| 3 | Servidor de produção `apps/servidor` | A-06 |
| 4 | Script `scripts/montar-publicacao.mjs` | A-07 |
| 5 | `vercel.json` | A-08 |

## Antes de publicar: ensaio de produção local

Reproduz no computador o site exatamente como ficará publicado, num único endereço:

```bash
pnpm build
node scripts/montar-publicacao.mjs   # ou: pnpm montar:publicacao
pnpm ensaio:producao
```

Abra o endereço indicado no terminal (padrão `http://localhost:3333/`) e teste todos os cliques. Se tudo funcionar aqui, o deploy tende a funcionar de primeira. O ensaio usa a porta da API: pare o `pnpm dev:api` antes, ou defina outra porta com `PORT`.

O ensaio aplica as mesmas regras do `vercel.json`: rota interna de um filho (ex.: `/trilha/aprendizado/1`) carrega o `index.html` da pasta, e caminho desconhecido na raiz responde 404.

## Passo a passo

### 1. Render (parte dinâmica)

1. Criar um **Web Service** ligado ao repositório `douglasabnovato/components`, com o nome `components-servidor` (é o endereço que o `vercel.json` já usa; se o nome for outro, atualizar as duas regras de `/api` e `/formularios` no `vercel.json`).
2. Configurar:

| Campo | Valor |
| --- | --- |
| Branch | A branch publicada (`main` após o merge) |
| Build | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @components/formularios build` |
| Start | `pnpm --filter @components/servidor start` |
| Variável `NODE_VERSION` | A mesma do `.node-version` |
| Variável `ORIGENS` | Endereço da Vercel |

3. Testar `https://<servico>.onrender.com/api/saude` → `{"ok":true}`.

### 2. Vercel (parte estática)

1. Conferir o endereço do Render no `vercel.json` (`https://components-servidor.onrender.com`).
2. Criar o projeto na Vercel ligado ao repositório.
3. A Vercel lê o `vercel.json`, que segue este modelo:

```json
{
  "buildCommand": "pnpm build && node scripts/montar-publicacao.mjs",
  "outputDirectory": "publicar",
  "rewrites": [
    { "source": "/api/:caminho*", "destination": "https://<servico>.onrender.com/api/:caminho*" },
    { "source": "/formularios/:caminho*", "destination": "https://<servico>.onrender.com/formularios/:caminho*" },
    { "source": "/flix/:caminho*", "destination": "/flix/index.html" },
    { "source": "/cadastro/:caminho*", "destination": "/cadastro/index.html" },
    { "source": "/herois/:caminho*", "destination": "/herois/index.html" },
    { "source": "/tarefas/:caminho*", "destination": "/tarefas/index.html" },
    { "source": "/pelada/:caminho*", "destination": "/pelada/index.html" },
    { "source": "/laboratorio/:caminho*", "destination": "/laboratorio/index.html" },
    { "source": "/trilha/:caminho*", "destination": "/trilha/index.html" }
  ]
}
```

As regras por pasta só valem quando o arquivo pedido não existe: arquivos JS e CSS continuam sendo entregues normalmente. Confirmar a sintaxe `:caminho*` no primeiro deploy. O `vercel.json` real também define `"framework": null` (sem detecção automática de framework) e `installCommand` com `--frozen-lockfile`. Se a Vercel usar uma versão do pnpm diferente da do `packageManager`, definir a variável `ENABLE_EXPERIMENTAL_COREPACK=1` no projeto.

### 3. Validação

| # | Verificação | Esperado |
| --- | --- | --- |
| 1 | Abrir o hub | Carrega na hora |
| 2 | Clicar nos 8 projetos e voltar | Todos funcionam |
| 3 | Abrir uma rota interna direto (ex.: `/trilha/aprendizado/1`) | Carrega o app |
| 4 | Criar cliente (modo API) e concluir tarefa | Funcionam |
| 5 | Enviar formulário com JavaScript desligado | Funciona |
| 6 | Rodar T-05 (fumaça em produção) | Verde |

### 4. Opcional

- Domínio próprio na Vercel (ex.: `components.douglasabnovato.dev`).
- Se a espera do Render incomodar: plano pago do Render ou outra hospedagem sem hibernação.

## Variáveis de ambiente

| Variável | Onde | Valor |
| --- | --- | --- |
| `NODE_VERSION` | Render | Versão do `.node-version` |
| `PORT` | Render | Definida pelo próprio Render |
| `ORIGENS` | Render | Domínio da Vercel |
| `PASTA_DADOS` | Render | Opcional; padrão `apps/api/.dados` |
| `SERVIR_ESTATICOS` | Só no ensaio local | `1` para o servidor entregar também a pasta `publicar/` (o `pnpm ensaio:producao` já faz isso com a opção `--ensaio`) |
