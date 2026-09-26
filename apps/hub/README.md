# Hub (projeto 0)

SPA principal do monorepo `components`. Apresenta os 7 projetos filhos, cada um numa seção própria com uma demonstração ao vivo e um botão para abrir o projeto.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev
```

O hub abre em http://localhost:5170.

## Estrutura

- `src/dados/projetos.ts`: fonte única dos 7 projetos (nome, textos, cores, fase e status). Menu, seções, linha do tempo e créditos são gerados a partir desse arquivo.
- `src/componentes/`: cabeçalho, topo e as peças comuns das seções (`Secao`, `CabecalhoSecao`, `RodapeSecao`, `ChamadaProjeto`).
- `src/secoes/`: uma pasta por seção (Flix, Cadastro, Heróis, Servidor, Tarefas, Pelada, Laboratório, Arquitetura e Rodapé).
- `src/testes/`: testes de dados, estrutura, regras das demonstrações e acessibilidade (axe).

## Publicar um filho

Troque o `status` do projeto em `src/dados/projetos.ts` para `'publicado'` e confira o `href`. O botão "Abrir" deixa de mostrar "Em construção".
