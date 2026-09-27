/*
 * Equipes: os dois universos, cada um com suas equipes, lema e integrantes.
 */
import { Link } from 'react-router'
import { Emblema } from '../componentes/Emblema'
import { forcaTotal, heroisDaEquipe } from '../dominio/herois'
import { equipes, universos } from '../dominio/universo'

/* Renderiza universos e equipes. */
export function Equipes() {
  return (
    <div className="grid gap-12">
      <header className="grid gap-3">
        <p className="font-codigo text-sm tracking-widest text-acento uppercase">
          Universos e equipes
        </p>
        <h1 className="font-titulo text-4xl md:text-5xl">Quem luta ao lado de quem</h1>
      </header>
      {universos.map((u) => (
        <section key={u.slug} aria-labelledby={`universo-${u.slug}`} className="grid gap-6">
          <div className="grid gap-2">
            <h2 id={`universo-${u.slug}`} className="font-titulo text-3xl">
              {u.nome}
            </h2>
            <p className="max-w-2xl text-suave">{u.descricao}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {equipes
              .filter((e) => e.universo === u.slug)
              .map((e) => {
                const membros = heroisDaEquipe(e.slug)
                return (
                  <article
                    key={e.slug}
                    className="grid content-start gap-4 rounded-g border border-borda border-t-4 bg-superficie p-6"
                    style={{ borderTopColor: e.cor }}
                  >
                    <h3 className="font-titulo text-xl">{e.nome}</h3>
                    <p className="text-suave italic">“{e.lema}”</p>
                    <p className="text-sm text-suave">
                      Força somada: {membros.reduce((s, h) => s + forcaTotal(h), 0)}
                    </p>
                    <ul className="m-0 grid list-none gap-2 p-0">
                      {membros.map((h) => (
                        <li key={h.slug}>
                          <Link
                            to={`/heroi/${h.slug}`}
                            className="flex items-center gap-3 no-underline hover:text-acento"
                          >
                            <Emblema emblema={h.emblema} cor={h.cor} tamanho={40} />
                            <span>
                              <strong>{h.nome}</strong>{' '}
                              <span className="text-suave">· {h.identidade}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
/* Fim das Equipes. */
