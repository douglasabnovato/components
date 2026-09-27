/*
 * Fonte única de dados do hub: identidade do site e os 8 projetos filhos.
 * Seções, menu, índice e rodapé são gerados a partir daqui. Os endereços vêm
 * do mapa do ecossistema (@components/ui); a fase é a ordem real de construção.
 */
import { enderecoDoProjeto } from '@components/ui'

export type Tema = 'claro' | 'escuro'
export type Status = 'em-construcao' | 'publicado'

export type Projeto = {
  numero: number
  id: `filho-${number}`
  nome: string
  pastaOriginal: string
  creditoIdeia: string
  titulo: string
  resumo: string
  recursos: string[]
  stack: string[]
  referencia: string
  tema: Tema
  acento: string
  sobreAcento: string
  acentoTexto: string
  fase: number
  status: Status
  href: string
}

export const site = {
  nome: 'components',
  autor: 'Douglas Novato',
  github: 'https://github.com/douglasabnovato/components',
  perfil: 'https://github.com/douglasabnovato',
}

export const projetos: Projeto[] = [
  {
    numero: 1,
    id: 'filho-1',
    nome: 'Flix',
    pastaOriginal: 'alura-flix',
    creditoIdeia:
      'Ideia: desafio AluraFlix (Alura). Implementação de referência: LeoFlix, de Leonardo de Sant Ana. Código, marca e visual novos.',
    titulo: 'Seu catálogo de vídeos do YouTube, organizado por categoria.',
    resumo:
      'Cole o link, escolha a categoria e pronto: capa, player e destaque se montam sozinhos. Tudo salvo no seu navegador.',
    recursos: [
      'Destaque automático por categoria e banner configurável',
      'Capa e player gerados pelo link do YouTube',
      'Cores de categoria com contraste WCAG calculado',
      'Excluir com desfazer, busca e backup em JSON',
    ],
    stack: ['TanStack Query', 'React Hook Form', 'Zod', 'React Router', 'Embla Carousel'],
    referencia: 'Carrossel com vizinhos à mostra e abas por categoria',
    tema: 'claro',
    acento: '#C8183F',
    sobreAcento: '#FFFFFF',
    acentoTexto: '#C8183F',
    fase: 1,
    status: 'publicado',
    href: enderecoDoProjeto(1),
  },
  {
    numero: 2,
    id: 'filho-2',
    nome: 'Cadastro',
    pastaOriginal: 'cadastro',
    creditoIdeia:
      'Evolução do projeto cadastro (Next.js + Firebase) para React com repositório trocável.',
    titulo: 'Clientes em memória ou na API, sem trocar a tela.',
    resumo:
      'Tabela e formulário dividem o mesmo espaço. A origem dos dados muda por um seletor, e as duas passam pela mesma bateria de testes.',
    recursos: [
      'Tabela e formulário na mesma tela',
      'Mesma validação no front e na API (contratos Zod)',
      'Repositório em memória ou via API (Hono + PGlite)',
      'Testes de contrato compartilhados',
    ],
    stack: ['TanStack Query', 'React Hook Form', 'Zod', 'Padrão Repository', 'Hono', 'SQL'],
    referencia: 'Seletor em pílula e cards com ilustração saindo da borda',
    tema: 'escuro',
    acento: '#3DDC97',
    sobreAcento: '#0B0C10',
    acentoTexto: '#3DDC97',
    fase: 4,
    status: 'publicado',
    href: enderecoDoProjeto(2),
  },
  {
    numero: 3,
    id: 'filho-3',
    nome: 'Portal de Heróis',
    pastaOriginal: 'marvel',
    creditoIdeia:
      'Inspirado no projeto marvel; heróis, nomes, histórias e emblemas 100% originais.',
    titulo: 'Um universo de heróis originais para explorar.',
    resumo:
      '12 heróis inspirados em paisagens brasileiras, 3 equipes e 2 universos, com ilustrações em camadas e movimento que respeita quem prefere menos animação.',
    recursos: [
      'Catálogo com filtro por universo, equipe e busca',
      'Ficha completa e comparação frente a frente',
      'Menu acessível por teclado',
      'Animações com movimento reduzido',
    ],
    stack: ['Tailwind CSS', 'Motion', 'Design tokens'],
    referencia: 'Ilustração em tela cheia e chamada com linha de apoio',
    tema: 'escuro',
    acento: '#FFB020',
    sobreAcento: '#0B0C10',
    acentoTexto: '#FFB020',
    fase: 6,
    status: 'publicado',
    href: enderecoDoProjeto(3),
  },
  {
    numero: 4,
    id: 'filho-4',
    nome: 'Formulários no Servidor',
    pastaOriginal: 'node-ejs-forms',
    creditoIdeia:
      'Releitura do node-ejs-forms (Express + EJS, Rocketseat Discover) com React Router.',
    titulo: 'Formulários que funcionam até sem JavaScript.',
    resumo:
      'O servidor lê, valida e responde. No navegador, o JavaScript só melhora a experiência, nunca é requisito.',
    recursos: [
      'Loaders e actions do React Router',
      'Aprimoramento progressivo',
      'Erros exibidos ao lado do campo',
      'Testes de ponta a ponta com e sem JavaScript',
    ],
    stack: ['React Router (framework)', 'SSR', 'Zod', 'Playwright'],
    referencia: 'Editorial escuro com título serifado e seletor de modo',
    tema: 'escuro',
    acento: '#8FB3FF',
    sobreAcento: '#0B0C10',
    acentoTexto: '#8FB3FF',
    fase: 7,
    status: 'publicado',
    href: enderecoDoProjeto(4),
  },
  {
    numero: 5,
    id: 'filho-5',
    nome: 'Tarefas',
    pastaOriginal: 'todo-app',
    creditoIdeia:
      'Evolução do todo-app (Express + MongoDB + Redux, curso da Cod3r) com Redux Toolkit e banco SQL.',
    titulo: 'Tarefas com atalhos de teclado e busca por padrão.',
    resumo:
      'Enter cria, Esc cancela, a busca aceita expressão regular e só sai da lista o que já foi concluído.',
    recursos: [
      'Atalhos: Enter, Shift+Enter e Esc',
      'Busca por expressão regular com destaque',
      'Exclusão apenas de tarefas concluídas',
      'Conclusão otimista com RTK Query',
    ],
    stack: ['Redux Toolkit', 'RTK Query', 'Hono', 'SQL'],
    referencia: 'Formulário sobreposto ao topo e cards com etiqueta',
    tema: 'claro',
    acento: '#0E7490',
    sobreAcento: '#FFFFFF',
    acentoTexto: '#0E7490',
    fase: 5,
    status: 'publicado',
    href: enderecoDoProjeto(5),
  },
  {
    numero: 6,
    id: 'filho-6',
    nome: 'Lista da Pelada',
    pastaOriginal: 'to-do-list',
    creditoIdeia:
      'Evolução do to-do-list (lista da pelada, trilha Especializar da Rocketseat) com hooks puros.',
    titulo: 'Confirmou, entrou na lista. Os times saem no sorteio.',
    resumo:
      'Cada jogo tem limite de vagas, lista de espera que anda sozinha e um organizador identificado pelo perfil do GitHub.',
    recursos: [
      'Confirmação com limite de vagas e lista de espera',
      'Sorteio de times equilibrado por nível',
      'Organizador pelo perfil do GitHub',
      'Lista pronta para colar no grupo',
    ],
    stack: ['React hooks', 'useReducer', 'useLocalStorage', 'API do GitHub'],
    referencia: 'Cards de evento com faixa de status e setas',
    tema: 'escuro',
    acento: '#8B7BFF',
    sobreAcento: '#0B0C10',
    acentoTexto: '#A99DFF',
    fase: 3,
    status: 'publicado',
    href: enderecoDoProjeto(6),
  },
  {
    numero: 7,
    id: 'filho-7',
    nome: 'Laboratório',
    pastaOriginal: 'components',
    creditoIdeia:
      'Reorganização do projeto components (React Fundamentals, Hooks, React Docs, Jogo da Velha) em lições com demo, código e teste.',
    titulo: 'Lições de React em três tempos: desafio, conteúdo e solução.',
    resumo:
      'Cada lição começa por um problema real, explica o conceito e termina com a solução rodando ao lado do código.',
    recursos: [
      '17 lições em MDX, dos fundamentos ao React 19',
      'Demo, código e teste lado a lado',
      'Aba Assista ligada à Trilha React',
      'Progresso por lição e abas na URL',
    ],
    stack: ['MDX', 'React Router', 'Vitest'],
    referencia: 'Índice em megamenu, abas segmentadas e bloco editorial',
    tema: 'escuro',
    acento: '#C4F042',
    sobreAcento: '#0B0C10',
    acentoTexto: '#C4F042',
    fase: 8,
    status: 'publicado',
    href: enderecoDoProjeto(7),
  },
  {
    numero: 8,
    id: 'filho-8',
    nome: 'Trilha React',
    pastaOriginal: 'novo',
    creditoIdeia:
      'Curadoria própria de 116 vídeos públicos do YouTube; os vídeos pertencem a cada canal e são exibidos pelo player oficial.',
    titulo: 'Do zero ao fullstack, um vídeo de cada vez.',
    resumo:
      '116 aprendizados em 12 módulos, com progresso, anotações e o mapa das 93 tecnologias ligado aos projetos do hub.',
    recursos: [
      'Continuar de onde parou',
      'Filtros guardados na URL',
      'Anotações por aprendizado',
      'Stack com a lacuna da trilha e onde praticar',
    ],
    stack: ['React Router', 'URL state', 'useSyncExternalStore', 'Zod'],
    referencia: 'Mapa de módulos com duração e progresso',
    tema: 'escuro',
    acento: '#FF8A3D',
    sobreAcento: '#0B0C10',
    acentoTexto: '#FF8A3D',
    fase: 2,
    status: 'publicado',
    href: enderecoDoProjeto(8),
  },
]

/* Devolve o projeto pelo número (1 a 8); lança erro se não existir. */
export function projeto(numero: number): Projeto {
  const encontrado = projetos.find((p) => p.numero === numero)
  if (!encontrado) throw new Error(`Projeto ${numero} não existe`)
  return encontrado
}

/* Formata o número com dois dígitos: 1 → "01". */
export function doisDigitos(numero: number) {
  return String(numero).padStart(2, '0')
}
/* Fim dos dados do hub. */
