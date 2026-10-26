# UI compartilhada

Pacote `@components/ui`: identidade visual e peças comuns do ecossistema, usadas pelo hub e pelos filhos. Também guarda o **mapa do ecossistema**, a fonte única dos endereços entre os projetos.

## Conteúdo

| Parte | Caminho | O que oferece |
| --- | --- | --- |
| Tokens | `src/tokens.css` | Cores, tipografia, espaçamento, raios e movimento. Tema escuro por padrão; `[data-tema='claro']` inverte. Cada projeto define o próprio `--acento` |
| Componentes | `src/componentes/` | Abas, avisos, diálogo, botões (`BotaoPilula`, `BotaoVoltar`, `BotaoPausa`), cards, carrossel, contador, menus e `SkipLink` |
| Hooks | `src/hooks/` | `useMovimentoReduzido` e `useSecaoAtiva` |
| Mapa do ecossistema | `src/utilitarios/ecossistema.ts` | Número, nome, pasta e porta de cada projeto, e as funções de endereço |
| Contraste | `src/utilitarios/contraste.ts` | Cálculo de contraste entre cores, usado nos testes |
| Apoio a testes | `src/testes/axe.ts`, `src/testes/setup.ts` | Verificação de acessibilidade e configuração comum do Vitest |

## Mapa do ecossistema

Todo endereço entre projetos sai deste arquivo. Em desenvolvimento as funções devolvem `http://localhost:<porta>/`; no build, `/<pasta>/`.

| Função | Uso |
| --- | --- |
| `enderecoDoProjeto(n, caminho?)` | Link do hub (ou de outro filho) para o projeto `n` |
| `enderecoDoHub(n?)` | Botão de volta do filho `n`, com a âncora `#filho-n` |
| `enderecoDaApi()` | Base das chamadas à API (`/api`) |
| `proxyDaApi()` | Encaminhamento de `/api` no `vite.config.ts` em desenvolvimento |

O mesmo mapa serve de gabarito para os testes de navegação (`packages/testes-e2e`). Para acrescentar um projeto, inclua-o em `ecossistema` e crie a seção no hub.

## Importar

```ts
import { BotaoVoltar, enderecoDoHub } from '@components/ui'
import '@components/ui/tokens.css'
import { ecossistema } from '@components/ui/ecossistema' // sem React, para configs e testes
```

## Testes

```bash
pnpm --filter @components/ui test
```

Cobrem os componentes (com axe), o contraste dos tokens e o mapa do ecossistema.
