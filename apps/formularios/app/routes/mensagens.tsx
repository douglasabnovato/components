/*
 * Mensagens recebidas: o loader lista a caixa do servidor e a action a
 * esvazia. Um formulário POST simples, que também funciona sem JavaScript.
 */
import { Form, redirect } from 'react-router'
import { rotuloAssunto } from '../dominio/contato'
import { esvaziarCaixa, listarMensagens } from '../dominio/mensagens.server'
import type { Route } from './+types/mensagens'

export const meta: Route.MetaFunction = () => [{ title: 'Mensagens · Formulários no Servidor' }]

/* Lista as mensagens guardadas na memória do servidor. */
export function loader() {
  return { mensagens: listarMensagens() }
}

/* Esvazia a caixa e volta para a lista. */
export async function action({ request }: Route.ActionArgs) {
  const formulario = await request.formData()
  if (formulario.get('intencao') === 'esvaziar') esvaziarCaixa()
  return redirect('/mensagens')
}

/* Tabela das mensagens ou aviso de caixa vazia. */
export default function Mensagens({ loaderData }: Route.ComponentProps) {
  const { mensagens } = loaderData
  return (
    <>
      <p className="rotulo">Caixa do servidor</p>
      <h1 className="titulo">Mensagens recebidas</h1>
      <p className="resumo">Guardadas na memória do servidor: somem quando ele reinicia.</p>
      <section className="secao" aria-label="Lista de mensagens">
        {mensagens.length === 0 ? (
          <p>Nenhuma mensagem ainda.</p>
        ) : (
          <>
            <div className="moldura-tabela">
              <table className="tabela">
                <caption className="visualmente-oculto">Mensagens recebidas</caption>
                <thead>
                  <tr>
                    <th scope="col">Protocolo</th>
                    <th scope="col">De</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {mensagens.map((m) => (
                    <tr key={m.protocolo}>
                      <th scope="row">{m.protocolo}</th>
                      <td>{m.nome}</td>
                      <td>{rotuloAssunto(m.assunto)}</td>
                      <td>{m.mensagem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Form method="post">
              <button type="submit" name="intencao" value="esvaziar" className="botao botao-vazado">
                Esvaziar a caixa
              </button>
            </Form>
          </>
        )}
      </section>
    </>
  )
}
/* Fim das mensagens. */
