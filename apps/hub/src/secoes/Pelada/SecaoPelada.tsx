/*
 * Seção 06 · Lista da Pelada. Referência: carrossel de cards de evento com
 * data, local e categoria e uma faixa de status no rodapé. Dá para confirmar
 * presença em cada jogo, respeitando o limite de vagas.
 */
import { CardEvento, Carrossel } from '@components/ui'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoPelada.module.css'

type Jogo = {
  id: string
  titulo: string
  data: string
  dataIso: string
  local: string
  categoria: string
  confirmados: number
  vagas: number
  organizador: string
}

const iniciais: Jogo[] = [
  {
    id: 'qui',
    titulo: 'Pelada de quinta',
    data: 'Qui, 01 out · 19h',
    dataIso: '2026-10-01T19:00',
    local: 'Quadra do bairro',
    categoria: 'Society',
    confirmados: 10,
    vagas: 14,
    organizador: 'org-quinta',
  },
  {
    id: 'sab',
    titulo: 'Rachão de sábado',
    data: 'Sáb, 03 out · 9h',
    dataIso: '2026-10-03T09:00',
    local: 'Campo municipal',
    categoria: 'Campo',
    confirmados: 21,
    vagas: 22,
    organizador: 'org-sabado',
  },
  {
    id: 'fut',
    titulo: 'Futsal da firma',
    data: 'Ter, 06 out · 20h',
    dataIso: '2026-10-06T20:00',
    local: 'Ginásio central',
    categoria: 'Futsal',
    confirmados: 10,
    vagas: 10,
    organizador: 'org-firma',
  },
  {
    id: 'dom',
    titulo: 'Domingo em família',
    data: 'Dom, 11 out · 10h',
    dataIso: '2026-10-11T10:00',
    local: 'Parque da cidade',
    categoria: 'Areia',
    confirmados: 6,
    vagas: 12,
    organizador: 'org-domingo',
  },
  {
    id: 'nit',
    titulo: 'Noturno dos veteranos',
    data: 'Qua, 14 out · 21h',
    dataIso: '2026-10-14T21:00',
    local: 'Arena coberta',
    categoria: 'Society',
    confirmados: 3,
    vagas: 14,
    organizador: 'org-veteranos',
  },
]

/* Controla as confirmações e monta o carrossel de jogos. */
export function SecaoPelada() {
  const p = projeto(6)
  const [jogos, setJogos] = useState(iniciais)
  const [meus, setMeus] = useState<Set<string>>(new Set())
  const [aviso, setAviso] = useState('')

  /* Confirma ou retira a presença, sem passar do limite de vagas. */
  function alternar(jogo: Jogo) {
    const estou = meus.has(jogo.id)
    if (!estou && jogo.confirmados >= jogo.vagas) return
    setJogos((atual) =>
      atual.map((j) =>
        j.id === jogo.id ? { ...j, confirmados: j.confirmados + (estou ? -1 : 1) } : j,
      ),
    )
    setMeus((atual) => {
      const novo = new Set(atual)
      if (estou) novo.delete(jogo.id)
      else novo.add(jogo.id)
      return novo
    })
    setAviso(
      estou ? `Presença retirada de ${jogo.titulo}.` : `Presença confirmada em ${jogo.titulo}.`,
    )
  }

  const cards = jogos.map((j) => {
    const estou = meus.has(j.id)
    const lotado = j.confirmados >= j.vagas && !estou
    return (
      <CardEvento
        key={j.id}
        titulo={j.titulo}
        data={j.data}
        dataIso={j.dataIso}
        local={j.local}
        categoria={j.categoria}
        status={{ atual: j.confirmados, total: j.vagas, rotulo: 'confirmados' }}
      >
        <p className={styles.organizador}>
          Organizado por <span>@{j.organizador}</span>
        </p>
        <button
          type="button"
          className={styles.confirmar}
          aria-pressed={estou}
          aria-disabled={lotado}
          onClick={() => alternar(j)}
        >
          {estou ? 'Desconfirmar' : lotado ? 'Lista cheia' : 'Confirmar presença'}{' '}
          <span className="visualmente-oculto">em {j.titulo}</span>
        </button>
      </CardEvento>
    )
  })

  return (
    <Secao projeto={p} className={styles.secao}>
      <CabecalhoSecao projeto={p} />
      <p className="visualmente-oculto" role="status">
        {aviso}
      </p>
      <Carrossel rotulo="Próximos jogos" variante="trilho" itens={cards} paginacao={false} />
      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Lista da Pelada. */
