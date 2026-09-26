/*
 * Seção 07 · Laboratório. Referência: índice de lições em formato de
 * megamenu (ícone, título, descrição), abas segmentadas Desafio / Conteúdo /
 * Solução e bloco dividido entre código e demonstração ao vivo.
 */
import { AbasSegmentadas } from '@components/ui'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import { licoes } from './licoes'
import styles from './SecaoLaboratorio.module.css'

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
              const disponivel = Boolean(licao.Demo)
              return (
                <li key={licao.id}>
                  <button
                    type="button"
                    className={styles.licao}
                    aria-current={licao.id === ativa?.id ? 'true' : undefined}
                    disabled={!disponivel}
                    onClick={() => setAtivaId(licao.id)}
                  >
                    <span className={styles.simbolo} aria-hidden="true">
                      {licao.simbolo}
                    </span>
                    <span className={styles.textos}>
                      <span className={styles.tituloLicao}>
                        {licao.titulo}
                        {!disponivel ? <span className={styles.breve}>Em breve</span> : null}
                      </span>
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
                  conteudo: <p className={styles.texto}>{ativa.desafio}</p>,
                },
                {
                  id: 'conteudo',
                  rotulo: '2 · Conteúdo',
                  conteudo: <p className={styles.texto}>{ativa.conteudo}</p>,
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
