/*
 * Ficha do herói: emblema grande, identidade, história, poderes, atributos
 * animados, equipe e atalho para comparar.
 */
import { Link, useParams } from 'react-router'
import { BarraAtributo } from '../componentes/BarraAtributo'
import { Emblema } from '../componentes/Emblema'
import {
  equipePorSlug,
  forcaTotal,
  heroiPorSlug,
  heroisDaEquipe,
  universoDoHeroi,
} from '../dominio/herois'
import { ATRIBUTOS } from '../dominio/tipos'
import { NaoEncontrado } from './NaoEncontrado'

/* Renderiza a ficha do herói da URL. */
export function Ficha() {
  const { slug = '' } = useParams()
  const heroi = heroiPorSlug(slug)
  if (!heroi) return <NaoEncontrado titulo="Herói não encontrado" />

  const equipe = equipePorSlug(heroi.equipe)
  const universo = universoDoHeroi(heroi)
  const colegas = heroisDaEquipe(heroi.equipe).filter((h) => h.slug !== heroi.slug)

  return (
    <article className="grid gap-10">
      <nav aria-label="Você está em" className="text-sm text-suave">
        <Link to="/" className="hover:text-acento">
          Heróis
        </Link>{' '}
        / <span aria-current="page">{heroi.nome}</span>
      </nav>

      <header className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <Emblema emblema={heroi.emblema} cor={heroi.cor} tamanho={180} />
        <div className="grid gap-3">
          <p className="font-codigo text-sm tracking-widest text-acento uppercase">
            {universo?.nome} · {equipe?.nome}
          </p>
          <h1 className="font-titulo text-5xl">{heroi.nome}</h1>
          <p className="text-lg text-suave">
            {heroi.identidade} · {heroi.cidade}
          </p>
          <p className="max-w-2xl text-lg">{heroi.resumo}</p>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <section
          aria-labelledby="historia"
          className="grid content-start gap-3 rounded-g border border-borda bg-superficie p-6"
        >
          <h2 id="historia" className="font-titulo text-xl">
            História
          </h2>
          <p className="text-suave">{heroi.historia}</p>
          <h3 className="mt-2 font-titulo text-lg">Poderes</h3>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {heroi.poderes.map((p) => (
              <li key={p} className="rounded-full border border-borda px-3 py-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="atributos"
          className="grid content-start gap-4 rounded-g border border-borda bg-superficie p-6"
        >
          <h2 id="atributos" className="font-titulo text-xl">
            Atributos{' '}
            <span className="text-base font-normal text-suave">· total {forcaTotal(heroi)}/40</span>
          </h2>
          {ATRIBUTOS.map((a) => (
            <BarraAtributo
              key={a.chave}
              rotulo={a.rotulo}
              valor={heroi.atributos[a.chave]}
              cor={heroi.cor}
            />
          ))}
          <Link
            to={`/comparar?a=${heroi.slug}`}
            className="mt-2 justify-self-start rounded-full bg-acento px-5 py-2.5 font-bold text-sobre-acento no-underline"
          >
            Comparar {heroi.nome} com outro herói
          </Link>
        </section>
      </div>

      <section aria-labelledby="colegas" className="grid gap-4">
        <h2 id="colegas" className="font-titulo text-xl">
          Na mesma equipe
        </h2>
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
          {colegas.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/heroi/${c.slug}`}
                className="flex items-center gap-3 rounded-full border border-borda py-1.5 pr-4 pl-1.5 no-underline hover:border-acento"
              >
                <Emblema emblema={c.emblema} cor={c.cor} tamanho={36} />
                {c.nome}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
/* Fim da Ficha. */
