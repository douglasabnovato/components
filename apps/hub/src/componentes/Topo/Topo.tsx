/*
 * Topo: abertura do hub. Título, dois botões em pílula, números do projeto
 * e um mosaico animado com os 8 filhos, que pode ser pausado (WCAG 2.2.2).
 */
import { BotaoPausa, BotaoPilula, useMovimentoReduzido } from '@components/ui'
import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import { doisDigitos, projetos, site } from '../../dados/projetos'
import styles from './Topo.module.css'

const numeros = [
  { valor: String(projetos.length), rotulo: 'projetos' },
  { valor: '1', rotulo: 'instalação' },
  { valor: '0', rotulo: 'código legado' },
]

/* Renderiza o texto de abertura e o mosaico com controle de pausa. */
export function Topo() {
  const reduzido = useMovimentoReduzido()
  const [pausadoManual, setPausadoManual] = useState(false)
  const pausado = pausadoManual || reduzido

  return (
    <section id="topo" className={styles.topo} aria-labelledby="topo-titulo">
      <div className={styles.fundo} aria-hidden="true" />
      <div className={styles.conteudo}>
        <motion.div
          className={styles.texto}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.rotulo}>Monorepo React · projeto 0</p>
          <h1 id="topo-titulo" className={styles.titulo}>
            Sete ideias antigas, <span className={styles.destaque}>reconstruídas</span> com React
            moderno.
          </h1>
          <p className={styles.resumo}>
            Um hub para apresentar cada projeto numa seção própria, com demonstração ao vivo, e uma
            trilha de 116 vídeos para estudar o que cada um deles usa.
          </p>
          <div className={styles.acoes}>
            <BotaoPilula href="#filho-1" tamanho="g">
              Explorar projetos
            </BotaoPilula>
            <BotaoPilula
              href={site.github}
              tamanho="g"
              variante="vazado"
              target="_blank"
              rel="noreferrer"
            >
              Ver no GitHub
            </BotaoPilula>
          </div>
          <dl className={styles.numeros}>
            {numeros.map((n) => (
              <div key={n.rotulo}>
                <dt>{n.rotulo}</dt>
                <dd>{n.valor}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className={styles.mosaicoArea}>
          <ul
            className={styles.mosaico}
            data-pausado={pausado}
            aria-label="Os oito projetos do hub"
          >
            {projetos.map((p, indice) => (
              <li
                key={p.id}
                className={styles.bloco}
                style={
                  {
                    '--cor': p.acento,
                    '--sobre': p.sobreAcento,
                    '--atraso': `${indice * -1.3}s`,
                  } as CSSProperties
                }
              >
                <a href={`#${p.id}`} className={styles.link}>
                  <span className={styles.numero}>{doisDigitos(p.numero)}</span>
                  <span className={styles.nome}>{p.nome}</span>
                </a>
              </li>
            ))}
          </ul>
          <BotaoPausa
            className={styles.pausa}
            pausado={pausado}
            aoAlternar={() => setPausadoManual((v) => !v)}
          />
        </div>
      </div>
    </section>
  )
}
/* Fim do Topo. */
