# Testes de ponta a ponta

Testes do **ecossistema** com Playwright: verificam o comportamento entre projetos, como o visitante percorre o site. Os testes de cada projeto continuam na pasta dele; aqui ficam os que atravessam o hub e os filhos.

## O que testa

| Teste | Arquivo | Casos |
| --- | --- | --- |
| T-01 · Navegação do ecossistema | `testes/navegacao/ecossistema.spec.ts` | Hub carrega sem erros; toda âncora interna tem destino; há link para os 8 filhos; cada filho abre pelo hub e volta para a sua seção (11 casos) |

O gabarito é o mapa do ecossistema (`@components/ui/ecossistema`): nenhum endereço é escrito à mão. Ao acrescentar um filho no mapa, ele passa a ser testado automaticamente.

Todo teste falha se a página registrar **erro de console** ou **exceção não tratada**, mesmo que as asserções passem (`suporte/teste.ts`). Ruídos inofensivos só entram na lista de ignorados com o motivo.

## Rodar

Na primeira vez, instale o navegador:

```bash
pnpm --filter @components/testes-e2e exec playwright install chromium
```

| Contra | Comando | Observação |
| --- | --- | --- |
| Desenvolvimento | `pnpm test:navegacao` | Sobe a API, o hub e os 8 filhos sozinho; reaproveita os que já estiverem rodando |
| Ensaio de produção | `URL_BASE=http://localhost:3333/` e `pnpm test:navegacao` | Com o `pnpm ensaio:producao` rodando em outro terminal |
| Produção | `URL_BASE=https://components-dusky-nine.vercel.app/` e `pnpm test:navegacao` | Acordar o Render antes |

No PowerShell:

```powershell
$env:URL_BASE="http://localhost:3333/"; pnpm test:navegacao
Remove-Item Env:URL_BASE
```

## Configuração

| Item | Valor |
| --- | --- |
| Navegador | Chromium, com movimento reduzido |
| Paralelismo | Todos os testes em paralelo; 2 workers no CI |
| Repetição | 1 nova tentativa no CI, nenhuma local |
| Relatórios | `list` local; `github` e `html` no CI (guardados como artefato em caso de falha) |
| Rastreamento | Trace guardado só em falha |
| `CAMINHO_CHROMIUM` | Opcional: usar outro executável do Chromium |

## Acrescentar um teste

1. Criar `testes/<grupo>/<nome>.spec.ts`. O próximo grupo previsto é `testes/clicaveis/` (T-02).
2. Importar `test` e `expect` de `../../suporte/teste`, e não de `@playwright/test`.
3. Ler endereços e nomes do `ecossistema`.
4. Se o grupo precisar de um script próprio, acrescentá-lo ao `package.json` do pacote e da raiz.

## Estrutura

```
playwright.config.ts   servidores de desenvolvimento ou URL_BASE
suporte/teste.ts       teste base: falha com erro de console ou exceção
testes/navegacao/      T-01
```
