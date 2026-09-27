/*
 * Layout do Cadastro: link de salto, cabeçalho (voltar ao hub e marca),
 * conteúdo e rodapé com os créditos.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { Link, Outlet } from 'react-router'
import { URL_HUB } from '../../config'
import styles from './Layout.module.css'

/* Estrutura comum às páginas. */
export function Layout() {
  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.cabecalho}>
        <div className={styles.faixa}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <Link to="/" className={styles.marca} aria-label="Cadastro, início">
            <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="var(--acento)" />
              <rect
                x="14"
                y="16"
                width="36"
                height="32"
                rx="6"
                fill="none"
                stroke="var(--sobre-acento)"
                strokeWidth="4"
              />
              <path d="M14 28h36M26 28v20" stroke="var(--sobre-acento)" strokeWidth="4" />
            </svg>
            <span>Cadastro</span>
          </Link>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <p>
          <strong>Cadastro</strong> é o projeto 02 do hub components. Evolução do projeto cadastro
          (Next.js + Firebase) para React com repositório trocável.
        </p>
        <p>Em memória, os dados somem ao recarregar. Na API, ficam no banco local (PGlite).</p>
      </footer>
    </div>
  )
}
/* Fim do Layout. */
