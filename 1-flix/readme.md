# 01 · Flix

Catálogo de vídeos do YouTube organizado por categoria. Você cola o link, escolhe a categoria, e a capa, o player e o destaque se montam sozinhos. Os dados ficam salvos no navegador.

Projeto 01 do monorepo `components`. Ideia: desafio AluraFlix (Alura). Implementação de referência: LeoFlix, de Leonardo de Sant Ana. Código, marca e visual deste projeto são novos.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:flix
```

Abre em http://localhost:5171. Para rodar hub e Flix juntos (o botão "Abrir Flix" do hub e o "Hub" do Flix passam a funcionar):

```bash
pnpm dev:tudo
```

## Telas

| Rota                                                | Tela                                                                                                                                         |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                 | Início: carrossel com o destaque de cada categoria (o banner primeiro) e abas por categoria. Com `?busca=`, mostra os resultados             |
| `/assistir/:id`                                     | Player leve (carrega o YouTube só no clique), detalhes e "Mais da categoria"                                                                 |
| `/painel`                                           | Categorias: criar, editar, cor com contraste, vídeo destaque, banner, excluir com desfazer. Também exportar, importar e restaurar o catálogo |
| `/painel?aba=videos`                                | Vídeos: editar e excluir com desfazer                                                                                                        |
| `/painel/videos/novo` e `/painel/videos/:id/editar` | Formulário com validação do link e prévia da capa                                                                                            |

## Regras de negócio

- **R1**: o primeiro vídeo de uma categoria vira o destaque dela.
- **R2/R5**: o banner é sempre uma categoria com vídeos. Se ela esvaziar, a próxima assume.
- **R3**: há um destaque por categoria e uma categoria de banner.
- **R4**: excluir uma categoria exclui os vídeos dela.
- **R6**: o nome da categoria não se repete (sem diferenciar maiúsculas de minúsculas nem acentos).
- **R7**: capa e player vêm do ID do YouTube (links watch, youtu.be, shorts, embed e live).
- **R8**: a cor do texto do rótulo é escolhida pelo contraste WCAG.
- **R9**: os dados são salvos no navegador, na chave `components:flix:catalogo:v1`.
- **R10**: dá para restaurar o catálogo inicial.
- **R11**: editar um vídeo mantém o id e o destaque.

As regras ficam em `src/dominio/catalogo.ts` como funções puras, com testes em `catalogo.test.ts`.

## Estrutura

```
src/
├── dominio/      tipos (Zod), regras, YouTube, catálogo inicial, API pública para o hub
├── dados/        repositório (contrato + localStorage), TanStack Query, exportar/importar
├── componentes/  Layout, CardVideo, Player, RotuloCategoria, SeletorCor, LinkPilula, estados
├── paginas/      Início, Assistir, Painel, FormularioVideo, NaoEncontrado
└── testes/       setup e testes de integração com axe
```

## Stack

React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Embla (via `@components/ui`), CSS Modules, Vitest, Testing Library e axe.

## Vídeos de exemplo

O catálogo inicial usa vídeos públicos do canal Fireship, exibidos pelo player oficial do YouTube. As descrições são resumos próprios.
