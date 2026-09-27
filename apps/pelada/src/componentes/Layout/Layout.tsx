/*
 * Layout da Pelada: link de salto, cabeçalho (voltar ao hub, logo e
 * navegação), conteúdo das rotas e rodapé com os créditos.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { URL_HUB } from '../../config'
import { Logo } from '../Logo'
import styles from './Layout.module.css'

/* Estrutura comum a todas as páginas. */
export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.cabecalho}>
        <div className={styles.faixa}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <Link to="/" className={styles.marca} aria-label="Lista da Pelada, início">
            <Logo />
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            <NavLink to="/" end className={styles.link}>
              Jogos
            </NavLink>
            <NavLink to="/novo" className={styles.link}>
              Novo jogo
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <p>
          <strong>Lista da Pelada</strong> é o projeto 06 do hub components. Evolução do to-do-list
          da trilha Especializar (Rocketseat Discover), reescrito com hooks puros.
        </p>
        <p>Os jogos ficam salvos só neste navegador. O perfil do organizador vem do GitHub.</p>
      </footer>
    </div>
  )
}
/* Fim do Layout. */
