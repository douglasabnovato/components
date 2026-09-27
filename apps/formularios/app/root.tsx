/*
 * Raiz do app (modo framework): documento HTML completo renderizado no
 * servidor, estilos como <link>, cabeçalho, navegação e o indicador de modo
 * (com ou sem JavaScript). Substitui os partials head, header e footer do EJS.
 */
import { BotaoVoltar, enderecoDoHub, SkipLink } from '@components/ui'
import fraunces from '@fontsource-variable/fraunces/index.css?url'
import inter from '@fontsource-variable/inter/index.css?url'
import spaceGrotesk from '@fontsource-variable/space-grotesk/index.css?url'
import tokens from '@components/ui/tokens.css?url'
import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router'
import type { Route } from './+types/root'
import estilos from './estilos/global.css?url'

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/formularios/favicon.svg', type: 'image/svg+xml' },
  { rel: 'stylesheet', href: inter },
  { rel: 'stylesheet', href: spaceGrotesk },
  { rel: 'stylesheet', href: fraunces },
  { rel: 'stylesheet', href: tokens },
  { rel: 'stylesheet', href: estilos },
]

/* Assinatura vazia: o valor só muda entre servidor e navegador. */
function assinar() {
  return () => {}
}

/* true depois da hidratação no navegador; false no HTML do servidor. */
function useComJavaScript() {
  return useSyncExternalStore(
    assinar,
    () => true,
    () => false,
  )
}

/* Documento HTML comum a todas as rotas (inclusive a de erro). */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0c10" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/* Casca visual: cabeçalho, conteúdo da rota e rodapé. */
function Casca({ children }: { children: ReactNode }) {
  const comJs = useComJavaScript()
  return (
    <div className="pagina">
      <SkipLink />
      <header className="cabecalho">
        <div className="faixa">
          <BotaoVoltar href={enderecoDoHub(4)} fixo={false} rotulo="Hub" />
          <a href="/formularios/" className="marca">
            <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="var(--acento)" />
              <rect
                x="16"
                y="14"
                width="32"
                height="36"
                rx="4"
                fill="none"
                stroke="var(--sobre-acento)"
                strokeWidth="4"
              />
              <path
                d="M22 26h20M22 34h20M22 42h12"
                stroke="var(--sobre-acento)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            Formulários no Servidor
          </a>
          <nav aria-label="Principal" className="nav">
            <ul>
              <li>
                <NavLink to="/" end>
                  Início
                </NavLink>
              </li>
              <li>
                <NavLink to="/sobre">Sobre</NavLink>
              </li>
              <li>
                <NavLink to="/contato" end>
                  Contato
                </NavLink>
              </li>
              <li>
                <NavLink to="/mensagens">Mensagens</NavLink>
              </li>
            </ul>
          </nav>
          <p className="modo" data-js={comJs ? 'sim' : 'nao'}>
            {comJs
              ? 'Com JavaScript: envio sem recarregar'
              : 'Sem JavaScript: HTML puro do servidor'}
          </p>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className="conteudo">
        {children}
      </main>
      <footer className="rodape">
        <p>
          <strong>Formulários no Servidor</strong> é o projeto 04 do hub components. Releitura do
          node-ejs-forms (Express + EJS, trilha Discover da Rocketseat) com React Router em modo
          framework.
        </p>
        <p>Desligue o JavaScript do navegador e tudo continua funcionando.</p>
      </footer>
    </div>
  )
}

/* Rota raiz: a casca com a rota filha. */
export default function App() {
  return (
    <Casca>
      <Outlet />
    </Casca>
  )
}

/* Erros não tratados e 404 caem aqui, ainda dentro do layout. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const naoEncontrado = isRouteErrorResponse(error) && error.status === 404
  return (
    <Casca>
      <p className="rotulo">{naoEncontrado ? 'Erro 404' : 'Erro'}</p>
      <h1 className="titulo">{naoEncontrado ? 'Página não encontrada' : 'Algo deu errado'}</h1>
      <p className="resumo">
        {naoEncontrado
          ? 'O endereço não existe neste projeto.'
          : 'O servidor não conseguiu montar a página. Tente de novo em instantes.'}
      </p>
      <p style={{ marginTop: '2rem' }}>
        <a className="botao" href="/formularios/">
          Voltar ao início
        </a>
      </p>
    </Casca>
  )
}
/* Fim da raiz. */
