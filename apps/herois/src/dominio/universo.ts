/*
 * O universo original do Portal: 2 universos, 3 equipes e 12 heróis criados
 * para o projeto, inspirados em paisagens e cidades brasileiras. Nenhum
 * personagem, nome ou marca de terceiros.
 */
import type { Equipe, Heroi, Universo } from './tipos'

export const universos: Universo[] = [
  {
    slug: 'terra-firme',
    nome: 'Terra Firme',
    descricao:
      'Mangues, chapadas e rios largos. Aqui os heróis tiram força da paisagem e protegem quem vive dela.',
  },
  {
    slug: 'cidade-circuito',
    nome: 'Cidade Circuito',
    descricao:
      'Uma metrópole vertical onde tudo é conectado. Os heróis daqui lutam para que a tecnologia sirva às pessoas.',
  },
]

export const equipes: Equipe[] = [
  {
    slug: 'guardioes-do-mangue',
    nome: 'Guardiões do Mangue',
    universo: 'terra-firme',
    lema: 'Onde a maré encontra a raiz, ninguém fica para trás.',
    cor: '#2BB3C0',
  },
  {
    slug: 'liga-do-cerrado',
    nome: 'Liga do Cerrado',
    universo: 'terra-firme',
    lema: 'Casca grossa por fora, flor por dentro.',
    cor: '#E8A33D',
  },
  {
    slug: 'coletivo-circuito',
    nome: 'Coletivo Circuito',
    universo: 'cidade-circuito',
    lema: 'Toda rede é feita de nós.',
    cor: '#8B7BFF',
  },
]

export const herois: Heroi[] = [
  {
    slug: 'mare-alta',
    nome: 'Maré Alta',
    identidade: 'Iara Lopes',
    cidade: 'Vila do Estuário',
    equipe: 'guardioes-do-mangue',
    emblema: 'onda',
    cor: '#2BB3C0',
    resumo: 'Conduz correntes de água como quem rege uma orquestra.',
    historia:
      'Filha de marisqueiras, Iara aprendeu a ler a maré antes de aprender a ler livros. Numa enchente, descobriu que a água a escutava. Hoje lidera os Guardiões e treina a vila para agir junto quando o mar sobe.',
    poderes: ['Controle de correntes', 'Respiração submersa', 'Leitura das marés'],
    atributos: { forca: 6, agilidade: 7, mente: 8, resistencia: 7 },
  },
  {
    slug: 'raiz',
    nome: 'Raiz',
    identidade: 'Tomé Caetano',
    cidade: 'Vila do Estuário',
    equipe: 'guardioes-do-mangue',
    emblema: 'raiz',
    cor: '#3DDC97',
    resumo: 'Faz o mangue crescer em minutos para segurar o que desaba.',
    historia:
      'Botânico que trocou o laboratório pelo lamaçal. Depois de anos replantando o mangue, as raízes passaram a responder ao seu toque. É o mais paciente da equipe e o último a desistir de uma árvore.',
    poderes: ['Crescimento acelerado de plantas', 'Barreiras de raízes', 'Sentir o solo'],
    atributos: { forca: 8, agilidade: 3, mente: 7, resistencia: 9 },
  },
  {
    slug: 'carranca',
    nome: 'Carranca',
    identidade: 'Zuleica Reis',
    cidade: 'Porto Velho do Rio',
    equipe: 'guardioes-do-mangue',
    emblema: 'escudo',
    cor: '#D9534F',
    resumo: 'Ergue escudos de energia na proa de qualquer barco.',
    historia:
      'Carpinteira naval, Zuleica esculpia figuras de proa para afastar o medo dos barqueiros. Um dia a madeira brilhou e o medo virou escudo. Protege as travessias e ensina os pequenos a nadar.',
    poderes: ['Escudos de energia', 'Intimidação protetora', 'Navegação noturna'],
    atributos: { forca: 7, agilidade: 5, mente: 6, resistencia: 10 },
  },
  {
    slug: 'neblina',
    nome: 'Neblina',
    identidade: 'Caio Sampaio',
    cidade: 'Serra do Orvalho',
    equipe: 'guardioes-do-mangue',
    emblema: 'nevoa',
    cor: '#A9AEBB',
    resumo: 'Some na névoa e aparece onde ninguém espera.',
    historia:
      'Guia de trilha na serra, Caio se perdeu numa madrugada fechada e voltou três dias depois, sem lembrar do caminho, mas capaz de virar névoa. É o batedor da equipe: vê antes, avisa antes.',
    poderes: ['Forma de névoa', 'Camuflagem', 'Percepção à distância'],
    atributos: { forca: 3, agilidade: 9, mente: 7, resistencia: 5 },
  },
  {
    slug: 'siriema',
    nome: 'Siriema',
    identidade: 'Lúcia Prado',
    cidade: 'Chapada Alta',
    equipe: 'liga-do-cerrado',
    emblema: 'pena',
    cor: '#E8A33D',
    resumo: 'Corre pelo cerrado mais rápido que o eco do próprio canto.',
    historia:
      'Atleta de fundo que treinava ao nascer do sol, Lúcia ouviu o canto de uma siriema e passou a correr no ritmo dele. Leva recados, remédios e gente para longe do fogo antes que ele chegue.',
    poderes: ['Supervelocidade', 'Salto longo', 'Grito de alerta'],
    atributos: { forca: 4, agilidade: 10, mente: 6, resistencia: 6 },
  },
  {
    slug: 'ipe',
    nome: 'Ipê',
    identidade: 'Benedito Rocha',
    cidade: 'Chapada Alta',
    equipe: 'liga-do-cerrado',
    emblema: 'flor',
    cor: '#F2C94C',
    resumo: 'Casca que não queima e flores que curam.',
    historia:
      'Benedito era brigadista voluntário. Preso num incêndio, abraçou um ipê e saiu dali com a casca da árvore sobre a pele. Na seca, floresce, e o pólen das suas flores acalma quem respira fumaça.',
    poderes: ['Pele de casca resistente ao fogo', 'Pólen curativo', 'Força de tronco'],
    atributos: { forca: 9, agilidade: 3, mente: 5, resistencia: 10 },
  },
  {
    slug: 'brasa-mansa',
    nome: 'Brasa Mansa',
    identidade: 'Joana Ferraz',
    cidade: 'Vale das Veredas',
    equipe: 'liga-do-cerrado',
    emblema: 'brasa',
    cor: '#FF7A45',
    resumo: 'Controla o calor: acende o fogão, apaga o incêndio.',
    historia:
      'Cozinheira de fogão a lenha, Joana sempre soube a temperatura certa de cada panela. Descobriu que também podia tirar o calor de um incêndio e guardá-lo. Usa o poder com cuidado, porque sabe o estrago que o fogo faz.',
    poderes: ['Absorção de calor', 'Chamas controladas', 'Resistência térmica'],
    atributos: { forca: 6, agilidade: 6, mente: 7, resistencia: 7 },
  },
  {
    slug: 'sereno',
    nome: 'Sereno',
    identidade: 'Gabriel Assis',
    cidade: 'Vale das Veredas',
    equipe: 'liga-do-cerrado',
    emblema: 'lua',
    cor: '#6B8CFF',
    resumo: 'Traz a calma da madrugada para qualquer confusão.',
    historia:
      'Professor de música, Gabriel toca viola nas noites de lua. Percebeu que as pessoas ao redor ficavam em paz quando ele tocava. Hoje é o mediador da Liga: resolve com conversa o que outros resolveriam com força.',
    poderes: ['Aura de calma', 'Visão noturna', 'Sono induzido'],
    atributos: { forca: 3, agilidade: 5, mente: 10, resistencia: 6 },
  },
  {
    slug: 'circuito',
    nome: 'Circuito',
    identidade: 'Helena Tanaka',
    cidade: 'Cidade Circuito',
    equipe: 'coletivo-circuito',
    emblema: 'circuito',
    cor: '#8B7BFF',
    resumo: 'Conversa com qualquer máquina, em qualquer linguagem.',
    historia:
      'Programadora de sistemas de trânsito, Helena levou um choque ao consertar um semáforo na chuva. Desde então, sente o fluxo de dados como quem sente o vento. Fundou o Coletivo para devolver a cidade às pessoas.',
    poderes: ['Interface com máquinas', 'Leitura de redes', 'Pulso que desliga aparelhos'],
    atributos: { forca: 3, agilidade: 6, mente: 10, resistencia: 5 },
  },
  {
    slug: 'eco',
    nome: 'Eco',
    identidade: 'Rafael Nunes',
    cidade: 'Cidade Circuito',
    equipe: 'coletivo-circuito',
    emblema: 'eco',
    cor: '#FF5C7A',
    resumo: 'Transforma som em força e silêncio em escudo.',
    historia:
      'Técnico de som de um teatro, Rafael ficou preso num ensaio durante um apagão e passou a enxergar pelo som. Mapeia prédios inteiros com um estalo de dedos e abafa explosões com um gesto.',
    poderes: ['Ecolocalização', 'Ondas de choque sonoras', 'Zona de silêncio'],
    atributos: { forca: 6, agilidade: 7, mente: 6, resistencia: 6 },
  },
  {
    slug: 'prisma',
    nome: 'Prisma',
    identidade: 'Aline Duarte',
    cidade: 'Cidade Circuito',
    equipe: 'coletivo-circuito',
    emblema: 'prisma',
    cor: '#C4F042',
    resumo: 'Dobra a luz para criar pontes, lentes e ilusões.',
    historia:
      'Fotógrafa de rua, Aline passava horas esperando a luz certa. Um vidro quebrado numa vitrine refletiu o sol direto nos seus olhos, e a luz começou a obedecer. Ilumina becos esquecidos e esconde quem precisa fugir.',
    poderes: ['Manipulação de luz', 'Ilusões', 'Pontes de luz sólida'],
    atributos: { forca: 4, agilidade: 7, mente: 8, resistencia: 5 },
  },
  {
    slug: 'bussola',
    nome: 'Bússola',
    identidade: 'Otávio Mendes',
    cidade: 'Cidade Circuito',
    equipe: 'coletivo-circuito',
    emblema: 'bussola',
    cor: '#FFD166',
    resumo: 'Sempre sabe para onde ir, e quem precisa de ajuda primeiro.',
    historia:
      'Carteiro por trinta anos, Otávio conhece cada rua da cidade. Um dia, passou a sentir o caminho mais curto até quem precisava dele. É o estrategista do Coletivo e o único que nunca usa GPS.',
    poderes: ['Senso de direção absoluto', 'Planejamento de rotas', 'Pressentimento de perigo'],
    atributos: { forca: 5, agilidade: 5, mente: 9, resistencia: 7 },
  },
]
/* Fim do universo. */
