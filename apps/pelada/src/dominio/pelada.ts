/*
 * Regras de negócio da Pelada como funções puras (P1 a P7). Nenhuma função
 * altera o jogo recebido: todas devolvem um jogo novo ou um erro explicado.
 */
import { NIVEIS, type Jogador, type Jogo, type NovoJogo, type Resultado } from './tipos'

export type Situacao = 'aberto' | 'lotado' | 'encerrado'

/* Remove acentos, espaços extras e caixa para comparar nomes (P1). */
export function normalizarNome(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/* Converte "2026-10-03T09:00" em Date no fuso local. */
export function dataDoJogo(jogo: Pick<Jogo, 'data'>) {
  return new Date(jogo.data)
}

/* Situação derivada: encerrado (passou), lotado (vagas cheias) ou aberto. */
export function situacaoDoJogo(jogo: Jogo, agora: Date): Situacao {
  if (dataDoJogo(jogo) < agora) return 'encerrado'
  return jogo.confirmados.length >= jogo.vagas ? 'lotado' : 'aberto'
}

/* Cria um jogo vazio a partir dos dados já validados do formulário. */
export function criarJogo(dados: NovoJogo, id: string): Jogo {
  return { ...dados, id, confirmados: [], espera: [], sorteio: null }
}

/* Valida a data do novo jogo: precisa ser no futuro. */
export function validarDataFutura(data: string, agora: Date): string | null {
  return new Date(data) > agora ? null : 'Escolha uma data no futuro.'
}

/*
 * Confirma presença (P1, P2, P7): nome de 2 a 40 letras, sem repetir no jogo;
 * entra nos confirmados se houver vaga, senão na espera. Limpa o sorteio.
 */
export function confirmar(
  jogo: Jogo,
  dados: { nome: string; nivel: number },
  id: string,
  agora: Date,
): Resultado<{ jogo: Jogo; destino: 'confirmados' | 'espera' }> {
  const nome = dados.nome.replace(/\s+/g, ' ').trim()
  if (situacaoDoJogo(jogo, agora) === 'encerrado')
    return { ok: false, erro: 'Este jogo já aconteceu.' }
  if (nome.length < 2 || nome.length > 40)
    return { ok: false, erro: 'Informe um nome entre 2 e 40 letras.' }
  const chave = normalizarNome(nome)
  const todos = [...jogo.confirmados, ...jogo.espera]
  if (todos.some((j) => normalizarNome(j.nome) === chave))
    return { ok: false, erro: `${nome} já está na lista deste jogo.` }

  const jogador: Jogador = { id, nome, nivel: dados.nivel, confirmadoEm: agora.toISOString() }
  const temVaga = jogo.confirmados.length < jogo.vagas
  const novo: Jogo = temVaga
    ? { ...jogo, confirmados: [...jogo.confirmados, jogador], sorteio: null }
    : { ...jogo, espera: [...jogo.espera, jogador], sorteio: null }
  return { ok: true, valor: { jogo: novo, destino: temVaga ? 'confirmados' : 'espera' } }
}

/*
 * Retira um jogador (P3, P4, P7). Se ele estava confirmado, o primeiro da
 * espera sobe para a vaga. Limpa o sorteio.
 */
export function desistir(jogo: Jogo, jogadorId: string): { jogo: Jogo; promovido: Jogador | null } {
  const estavaConfirmado = jogo.confirmados.some((j) => j.id === jogadorId)
  if (!estavaConfirmado) {
    return {
      jogo: { ...jogo, espera: jogo.espera.filter((j) => j.id !== jogadorId), sorteio: null },
      promovido: null,
    }
  }
  const confirmados = jogo.confirmados.filter((j) => j.id !== jogadorId)
  const [promovido, ...espera] = jogo.espera
  return {
    jogo: {
      ...jogo,
      confirmados: promovido ? [...confirmados, promovido] : confirmados,
      espera,
      sorteio: null,
    },
    promovido: promovido ?? null,
  }
}

/* Rótulo do nível: "3 · Bom". */
export function rotuloNivel(nivel: number) {
  return `${nivel} · ${NIVEIS.find((n) => n.valor === nivel)?.rotulo ?? ''}`
}

/* Soma dos níveis de um grupo de jogadores. */
export function forcaDoTime(jogadores: Jogador[]) {
  return jogadores.reduce((soma, j) => soma + j.nivel, 0)
}

/*
 * Sorteio equilibrado (P5): forma quantos times completos couberem (mínimo 2),
 * na ordem de confirmação; quem sobra fica de reserva. Embaralha, ordena por
 * nível e distribui em "serpente" (A, B, C, C, B, A…), o que mantém as forças
 * próximas. O aleatório é injetável para testes previsíveis.
 */
export function sortearTimes(
  jogo: Jogo,
  agora: Date,
  aleatorio: () => number = Math.random,
): Resultado<Jogo> {
  const quantidade = Math.floor(jogo.confirmados.length / jogo.porTime)
  if (quantidade < 2) {
    const faltam = jogo.porTime * 2 - jogo.confirmados.length
    return {
      ok: false,
      erro: `Faltam ${faltam} ${faltam === 1 ? 'jogador' : 'jogadores'} para formar 2 times de ${jogo.porTime}.`,
    }
  }
  const jogando = jogo.confirmados.slice(0, quantidade * jogo.porTime)
  const reservas = jogo.confirmados.slice(quantidade * jogo.porTime)

  const embaralhados = [...jogando]
  for (let i = embaralhados.length - 1; i > 0; i--) {
    const k = Math.floor(aleatorio() * (i + 1))
    ;[embaralhados[i], embaralhados[k]] = [embaralhados[k]!, embaralhados[i]!]
  }
  embaralhados.sort((a, b) => b.nivel - a.nivel)

  const times: string[][] = Array.from({ length: quantidade }, () => [])
  embaralhados.forEach((jogador, indice) => {
    const rodada = Math.floor(indice / quantidade)
    const posicao = indice % quantidade
    const time = rodada % 2 === 0 ? posicao : quantidade - 1 - posicao
    times[time]!.push(jogador.id)
  })

  return {
    ok: true,
    valor: {
      ...jogo,
      sorteio: { times, reservas: reservas.map((j) => j.id), feitoEm: agora.toISOString() },
    },
  }
}

/* Converte o sorteio salvo (ids) em jogadores, para exibir. */
export function timesDoSorteio(jogo: Jogo) {
  if (!jogo.sorteio) return null
  const porId = new Map(jogo.confirmados.map((j) => [j.id, j]))
  const buscar = (ids: string[]) => ids.map((id) => porId.get(id)).filter((j): j is Jogador => !!j)
  return {
    times: jogo.sorteio.times.map(buscar),
    reservas: buscar(jogo.sorteio.reservas),
  }
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/* Formata a data do jogo como "Sáb, 03 out · 9h" ou "Qua, 14 out · 20h30". */
export function formatarData(data: string) {
  const d = new Date(data)
  const minutos = d.getMinutes()
  const hora = minutos ? `${d.getHours()}h${String(minutos).padStart(2, '0')}` : `${d.getHours()}h`
  return `${DIAS[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} · ${hora}`
}

/* Texto pronto para colar no grupo (P6). */
export function textoParaCompartilhar(jogo: Jogo) {
  const linhas = [
    `⚽ ${jogo.titulo}`,
    `📅 ${formatarData(jogo.data)}`,
    `📍 ${jogo.local}`,
    '',
    `Confirmados (${jogo.confirmados.length}/${jogo.vagas}):`,
    ...jogo.confirmados.map((j, i) => `${i + 1}. ${j.nome}`),
  ]
  if (jogo.confirmados.length < jogo.vagas) {
    linhas.push(`Vagas abertas: ${jogo.vagas - jogo.confirmados.length}`)
  }
  if (jogo.espera.length) {
    linhas.push('', 'Lista de espera:', ...jogo.espera.map((j, i) => `${i + 1}. ${j.nome}`))
  }
  return linhas.join('\n')
}
/* Fim das regras da Pelada. */
