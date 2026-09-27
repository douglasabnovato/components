/*
 * Contato: o formulário e a action que o recebe moram no mesmo módulo.
 * Sem JavaScript, o navegador faz um POST comum e o servidor devolve a página
 * com os erros ou redireciona. Com JavaScript, o React Router faz o mesmo
 * envio por fetch, o botão mostra o andamento e o foco vai para o resumo de erros.
 */
import { useEffect, useRef } from 'react'
import { data, Form, redirect, useNavigation } from 'react-router'
import { ASSUNTOS, ORDEM_CAMPOS, validarContato, type CampoContato } from '../dominio/contato'
import { guardarMensagem } from '../dominio/mensagens.server'
import type { Route } from './+types/contato'

export const meta: Route.MetaFunction = () => [{ title: 'Contato · Formulários no Servidor' }]

const rotulos: Record<CampoContato, string> = {
  nome: 'Nome',
  email: 'E-mail',
  assunto: 'Assunto',
  mensagem: 'Mensagem',
}

/* Recebe o POST: valida, guarda e redireciona (post, redirect, get). */
export async function action({ request }: Route.ActionArgs) {
  const resultado = validarContato(await request.formData())
  if (!resultado.ok) {
    return data({ erros: resultado.erros, valores: resultado.valores }, { status: 400 })
  }
  const protocolo = resultado.robo ? 'MSG-0000' : guardarMensagem(resultado.dados).protocolo
  return redirect(`/contato/enviado?protocolo=${protocolo}`)
}

/* Formulário com erros ao lado de cada campo e resumo no topo. */
export default function Contato({ actionData }: Route.ComponentProps) {
  const navegacao = useNavigation()
  const enviando = navegacao.state === 'submitting'
  const erros = actionData?.erros ?? {}
  const valores = actionData?.valores
  const comErro = ORDEM_CAMPOS.filter((c) => erros[c])
  const resumo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (actionData) resumo.current?.focus()
  }, [actionData])

  /* Atributos de acessibilidade de um campo. */
  const aria = (campo: CampoContato) => ({
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `${campo}-erro` : undefined,
  })

  return (
    <>
      <p className="rotulo">Contato</p>
      <h1 className="titulo">Fale com o hub.</h1>
      <p className="resumo">
        Envie com o JavaScript ligado e depois desligado: a validação é a mesma, porque quem decide
        é o servidor.
      </p>

      <Form method="post" noValidate className="formulario" style={{ marginTop: '2rem' }}>
        {comErro.length ? (
          <div
            ref={resumo}
            tabIndex={-1}
            className="resumo-erros"
            role="alert"
            aria-labelledby="resumo-erros-titulo"
          >
            <h2 id="resumo-erros-titulo">
              {comErro.length === 1 ? 'Corrija 1 campo' : `Corrija ${comErro.length} campos`}
            </h2>
            <ul>
              {comErro.map((c) => (
                <li key={c}>
                  <a href={`#${c}`}>
                    {rotulos[c]}: {erros[c]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            autoComplete="name"
            defaultValue={valores?.nome}
            {...aria('nome')}
          />
          {erros.nome ? (
            <p id="nome-erro" className="erro">
              {erros.nome}
            </p>
          ) : null}
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={valores?.email}
            {...aria('email')}
          />
          {erros.email ? (
            <p id="email-erro" className="erro">
              {erros.email}
            </p>
          ) : null}
        </div>

        <div className="campo">
          <label htmlFor="assunto">Assunto</label>
          <select
            id="assunto"
            name="assunto"
            defaultValue={valores?.assunto ?? ''}
            {...aria('assunto')}
          >
            <option value="" disabled>
              Escolha um assunto
            </option>
            {ASSUNTOS.map((a) => (
              <option key={a.valor} value={a.valor}>
                {a.rotulo}
              </option>
            ))}
          </select>
          {erros.assunto ? (
            <p id="assunto-erro" className="erro">
              {erros.assunto}
            </p>
          ) : null}
        </div>

        <div className="campo">
          <label htmlFor="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={5}
            defaultValue={valores?.mensagem}
            {...aria('mensagem')}
          />
          {erros.mensagem ? (
            <p id="mensagem-erro" className="erro">
              {erros.mensagem}
            </p>
          ) : (
            <p className="dica">Entre 10 e 1000 caracteres.</p>
          )}
        </div>

        <div className="campo" style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'center' }}>
          <input
            id="resposta"
            name="resposta"
            type="checkbox"
            value="sim"
            defaultChecked={valores?.resposta}
            style={{ width: '1.25rem', minHeight: '1.25rem' }}
          />
          <label htmlFor="resposta" style={{ fontWeight: 400 }}>
            Quero receber resposta por e-mail
          </label>
        </div>

        <div className="armadilha" aria-hidden="true">
          <label htmlFor="site">Não preencha este campo</label>
          <input id="site" name="site" tabIndex={-1} autoComplete="off" />
        </div>

        <p>
          <button type="submit" className="botao" aria-disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar mensagem'}
          </button>
        </p>
      </Form>
    </>
  )
}
/* Fim do Contato. */
