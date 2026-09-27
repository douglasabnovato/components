/*
 * Jogos iniciais da Pelada, com datas relativas ao dia de hoje para a lista
 * nunca começar vencida. Nomes e níveis são fictícios.
 */
import type { EstadoPelada, Jogador, Jogo } from './tipos'

const NOMES = [
  'Ana Luiza',
  'Bruno',
  'Caio',
  'Carla',
  'Diego',
  'Duda',
  'Edu',
  'Fábio',
  'Gabi',
  'Heitor',
  'Igor',
  'Ju',
  'Kaique',
  'Léo',
  'Lia',
  'Marcos',
  'Nando',
  'Olga',
  'Paulo',
  'Rafa',
  'Sandro',
  'Téo',
  'Vini',
  'Wesley',
  'Xande',
  'Yuri',
  'Zeca',
  'Beto',
  'Dani',
  'Gui',
]

const NIVEIS = [
  3, 4, 2, 5, 3, 1, 4, 2, 3, 5, 2, 4, 3, 1, 5, 3, 2, 4, 3, 2, 5, 1, 3, 4, 2, 3, 4, 2, 3, 5,
]

/* Monta "AAAA-MM-DDTHH:mm" daqui a alguns dias, no horário informado. */
export function dataRelativa(agora: Date, dias: number, hora: number, minuto = 0) {
  const d = new Date(agora)
  d.setDate(d.getDate() + dias)
  d.setHours(hora, minuto, 0, 0)
  const dois = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}T${dois(hora)}:${dois(minuto)}`
}

/* Gera jogadores a partir de um deslocamento na lista de nomes. */
function jogadores(inicio: number, quantidade: number, prefixo: string, agora: Date): Jogador[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const k = (inicio + i) % NOMES.length
    return {
      id: `${prefixo}-${i + 1}`,
      nome: NOMES[k]!,
      nivel: NIVEIS[k]!,
      confirmadoEm: new Date(agora.getTime() - (quantidade - i) * 60_000).toISOString(),
    }
  })
}

/* Três jogos: um com vagas, um quase cheio e um lotado com espera. */
export function jogosIniciais(agora: Date = new Date()): Jogo[] {
  const futsal = jogadores(20, 12, 'fut', agora)
  return [
    {
      id: 'society-amigos',
      titulo: 'Society dos amigos',
      modalidade: 'Society',
      data: dataRelativa(agora, 2, 19),
      local: 'Quadra do bairro',
      vagas: 14,
      porTime: 7,
      confirmados: jogadores(0, 10, 'soc', agora),
      espera: [],
      sorteio: null,
    },
    {
      id: 'rachao-fim-de-semana',
      titulo: 'Rachão do fim de semana',
      modalidade: 'Campo',
      data: dataRelativa(agora, 4, 9),
      local: 'Campo municipal',
      vagas: 22,
      porTime: 11,
      confirmados: jogadores(5, 21, 'cam', agora),
      espera: [],
      sorteio: null,
    },
    {
      id: 'futsal-firma',
      titulo: 'Futsal da firma',
      modalidade: 'Futsal',
      data: dataRelativa(agora, 7, 20, 30),
      local: 'Ginásio central',
      vagas: 10,
      porTime: 5,
      confirmados: futsal.slice(0, 10),
      espera: futsal.slice(10),
      sorteio: null,
    },
  ]
}

/* Estado inicial completo: jogos de exemplo e o organizador padrão. */
export function estadoInicial(agora: Date = new Date()): EstadoPelada {
  return { versao: 1, organizador: 'douglasabnovato', jogos: jogosIniciais(agora) }
}
/* Fim dos jogos iniciais. */
