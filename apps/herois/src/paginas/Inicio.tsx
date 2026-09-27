/*
 * Início do Portal: cena em camadas com o título, filtros por universo,
 * equipe e busca (na URL) e o catálogo animado.
 */
import { AnimatePresence } from 'motion/react'
import { useId } from 'react'
import { useSearchParams } from 'react-router'
import { CardHeroi } from '../componentes/CardHeroi'
import { Cena } from '../componentes/Cena'
import {
  equipesDoUniverso,
  filtrarHerois,
  lerFiltros,
  paraParametros,
  type Filtros,
} from '../dominio/herois'
import { herois, universos } from '../dominio/universo'

const campo = 'min-h-11 rounded-full border border-borda bg-superficie-2 px-4'

/* Monta a cena, os filtros e a grade. */
export function Inicio() {
  const [parametros, setParametros] = useSearchParams()
  const filtros = lerFiltros(parametros)
  const visiveis = filtrarHerois(filtros)
  const id = useId()

  /* Grava a mudança na URL; trocar o universo limpa uma equipe de outro universo. */
  function mudar(parcial: Partial<Filtros>) {
    const novo = { ...filtros, ...parcial }
    if (
      parcial.universo !== undefined &&
      !equipesDoUniverso(novo.universo).some((e) => e.slug === novo.equipe)
    ) {
      novo.equipe = ''
    }
    setParametros(paraParametros(novo), { replace: true })
  }

  return (
    <div className="grid gap-10">
      <section
        aria-labelledby="titulo-portal"
        className="relative isolate -mx-4 overflow-hidden md:mx-0 md:rounded-g"
      >
        <Cena />
        <div className="relative grid min-h-[26rem] content-end gap-4 p-8 md:p-12">
          <p className="font-codigo text-sm tracking-widest text-acento uppercase">
            Projeto 03 · universo original
          </p>
          <h1 id="titulo-portal" className="max-w-3xl font-titulo text-4xl md:text-6xl">
            Um universo de heróis originais para explorar.
          </h1>
          <p className="max-w-2xl text-lg text-suave">
            {herois.length} heróis, {universos.length} universos e 3 equipes criados para o projeto,
            com fichas completas, equipes e comparação.
          </p>
        </div>
      </section>

      <search
        aria-label="Filtros do catálogo"
        className="flex flex-wrap items-end gap-4 rounded-g border border-borda bg-superficie p-4"
      >
        <label
          className="grid flex-[1_1_14rem] gap-1 text-sm font-semibold"
          htmlFor={`${id}-busca`}
        >
          Buscar
          <input
            id={`${id}-busca`}
            type="search"
            className={`${campo} font-normal`}
            placeholder="Nome, identidade ou poder"
            value={filtros.busca}
            onChange={(e) => mudar({ busca: e.target.value })}
          />
        </label>
        <label
          className="grid flex-[1_1_12rem] gap-1 text-sm font-semibold"
          htmlFor={`${id}-universo`}
        >
          Universo
          <select
            id={`${id}-universo`}
            className={`${campo} font-normal`}
            value={filtros.universo}
            onChange={(e) => mudar({ universo: e.target.value })}
          >
            <option value="">Todos os universos</option>
            {universos.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.nome}
              </option>
            ))}
          </select>
        </label>
        <label
          className="grid flex-[1_1_12rem] gap-1 text-sm font-semibold"
          htmlFor={`${id}-equipe`}
        >
          Equipe
          <select
            id={`${id}-equipe`}
            className={`${campo} font-normal`}
            value={filtros.equipe}
            onChange={(e) => mudar({ equipe: e.target.value })}
          >
            <option value="">Todas as equipes</option>
            {equipesDoUniverso(filtros.universo).map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.nome}
              </option>
            ))}
          </select>
        </label>
      </search>

      <section aria-labelledby="titulo-catalogo" className="grid gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="titulo-catalogo" className="font-titulo text-2xl">
            Catálogo
          </h2>
          <p role="status" className="text-sm text-suave">
            {visiveis.length} de {herois.length} heróis
          </p>
        </div>
        {visiveis.length === 0 ? (
          <div className="grid justify-items-center gap-4 rounded-g border border-dashed border-borda p-12 text-center">
            <p className="font-titulo text-xl">Nenhum herói encontrado</p>
            <button
              type="button"
              className="cursor-pointer rounded-full border border-borda bg-transparent px-4 py-2 font-semibold"
              onClick={() => setParametros({}, { replace: true })}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4 p-0">
            <AnimatePresence initial={false} mode="popLayout">
              {visiveis.map((h) => (
                <CardHeroi key={h.slug} heroi={h} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  )
}
/* Fim do Início. */
