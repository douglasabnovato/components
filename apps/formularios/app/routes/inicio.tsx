/*
 * Início: o loader roda no servidor e entrega os princípios e o total de
 * mensagens; o componente só desenha. É o antigo res.render('index', dados).
 */
import { Link } from 'react-router'
import { listarMensagens } from '../dominio/mensagens.server'
import { principios } from '../dominio/principios'
import type { Route } from './+types/inicio'

export const meta: Route.MetaFunction = () => [
  { title: 'Formulários no Servidor · formulários que funcionam sem JavaScript' },
  {
    name: 'description',
    content: 'React Router em modo framework: SSR, loaders, actions e aprimoramento progressivo.',
  },
]

/* Dados da página, montados no servidor. */
export function loader() {
  return { principios, totalMensagens: listarMensagens().length }
}

/* Desenha a chamada e os princípios. */
export default function Inicio({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <p className="rotulo">Projeto 04 · SSR e aprimoramento progressivo</p>
      <h1 className="titulo">Formulários que funcionam até sem JavaScript.</h1>
      <p className="resumo">
        O servidor lê, valida e responde. No navegador, o JavaScript só melhora a experiência, nunca
        é requisito. Já chegaram {loaderData.totalMensagens}{' '}
        {loaderData.totalMensagens === 1 ? 'mensagem' : 'mensagens'} desde que o servidor subiu.
      </p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
        <Link className="botao" to="/contato">
          Testar o formulário
        </Link>
        <Link className="botao botao-vazado" to="/sobre">
          Do EJS ao React Router
        </Link>
      </p>
      <section className="secao" aria-labelledby="principios">
        <h2 id="principios">Cinco princípios</h2>
        <ul className="cartoes">
          {loaderData.principios.map((p) => (
            <li key={p.letra} className="cartao">
              <strong aria-hidden="true">{p.letra}</strong>
              <h3>{p.titulo}</h3>
              <p style={{ color: 'var(--texto-suave)' }}>{p.texto}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
/* Fim do Início. */
