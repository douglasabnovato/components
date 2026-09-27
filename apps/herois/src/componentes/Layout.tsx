/*
 * Layout do Portal: link de salto, cabeçalho com voltar ao hub e menu que
 * vira painel no celular (aria-expanded, Esc fecha e devolve o foco, fecha ao
 * navegar), conteúdo e rodapé. Estilizado só com utilitários do Tailwind.
 */
import { BotaoVoltar, SkipLink } from '@components/ui'
import { MotionConfig } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { URL_HUB } from '../config'

const links = [
  { para: '/', rotulo: 'Heróis', fim: true },
  { para: '/equipes', rotulo: 'Equipes', fim: false },
  { para: '/comparar', rotulo: 'Comparar', fim: false },
]

/* Classes do link conforme estiver ativo. */
function classeLink({ isActive }: { isActive: boolean }) {
  return [
    'block rounded-full px-4 py-2 font-semibold no-underline transition-colors',
    isActive ? 'bg-acento text-sobre-acento' : 'text-suave hover:text-texto',
  ].join(' ')
}

/* Estrutura comum e controle do menu. */
export function Layout() {
  const { pathname } = useLocation()
  const [aberto, setAberto] = useState(false)
  const [rotaDoMenu, setRotaDoMenu] = useState(pathname)
  const botao = useRef<HTMLButtonElement>(null)
  const idMenu = useId()

  if (rotaDoMenu !== pathname) {
    setRotaDoMenu(pathname)
    setAberto(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!aberto) return
    /* Fecha o menu com Esc e devolve o foco ao botão. */
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return
      setAberto(false)
      botao.current?.focus()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto]">
        <SkipLink />
        <header className="sticky top-0 z-40 border-b border-borda bg-fundo/90 backdrop-blur">
          <div className="mx-auto flex w-[min(100%-2rem,76rem)] flex-wrap items-center gap-4 py-3">
            <BotaoVoltar href={URL_HUB} fixo={false} rotulo="Hub" />
            <Link
              to="/"
              className="flex items-center gap-2 font-titulo text-xl font-bold no-underline"
            >
              <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
                <rect width="64" height="64" rx="16" fill="var(--acento)" />
                <path
                  d="M32 12l6 14 15 1-11 10 4 15-14-8-14 8 4-15-11-10 15-1z"
                  fill="var(--sobre-acento)"
                />
              </svg>
              Portal de Heróis
            </Link>
            <button
              ref={botao}
              type="button"
              className="ml-auto cursor-pointer rounded-full border border-borda bg-transparent px-4 py-2 font-semibold md:hidden"
              aria-expanded={aberto}
              aria-controls={idMenu}
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? 'Fechar menu' : 'Menu'}
            </button>
            <nav
              id={idMenu}
              aria-label="Principal"
              className={[aberto ? 'block' : 'hidden', 'w-full md:ml-auto md:block md:w-auto'].join(
                ' ',
              )}
            >
              <ul className="m-0 flex list-none flex-col gap-1 p-0 md:flex-row">
                {links.map((l) => (
                  <li key={l.para}>
                    <NavLink to={l.para} end={l.fim} className={classeLink}>
                      {l.rotulo}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="conteudo" tabIndex={-1} className="mx-auto w-[min(100%-2rem,76rem)] py-8 pb-16">
          <Outlet />
        </main>
        <footer className="grid gap-2 border-t border-borda bg-superficie px-[max(1rem,calc((100%-76rem)/2))] py-8 text-sm text-suave">
          <p>
            <strong className="text-texto">Portal de Heróis</strong> é o projeto 03 do hub
            components. Inspirado no projeto marvel; heróis, nomes, histórias e emblemas são 100%
            originais.
          </p>
          <p>As animações respeitam a preferência de movimento reduzido do sistema.</p>
        </footer>
      </div>
    </MotionConfig>
  )
}
/* Fim do Layout. */
