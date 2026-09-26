/*
 * Fonte única de dados do hub: identidade do site e os 7 projetos filhos.
 * Seções, menu, índice e rodapé são gerados a partir daqui. Para publicar um
 * filho, basta trocar o status para 'publicado' e conferir o href.
 */

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
    creditoIdeia: 'Ideia do desafio AluraFlix (Alura); nome e visual próprios.',
    titulo: 'Seu catálogo de vídeos, organizado por categoria.',
    resumo:
      'Cadastre vídeos pela URL, agrupe por categoria e deixe o destaque do topo se montar sozinho.',
    recursos: [
      'Destaque automático por categoria',
      'Prévia do vídeo a partir da URL',
      'Cores de categoria com contraste verificado',
      'Painel de configuração com restauração',
    ],
    stack: ['TanStack Query', 'React Hook Form', 'Zod', 'Embla Carousel'],
    referencia: 'Carrossel com vizinhos à mostra e abas por categoria',
    tema: 'claro',
    acento: '#C8183F',
    sobreAcento: '#FFFFFF',
    acentoTexto: '#C8183F',
    fase: 4,
    status: 'em-construcao',
    href: '/flix/',
  },
  {
    numero: 2,
    id: 'filho-2',
    nome: 'Cadastro',
    pastaOriginal: 'cadastro',
    creditoIdeia: 'Evolução do projeto cadastro (Next.js) para React + repositório trocável.',
    titulo: 'Clientes em memória ou na API, sem trocar a tela.',
    resumo:
      'Tabela e formulário dividem o mesmo espaço. A origem dos dados muda por configuração, não por reescrita.',
    recursos: [
      'Tabela e formulário na mesma tela',
      'Validação com Zod',
      'Repositório em memória ou via API',
      'Testes de contrato compartilhados',
    ],
    stack: ['React Hook Form', 'Zod', 'Padrão Repository', 'API'],
    referencia: 'Seletor em pílula e cards com ilustração saindo da borda',
    tema: 'escuro',
    acento: '#3DDC97',
    sobreAcento: '#0B0C10',
    acentoTexto: '#3DDC97',
    fase: 2,
    status: 'em-construcao',
    href: '/cadastro/',
  },
  {
    numero: 3,
    id: 'filho-3',
    nome: 'Portal de Heróis',
    pastaOriginal: 'marvel',
    creditoIdeia: 'Inspirado no projeto marvel; heróis, nomes e artes 100% originais.',
    titulo: 'Um universo de heróis originais para explorar.',
    resumo:
      'Fichas, equipes e universos próprios, com ilustrações em camadas e movimento que respeita quem prefere menos animação.',
    recursos: [
      'Catálogo com filtro por universo e equipe',
      'Ficha completa de cada herói',
      'Menu acessível por teclado',
      'Animações com movimento reduzido',
    ],
    stack: ['Tailwind CSS', 'Motion', 'Design tokens'],
    referencia: 'Ilustração em tela cheia e chamada com linha de apoio',
    tema: 'escuro',
    acento: '#FFB020',
    sobreAcento: '#0B0C10',
    acentoTexto: '#FFB020',
    fase: 5,
    status: 'em-construcao',
    href: '/herois/',
  },
  {
    numero: 4,
    id: 'filho-4',
    nome: 'Formulários no Servidor',
    pastaOriginal: 'node-ejs-forms',
    creditoIdeia: 'Releitura do node-ejs-forms (Express + EJS) com React Router.',
    titulo: 'Formulários que funcionam até sem JavaScript.',
    resumo:
      'O servidor lê, valida e responde. No navegador, o JavaScript só melhora a experiência, nunca é requisito.',
    recursos: [
      'Loaders e actions do React Router',
      'Aprimoramento progressivo',
      'Erros exibidos ao lado do campo',
      'Páginas Início, Sobre e Contato',
    ],
    stack: ['React Router (framework)', 'SSR', 'Zod'],
    referencia: 'Editorial escuro com título serifado e seletor de modo',
    tema: 'escuro',
    acento: '#8FB3FF',
    sobreAcento: '#0B0C10',
    acentoTexto: '#8FB3FF',
    fase: 6,
    status: 'em-construcao',
    href: '/formularios/',
  },
  {
    numero: 5,
    id: 'filho-5',
    nome: 'Tarefas',
    pastaOriginal: 'todo-app',
    creditoIdeia: 'Evolução do todo-app (front + back) com Redux Toolkit e banco SQL.',
    titulo: 'Tarefas com atalhos de teclado e busca por padrão.',
    resumo:
      'Enter cria, Esc cancela, a busca aceita expressão regular e só sai da lista o que já foi concluído.',
    recursos: [
      'Atalhos: Enter, Shift+Enter e Esc',
      'Busca por expressão regular',
      'Exclusão apenas de tarefas concluídas',
      'API com banco SQL e RTK Query',
    ],
    stack: ['Redux Toolkit', 'RTK Query', 'API', 'SQL'],
    referencia: 'Formulário sobreposto ao topo e cards com etiqueta',
    tema: 'claro',
    acento: '#0E7490',
    sobreAcento: '#FFFFFF',
    acentoTexto: '#0E7490',
    fase: 3,
    status: 'em-construcao',
    href: '/tarefas/',
  },
  {
    numero: 6,
    id: 'filho-6',
    nome: 'Lista da Pelada',
    pastaOriginal: 'to-do-list',
    creditoIdeia: 'Evolução do to-do-list (lista da pelada) com hooks puros.',
    titulo: 'Confirmou, entrou na lista. Os times saem no sorteio.',
    resumo:
      'Cada jogo tem limite de vagas, lista de confirmados e um organizador identificado pelo perfil do GitHub.',
    recursos: [
      'Confirmação com limite de vagas',
      'Sorteio de times equilibrado',
      'Organizador pelo perfil do GitHub',
      'Tudo salvo no navegador',
    ],
    stack: ['React hooks', 'useReducer', 'useLocalStorage', 'API do GitHub'],
    referencia: 'Cards de evento com faixa de status e setas',
    tema: 'escuro',
    acento: '#8B7BFF',
    sobreAcento: '#0B0C10',
    acentoTexto: '#A99DFF',
    fase: 1,
    status: 'em-construcao',
    href: '/pelada/',
  },
  {
    numero: 7,
    id: 'filho-7',
    nome: 'Laboratório',
    pastaOriginal: 'components',
    creditoIdeia: 'Reorganização do projeto components em lições com demo, código e teste.',
    titulo: 'Lições de React em três tempos: desafio, conteúdo e solução.',
    resumo:
      'Cada lição começa por um problema real, explica o conceito e termina com a solução rodando ao lado do código.',
    recursos: [
      'Lições em MDX',
      'Demo, código e teste lado a lado',
      'Progresso por lição',
      'Navegação por parâmetros da URL',
    ],
    stack: ['MDX', 'React Router', 'Vitest'],
    referencia: 'Índice em megamenu, abas segmentadas e bloco editorial',
    tema: 'escuro',
    acento: '#C4F042',
    sobreAcento: '#0B0C10',
    acentoTexto: '#C4F042',
    fase: 7,
    status: 'em-construcao',
    href: '/laboratorio/',
  },
]

/* Devolve o projeto pelo número (1 a 7); lança erro se não existir. */
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
