/*
 * Layout da Trilha: link de salto, cabeçalho (voltar ao hub, logo, navegação
 * e progresso geral), conteúdo das rotas e rodapé com créditos.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { URL_HUB } from '../../config'
import { useAssistidos } from '../../dados/progresso'
import { aprendizados } from '../../dados/trilha'
import { BarraProgresso } from '../BarraProgresso/BarraProgresso'
import { Logo } from '../Logo'
import styles from './Layout.module.css'

/* Estrutura comum a todas as páginas. */
export function Layout() {
  const { pathname, hash } = useLocation()
  const assistidos = useAssistidos()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.cabecalho}>
        <div className={styles.faixa}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <Link to="/" className={styles.marca} aria-label="Trilha React, início">
            <Logo />
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            <NavLink to="/" end className={styles.link}>
              Trilha
            </NavLink>
            <NavLink to="/stack" className={styles.link}>
              Stack
            </NavLink>
          </nav>
          <div className={styles.progresso}>
            <span className={styles.contagem}>
              {assistidos.size}/{aprendizados.length}
            </span>
            <BarraProgresso
              compacta
              valor={assistidos.size}
              maximo={aprendizados.length}
              rotulo={`Progresso geral: ${assistidos.size} de ${aprendizados.length} aprendizados`}
            />
          </div>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <p>
          <strong>Trilha React</strong> é o projeto 08 do hub components: uma curadoria de vídeos
          públicos do YouTube em ordem de consumo. Os vídeos são exibidos pelo player oficial e os
          créditos pertencem a cada canal.
        </p>
        <p>O progresso e as anotações ficam salvos só neste navegador.</p>
      </footer>
    </div>
  )
}
/* Fim do Layout. */
