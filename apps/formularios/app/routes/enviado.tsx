/*
 * Confirmação do envio: o loader busca a mensagem pelo protocolo da URL.
 * Recarregar esta página não reenvia nada (post, redirect, get).
 */
import { data, Link } from 'react-router'
import { rotuloAssunto } from '../dominio/contato'
import { buscarMensagem } from '../dominio/mensagens.server'
import type { Route } from './+types/enviado'

export const meta: Route.MetaFunction = () => [
  { title: 'Mensagem enviada · Formulários no Servidor' },
]

/* Lê o protocolo; o protocolo da armadilha de robôs mostra só a confirmação. */
export function loader({ request }: Route.LoaderArgs) {
  const protocolo = new URL(request.url).searchParams.get('protocolo') ?? ''
  if (protocolo === 'MSG-0000') return { protocolo, mensagem: null }
  const mensagem = buscarMensagem(protocolo)
  if (!mensagem) throw data('Protocolo não encontrado', { status: 404 })
  return { protocolo, mensagem }
}

/* Mostra o resumo da mensagem recebida. */
export default function Enviado({ loaderData }: Route.ComponentProps) {
  const { protocolo, mensagem } = loaderData
  return (
    <>
      <p className="rotulo">Tudo certo</p>
      <h1 className="titulo">Mensagem recebida.</h1>
      <div className="sucesso" style={{ marginTop: '2rem' }}>
        <p>
          Protocolo <strong>{protocolo}</strong>
        </p>
        {mensagem ? (
          <dl style={{ display: 'grid', gap: '0.5rem', margin: 0 }}>
            <div>
              <dt className="dica">De</dt>
              <dd style={{ margin: 0 }}>
                {mensagem.nome} ({mensagem.email})
              </dd>
            </div>
            <div>
              <dt className="dica">Assunto</dt>
              <dd style={{ margin: 0 }}>{rotuloAssunto(mensagem.assunto)}</dd>
            </div>
            <div>
              <dt className="dica">Resposta por e-mail</dt>
              <dd style={{ margin: 0 }}>{mensagem.resposta ? 'Sim' : 'Não'}</dd>
            </div>
          </dl>
        ) : null}
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link className="botao" to="/contato">
            Enviar outra
          </Link>
          <Link className="botao botao-vazado" to="/mensagens">
            Ver mensagens
          </Link>
        </p>
      </div>
    </>
  )
}
/* Fim da confirmação. */
