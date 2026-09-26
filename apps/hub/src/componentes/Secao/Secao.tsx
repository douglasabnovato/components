/*
 * Peças comuns das seções de projeto: a casca <section> com tema e acento,
 * o cabeçalho (rótulo, título e resumo), a lista de recursos com a stack
 * e a chamada para abrir o projeto filho.
 */
import { BotaoPilula } from '@components/ui'
import type { CSSProperties, ReactNode } from 'react'
import { doisDigitos, type Projeto } from '../../dados/projetos'
import { Revelar } from '../Revelar'
import styles from './Secao.module.css'

type SecaoProps = {
  projeto: Projeto
  children: ReactNode
  className?: string
  largura?: 'normal' | 'total'
}

/* Casca da seção: id de âncora, tema e variáveis de acento do projeto. */
export function Secao({ projeto, children, className, largura = 'normal' }: SecaoProps) {
  const estilo = {
    '--acento': projeto.acento,
    '--sobre-acento': projeto.sobreAcento,
    '--acento-texto': projeto.acentoTexto,
  } as CSSProperties
  return (
    <section
      id={projeto.id}
      aria-labelledby={`${projeto.id}-titulo`}
      data-tema={projeto.tema}
      className={[styles.secao, className].filter(Boolean).join(' ')}
      style={estilo}
    >
      <div className={largura === 'total' ? styles.total : styles.conteudo}>{children}</div>
    </section>
  )
}

type CabecalhoProps = {
  projeto: Projeto
  alinhamento?: 'esquerda' | 'centro'
  editorial?: boolean
  tamanho?: 'm' | 'g'
}

/* Rótulo "0N · Nome", título h2 e resumo do projeto. */
export function CabecalhoSecao({
  projeto,
  alinhamento = 'esquerda',
  editorial = false,
  tamanho = 'm',
}: CabecalhoProps) {
  return (
    <Revelar
      className={[
        styles.cabecalho,
        alinhamento === 'centro' ? styles.centro : '',
        editorial ? styles.editorial : '',
        tamanho === 'g' ? styles.grande : '',
      ].join(' ')}
    >
      <p className={styles.rotulo}>
        <span className={styles.numero}>{doisDigitos(projeto.numero)}</span>
        <span>{projeto.nome}</span>
      </p>
      <h2 id={`${projeto.id}-titulo`} className={styles.titulo}>
        {projeto.titulo}
      </h2>
      <p className={styles.resumo}>{projeto.resumo}</p>
    </Revelar>
  )
}

/* Lista de recursos com marcador e as tecnologias em etiquetas. */
export function RecursosProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <div className={styles.recursos}>
      <ul className={styles.lista}>
        {projeto.recursos.map((recurso, indice) => (
          <Revelar como="li" key={recurso} atraso={indice * 0.06} className={styles.recurso}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="var(--acento)" />
              <path
                d="m7 12.5 3.2 3.2L17 9"
                fill="none"
                stroke="var(--sobre-acento)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {recurso}
          </Revelar>
        ))}
      </ul>
      <p className="visualmente-oculto">Tecnologias:</p>
      <ul className={styles.stack}>
        {projeto.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

type ChamadaProps = {
  projeto: Projeto
  variante?: 'preenchido' | 'claro'
  icone?: ReactNode
  apoio?: string
}

/* Botão para abrir o filho; enquanto não publicado, informa a fase. */
export function ChamadaProjeto({ projeto, variante = 'preenchido', icone, apoio }: ChamadaProps) {
  const publicado = projeto.status === 'publicado'
  const meta = publicado
    ? (apoio ?? `Projeto ${doisDigitos(projeto.numero)} de 07`)
    : `Em construção · fase ${projeto.fase} de 7 na ordem de construção`
  return (
    <div className={styles.chamada}>
      {publicado ? (
        <BotaoPilula href={projeto.href} tamanho="g" variante={variante} icone={icone}>
          Abrir {projeto.nome}
        </BotaoPilula>
      ) : (
        <BotaoPilula
          tamanho="g"
          variante={variante}
          icone={icone}
          aria-disabled="true"
          aria-describedby={`${projeto.id}-meta`}
          onClick={(e) => e.preventDefault()}
        >
          Abrir {projeto.nome}
        </BotaoPilula>
      )}
      <p id={`${projeto.id}-meta`} className={styles.meta}>
        {meta}
      </p>
    </div>
  )
}

/* Rodapé padrão da seção: recursos à esquerda e chamada à direita. */
export function RodapeSecao({
  projeto,
  variante,
}: {
  projeto: Projeto
  variante?: 'preenchido' | 'claro'
}) {
  return (
    <div className={styles.rodape}>
      <RecursosProjeto projeto={projeto} />
      <ChamadaProjeto projeto={projeto} variante={variante} />
    </div>
  )
}
/* Fim das peças comuns das seções. */
