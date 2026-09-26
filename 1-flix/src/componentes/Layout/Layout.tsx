/*
 * Layout do Flix: link de salto, cabeçalho (voltar ao hub, logo, navegação,
 * busca e "Novo vídeo"), conteúdo das rotas e rodapé com os créditos.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { URL_HUB } from '../../config'
import { LinkPilula } from '../LinkPilula/LinkPilula'
import { Logo } from '../Logo'
import styles from './Layout.module.css'

/* Campo de busca que leva à Início com ?busca=; recriado quando a URL muda. */
function Busca({ atual }: { atual: string }) {
  const navegar = useNavigate()
  const [termo, setTermo] = useState(atual)

  /* Envia a busca sem recarregar a página. */
  function buscar(evento: FormEvent) {
    evento.preventDefault()
    const limpo = termo.trim()
    navegar(limpo ? `/?busca=${encodeURIComponent(limpo)}` : '/')
  }

  return (
    <form role="search" className={styles.busca} onSubmit={buscar}>
      <label htmlFor="busca" className="visualmente-oculto">
        Buscar vídeos
      </label>
      <input
        id="busca"
        type="search"
        placeholder="Buscar vídeos"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
      />
      <button type="submit" aria-label="Buscar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  )
}

/* Estrutura comum a todas as páginas. */
export function Layout() {
  const { pathname } = useLocation()
  const [parametros] = useSearchParams()
  const buscaAtual = parametros.get('busca') ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.pagina}>
      <SkipLink />
      <header className={styles.cabecalho}>
        <div className={styles.faixa}>
          <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
          <Link to="/" className={styles.marca} aria-label="Flix, página inicial">
            <Logo />
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            <NavLink to="/" end className={styles.link}>
              Início
            </NavLink>
            <NavLink to="/painel" className={styles.link}>
              Painel
            </NavLink>
          </nav>
          <Busca key={buscaAtual} atual={buscaAtual} />
          <LinkPilula to="/painel/videos/novo" icone="+" className={styles.novo}>
            Novo vídeo
          </LinkPilula>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <p>
          <strong>Flix</strong> é o projeto 01 do hub components. Ideia: desafio AluraFlix (Alura) ·
          Implementação de referência: LeoFlix, de Leonardo de Sant Ana · Vídeos de exemplo: canal
          Fireship, exibidos pelo player oficial do YouTube.
        </p>
        <p>Os dados ficam salvos só neste navegador.</p>
      </footer>
    </div>
  )
}
/* Fim do Layout. */
