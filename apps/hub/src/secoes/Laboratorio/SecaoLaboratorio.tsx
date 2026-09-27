/*
 * Seção 07 · Laboratório. Referência: índice de lições em formato de
 * megamenu (ícone, título, descrição), abas segmentadas Desafio / Conteúdo /
 * Solução e bloco dividido entre código e demonstração ao vivo. As lições
 * (texto MDX, demo e código) vêm do próprio projeto 07.
 */
import { AbasSegmentadas } from '@components/ui'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import {
  AbaContexto,
  Conteudo,
  Desafio,
  licoes as todas,
  Solucao,
  type Aba,
  type Licao,
} from '@components/laboratorio/dados'
import styles from './SecaoLaboratorio.module.css'

const EM_DESTAQUE = [
  'use-state',
  'use-effect',
  'use-context',
  'use-reducer',
  'use-memo',
  'jogo-da-velha',
]
const licoes = EM_DESTAQUE.map((id) => todas.find((l) => l.id === id)!)
const componentesMdx = { Desafio, Conteudo, Solucao }

/* Texto MDX da lição mostrando só a seção da aba. */
function Texto({ licao, aba }: { licao: Licao; aba: Aba }) {
  const { Texto: Mdx } = licao
  return (
    <AbaContexto.Provider value={aba}>
      <Mdx components={componentesMdx} />
    </AbaContexto.Provider>
  )
}

/* Controla a lição escolhida no índice e mostra suas três etapas. */
export function SecaoLaboratorio() {
  const p = projeto(7)
  const [ativaId, setAtivaId] = useState(licoes[0]?.id)
  const ativa = licoes.find((l) => l.id === ativaId) ?? licoes[0]
  const Demo = ativa?.Demo

  return (
    <Secao projeto={p} className={styles.secao}>
      <CabecalhoSecao projeto={p} editorial />

      <div className={styles.bancada}>
        <nav aria-label="Lições do laboratório">
          <ul className={styles.indice}>
            {licoes.map((licao) => {
              return (
                <li key={licao.id}>
                  <button
                    type="button"
                    className={styles.licao}
                    aria-current={licao.id === ativa?.id ? 'true' : undefined}
                    onClick={() => setAtivaId(licao.id)}
                  >
                    <span className={styles.simbolo} aria-hidden="true">
                      {licao.simbolo}
                    </span>
                    <span className={styles.textos}>
                      <span className={styles.tituloLicao}>{licao.titulo}</span>
                      <span className={styles.resumoLicao}>{licao.resumo}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {ativa && Demo ? (
          <div className={styles.painel}>
            <h3 className={styles.tituloAtiva}>Lição: {ativa.titulo}</h3>
            <AbasSegmentadas
              key={ativa.id}
              rotulo={`Etapas da lição ${ativa.titulo}`}
              abas={[
                {
                  id: 'desafio',
                  rotulo: '1 · Desafio',
                  conteudo: <Texto licao={ativa} aba="desafio" />,
                },
                {
                  id: 'conteudo',
                  rotulo: '2 · Conteúdo',
                  conteudo: <Texto licao={ativa} aba="conteudo" />,
                },
                {
                  id: 'solucao',
                  rotulo: '3 · Solução',
                  conteudo: (
                    <div className={styles.solucao}>
                      <pre className={styles.codigo}>
                        <code>{ativa.codigo}</code>
                      </pre>
                      <div className={styles.demo}>
                        <p className={styles.rotuloDemo}>Rodando ao vivo</p>
                        <Demo />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        ) : null}
      </div>

      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Laboratório. */
