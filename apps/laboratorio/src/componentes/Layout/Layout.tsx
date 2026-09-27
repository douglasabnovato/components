/*
 * Layout do Laboratório: link de salto, cabeçalho (voltar ao hub, marca e
 * progresso), conteúdo e rodapé com os créditos.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { URL_HUB } from '../../config'
import { useConcluidas } from '../../dados/progresso'
import { licoes } from '../../licoes/indice'
import styles from './Layout.module.css'

/* Estrutura comum às páginas. */
export function Layout() {
  const { pathname } = useLocation()
  const concluidas = useConcluidas()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.cabecalho}>
        <div className={styles.faixa}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <Link to="/" className={styles.marca} aria-label="Laboratório, índice das lições">
            <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="var(--acento)" />
              <path
                d="M26 14h12M28 14v14L18 46a4 4 0 0 0 4 6h20a4 4 0 0 0 4-6L36 28V14"
                fill="none"
                stroke="var(--sobre-acento)"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
            Laboratório
          </Link>
          <p className={styles.progresso}>
            {concluidas.length}/{licoes.length} lições concluídas
          </p>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <p>
          <strong>Laboratório</strong> é o projeto 07 do hub components. Reorganização do projeto
          components (React Fundamentals, Hooks, React Docs, Jogo da Velha) em lições com demo,
          código e teste.
        </p>
        <p>A aba "Assista" liga cada lição aos vídeos da Trilha React (projeto 08).</p>
      </footer>
    </div>
  )
}
/* Fim do Layout. */
