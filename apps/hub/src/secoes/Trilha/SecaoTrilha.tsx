/*
 * Seção 08 · Trilha React. Referência: mapa de módulos com duração e
 * progresso. Os números e os módulos vêm do próprio projeto 08 (dados
 * reais); cada módulo abre a lista dos seus aprendizados.
 */
import {
  aprendizados,
  aprendizadosDoModulo,
  contarStack,
  formatarMinutos,
  modulos,
  resumir,
} from '@components/trilha/dados'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoTrilha.module.css'

const nenhum = new Set<number>()

/* Monta os números, o mapa de módulos e a lista do módulo aberto. */
export function SecaoTrilha() {
  const p = projeto(8)
  const [aberto, setAberto] = useState<number | null>(null)
  const geral = resumir(aprendizados, nenhum)
  const stack = contarStack()

  const numeros = [
    { valor: String(geral.total), rotulo: 'aprendizados' },
    { valor: String(modulos.length), rotulo: 'módulos' },
    { valor: formatarMinutos(geral.minutos), rotulo: 'de vídeo' },
    { valor: String(stack.total), rotulo: 'tecnologias mapeadas' },
  ]

  return (
    <Secao projeto={p}>
      <CabecalhoSecao projeto={p} />
      <dl className={styles.numeros}>
        {numeros.map((n) => (
          <div key={n.rotulo}>
            <dt>{n.rotulo}</dt>
            <dd>{n.valor}</dd>
          </div>
        ))}
      </dl>
      <ol className={styles.mapa} aria-label="Módulos da trilha">
        {modulos.map((m) => {
          const lista = aprendizadosDoModulo(m.numero)
          const resumo = resumir(lista, nenhum)
          const idLista = `trilha-modulo-${m.numero}`
          const estaAberto = aberto === m.numero
          return (
            <li key={m.numero} className={styles.modulo} data-aberto={estaAberto}>
              <button
                type="button"
                className={styles.botao}
                aria-expanded={estaAberto}
                aria-controls={idLista}
                onClick={() => setAberto(estaAberto ? null : m.numero)}
              >
                <span className={styles.numero}>{String(m.numero).padStart(2, '0')}</span>
                <span className={styles.titulo}>{m.titulo}</span>
                <span className={styles.meta}>
                  {resumo.total} vídeos · {formatarMinutos(resumo.minutos)}
                </span>
              </button>
              <ol id={idLista} className={styles.lista} hidden={!estaAberto}>
                {lista.map((a) => (
                  <li key={a.numero}>
                    <a href={`${p.href}aprendizado/${a.numero}`}>
                      {a.numero}. {a.titulo}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          )
        })}
      </ol>
      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Trilha React. */
