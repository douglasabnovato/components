/*
 * Sobre: compara o projeto original (Express + EJS) com a versão nova
 * (React Router em modo framework), peça por peça.
 */
import type { Route } from './+types/sobre'

export const meta: Route.MetaFunction = () => [{ title: 'Sobre · Formulários no Servidor' }]

const comparacao = [
  ['app.get("/home", ...)', 'Módulo de rota com loader', 'routes.ts + routes/inicio.tsx'],
  [
    'res.render("pages/index", dados)',
    'loader devolve os dados; o componente desenha',
    'loaderData',
  ],
  ['<%- include("../partials/head") %>', 'Layout da raiz com <Meta /> e <Links />', 'root.tsx'],
  ['partials/header e footer', 'Casca comum com <Outlet /> no meio', 'root.tsx'],
  ['items.forEach(...) no template', 'map no componente, com tipos', 'routes/inicio.tsx'],
  [
    '<form method="post"> + app.post',
    '<Form method="post"> + action no mesmo módulo',
    'routes/contato.tsx',
  ],
  ['Validação à mão (ou nenhuma)', 'Esquema Zod na action, erros por campo', 'dominio/contato.ts'],
  [
    'Recarregar a página a cada envio',
    'Sem JS recarrega; com JS, envio sem recarregar',
    'useNavigation',
  ],
]

/* Desenha o texto e a tabela de equivalências. */
export default function Sobre() {
  return (
    <>
      <p className="rotulo">Do EJS ao React Router</p>
      <h1 className="titulo">Mesma ideia, ferramentas de agora.</h1>
      <p className="resumo">
        O projeto original ensinava a montar páginas no servidor com Express e EJS: rotas, partials
        e um array percorrido com forEach. A versão nova mantém a ideia de o servidor entregar a
        página pronta e acrescenta o que faltava: formulário com validação, erros por campo e
        aprimoramento progressivo.
      </p>
      <section className="secao" aria-labelledby="equivalencias">
        <h2 id="equivalencias">Peça por peça</h2>
        <div className="moldura-tabela">
          <table className="tabela comparacao">
            <caption className="visualmente-oculto">
              Equivalência entre Express + EJS e React Router
            </caption>
            <thead>
              <tr>
                <th scope="col">Antes (Express + EJS)</th>
                <th scope="col">Agora (React Router)</th>
                <th scope="col">Onde ver</th>
              </tr>
            </thead>
            <tbody>
              {comparacao.map(([antes, agora, onde]) => (
                <tr key={antes}>
                  <td>
                    <code>{antes}</code>
                  </td>
                  <td>{agora}</td>
                  <td>
                    <code>{onde}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
/* Fim do Sobre. */
