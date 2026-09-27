/*
 * Seção 06 · Lista da Pelada. Referência: carrossel de cards de evento com
 * data, local e categoria e uma faixa de status no rodapé. Os jogos e as
 * regras (vagas, lista de espera, promoção) vêm do próprio projeto 06.
 */
import { CardEvento, Carrossel } from '@components/ui'
import {
  confirmar,
  desistir,
  formatarData,
  jogosIniciais,
  type Jogo,
} from '@components/pelada/dados'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoPelada.module.css'

/* Controla as confirmações e monta o carrossel de jogos. */
export function SecaoPelada() {
  const p = projeto(6)
  const [jogos, setJogos] = useState(() => jogosIniciais(new Date()))
  const [meus, setMeus] = useState<Record<string, string>>({})
  const [aviso, setAviso] = useState('')

  /* Troca um jogo na lista. */
  function trocar(novo: Jogo) {
    setJogos((atual) => atual.map((j) => (j.id === novo.id ? novo : j)))
  }

  /* Confirma (ou entra na espera) e, se já estava, retira a presença. */
  function alternar(jogo: Jogo) {
    const meuId = meus[jogo.id]
    if (meuId) {
      const { jogo: novo, promovido } = desistir(jogo, meuId)
      trocar(novo)
      setMeus((atual) => {
        const novo = { ...atual }
        delete novo[jogo.id]
        return novo
      })
      setAviso(
        promovido
          ? `Presença retirada de ${jogo.titulo}. ${promovido.nome} subiu da espera.`
          : `Presença retirada de ${jogo.titulo}.`,
      )
      return
    }
    const id = `voce-${jogo.id}`
    const resultado = confirmar(jogo, { nome: 'Você', nivel: 3 }, id, new Date())
    if (!resultado.ok) {
      setAviso(resultado.erro)
      return
    }
    trocar(resultado.valor.jogo)
    setMeus((atual) => ({ ...atual, [jogo.id]: id }))
    setAviso(
      resultado.valor.destino === 'confirmados'
        ? `Presença confirmada em ${jogo.titulo}.`
        : `Lista cheia: você entrou na espera de ${jogo.titulo}.`,
    )
  }

  const cards = jogos.map((j) => {
    const estou = Boolean(meus[j.id])
    const cheio = j.confirmados.length >= j.vagas
    return (
      <CardEvento
        key={j.id}
        titulo={j.titulo}
        data={formatarData(j.data)}
        dataIso={j.data}
        local={j.local}
        categoria={j.modalidade}
        status={{ atual: j.confirmados.length, total: j.vagas, rotulo: 'confirmados' }}
      >
        <p className={styles.organizador}>
          {j.porTime} por time{j.espera.length ? ` · ${j.espera.length} na espera` : ''}
        </p>
        <button
          type="button"
          className={styles.confirmar}
          aria-pressed={estou}
          onClick={() => alternar(j)}
        >
          {estou ? 'Retirar presença' : cheio ? 'Entrar na espera' : 'Confirmar presença'}{' '}
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
