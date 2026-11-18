# Deploy

Passo a passo curto para publicar o `components`. O guia completo, com memória, problemas comuns e variáveis, está em [`04-hospedagem.md`](04-hospedagem.md). A decisão está na [ADR 0003](adr/0003-hospedagem-vercel-render.md).

## Estado em 16/11/2026

| Parte                               | Onde           | Arquivo                                     | Situação (comando e resultado em 16/11/2026)                                                                                                                                                                           |
| ----------------------------------- | -------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hub e 7 filhos estáticos            | Vercel (Hobby) | [`vercel.json`](../vercel.json)             | No ar. `curl -s -o /dev/null -w "%{http_code}"` em `/`, `/flix/`, `/cadastro/` e `/trilha/`: 200. O HTML traz o topo pré-renderizado (`grep -c topo-titulo`: 1) e o mesmo `index-CuG9TW5l.js` do build local da `main` |
| API e Formulários (`apps/servidor`) | Render (Free)  | [`render.yaml`](../render.yaml) (Blueprint) | Fora do ar. `curl -m 60 https://components-dusky-nine.vercel.app/api/saude`: sem resposta (000); `/formularios/`: 404. Criar o serviço é do responsável: #28                                                           |
| Medição de uso                      | GoatCounter    | código no hub (`apps/hub/src/medicao.ts`)   | O site já carrega o script; a conta `douglasabnovato` não existe (`https://douglasabnovato.goatcounter.com/`: 400). É do responsável: #27                                                                              |

Tudo em plano gratuito. Nenhum segredo: o banco é o PGlite, dentro do processo do servidor.

## Vercel (já feito)

A Vercel publica sozinha a cada push na `main`. Nada a fazer. Se for preciso recriar: **Add New… → Project** → `douglasabnovato/components` → **Application Preset: Other** → **Deploy**. O `vercel.json` define instalação, build e saída.

## Render pelo Blueprint (responsável, #28)

1. Abrir https://dashboard.render.com.
2. Se existir um serviço antigo `components-servidor` que não sobe: abrir o serviço → **Settings** → no fim da página, **Delete Web Service** → confirmar com o nome. Sem isso, o serviço novo ganha um sufixo no endereço.
3. Clicar em **New** → **Blueprint**.
4. Escolher o repositório `douglasabnovato/components` e a branch `main`.
5. O Render lê o `render.yaml` e mostra o serviço `components-servidor` (Node, Free, Oregon). Nenhum valor é pedido. Clicar em **Apply**.
6. Esperar no **Logs** a linha `Servidor do components em http://localhost:10000 · produção (API e Formulários)`. As linhas `[memória]` devem ficar abaixo de 512 MB.
7. Copiar o endereço do serviço no topo da página. Se não for `https://components-servidor.onrender.com`, avisar na #28: o `vercel.json` precisa do endereço novo, por PR.
8. Conferir no terminal:

```bash
curl -s https://components-dusky-nine.vercel.app/api/saude      # {"ok":true,"banco":"ok"}
curl -s -o /dev/null -w "%{http_code}\n" https://components-dusky-nine.vercel.app/formularios/   # 200
```

## Depois de publicar

1. Rodar os testes contra o site (acordar o Render antes, abrindo `/api/saude`):

```bash
URL_BASE=https://components-dusky-nine.vercel.app pnpm test:navegacao
```

2. Registrar no `docs/MVP.md` (critérios 3 e 9) o comando, a data e o resultado.

## Publicar uma nova versão

`feature/AAAA-MM-DD` → PR para `developer/sprint-<quinta>` com CI verde → PR da sprint para a `main`, mesclado pelo responsável. A `main` é protegida (ruleset `principal-protegida`, check obrigatório "Verificação e navegação"). Vercel e Render publicam sozinhos depois do merge.
