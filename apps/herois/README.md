# 03 · Portal de Heróis

Um universo de heróis originais para explorar: 12 heróis inspirados em paisagens e cidades brasileiras, 3 equipes e 2 universos, com catálogo filtrável, ficha completa, equipes e comparação frente a frente.

Projeto 03 do monorepo `components`. Inspirado no projeto marvel (cabeçalho com menu em styled-components); heróis, nomes, histórias, emblemas e ilustrações são 100% originais, sem personagens ou marcas de terceiros.

## Rodar

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:herois
```

Abre em http://localhost:5173.

## Telas

| Rota           | Tela                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| `/`            | Cena em camadas (parallax), filtros por universo, equipe e busca (na URL) e catálogo animado |
| `/heroi/:slug` | Emblema, identidade, história, poderes, atributos animados, colegas de equipe e comparar     |
| `/equipes`     | Universos, equipes, lema, força somada e integrantes                                         |
| `/comparar`    | Dois heróis lado a lado (`?a=&b=`), com o vencedor de cada atributo e do total               |

## Regras de negócio

- **H1**: o universo é validado por esquema Zod: atributos de 1 a 10, 2 a 4 poderes, equipes e universos existentes, slugs únicos.
- **H2**: os filtros ficam na URL. Trocar o universo limpa a equipe se ela for de outro universo, e a lista de equipes acompanha o universo escolhido.
- **H3**: a busca olha nome, identidade, cidade e poderes, sem diferenciar maiúsculas e acentos.
- **H4**: a comparação aponta o vencedor de cada atributo e do total (soma dos quatro); empate é tratado.
- **H5**: toda animação respeita "movimento reduzido" (`MotionConfig reducedMotion="user"`).
- **H6**: o menu vira painel no celular: `aria-expanded`, Esc fecha e devolve o foco, e ele fecha sozinho ao navegar.

## Tailwind CSS v4 com os tokens do ecossistema

`src/estilos/global.css` importa só o tema e os utilitários do Tailwind, **sem o preflight**: a base (fontes, cores, foco) continua vindo de `@components/ui/tokens.css`. Um bloco `@theme inline` transforma os tokens em utilitários: `bg-superficie`, `text-suave`, `border-borda`, `rounded-g`, `font-titulo`. Assim o projeto usa Tailwind sem abrir mão do design system comum (aprendizados 61 a 63 da Trilha).

## Motion

- `Cena`: três camadas com velocidades diferentes na rolagem (`useScroll` + `useTransform`).
- `CardHeroi`: entra, sai e se reposiciona ao filtrar (`AnimatePresence` + `layout`).
- `BarraAtributo`: cresce quando aparece na tela (`whileInView`).

## Estrutura

```
src/
├── dominio/      tipos (Zod), universo (dados originais), regras e API pública para o hub
├── componentes/  Layout, Cena, Emblema, CardHeroi, BarraAtributo
├── paginas/      Início, Ficha, Equipes, Comparar, NaoEncontrado
└── testes/       testes de integração com axe
```

## Stack

React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Motion, Zod, `@components/ui`, Vitest, Testing Library e axe.
