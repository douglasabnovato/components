/*
 * Comparar: dois seletores (na URL: ?a=&b=) e os atributos lado a lado, com
 * destaque para quem vence cada um e o total.
 */
import { useId } from 'react'
import { useSearchParams } from 'react-router'
import { BarraAtributo } from '../componentes/BarraAtributo'
import { Emblema } from '../componentes/Emblema'
import { comparar, heroiPorSlug } from '../dominio/herois'
import { herois } from '../dominio/universo'

/* Lê os dois heróis da URL (com padrões) e monta a comparação. */
export function Comparar() {
  const [parametros, setParametros] = useSearchParams()
  const id = useId()
  const a = heroiPorSlug(parametros.get('a') ?? '') ?? herois[0]!
  const b = heroiPorSlug(parametros.get('b') ?? '') ?? herois.find((h) => h.slug !== a.slug)!
  const resultado = comparar(a, b)

  /* Troca um dos lados mantendo o outro. */
  function escolher(lado: 'a' | 'b', slug: string) {
    const p = new URLSearchParams({ a: a.slug, b: b.slug })
    p.set(lado, slug)
    setParametros(p, { replace: true })
  }

  const vencedor = resultado.vence ? heroiPorSlug(resultado.vence) : null

  return (
    <div className="grid gap-10">
      <header className="grid gap-3">
        <p className="font-codigo text-sm tracking-widest text-acento uppercase">Frente a frente</p>
        <h1 className="font-titulo text-4xl md:text-5xl">Comparar heróis</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {(
          [
            ['a', a],
            ['b', b],
          ] as const
        ).map(([lado, heroi]) => (
          <section
            key={lado}
            aria-labelledby={`${id}-${lado}`}
            className="grid content-start gap-5 rounded-g border border-borda bg-superficie p-6"
          >
            <label className="grid gap-1 text-sm font-semibold" htmlFor={`${id}-sel-${lado}`}>
              {lado === 'a' ? 'Primeiro herói' : 'Segundo herói'}
              <select
                id={`${id}-sel-${lado}`}
                className="min-h-11 rounded-full border border-borda bg-superficie-2 px-4 font-normal"
                value={heroi.slug}
                onChange={(e) => escolher(lado, e.target.value)}
              >
                {herois.map((h) => (
                  <option key={h.slug} value={h.slug}>
                    {h.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-4">
              <Emblema emblema={heroi.emblema} cor={heroi.cor} tamanho={72} />
              <h2 id={`${id}-${lado}`} className="font-titulo text-2xl">
                {heroi.nome}
              </h2>
            </div>
            {resultado.linhas.map((l) => (
              <BarraAtributo
                key={`${heroi.slug}-${l.chave}`}
                rotulo={l.rotulo}
                valor={lado === 'a' ? l.a : l.b}
                cor={heroi.cor}
                destaque={l.vence === heroi.slug}
              />
            ))}
            <p className="font-titulo text-lg">
              Total: {lado === 'a' ? resultado.totalA : resultado.totalB}/40
            </p>
          </section>
        ))}
      </div>

      <p
        role="status"
        className="rounded-g border border-acento bg-superficie p-6 text-center font-titulo text-xl"
      >
        {vencedor
          ? `${vencedor.nome} leva vantagem no total.`
          : a.slug === b.slug
            ? 'Escolha dois heróis diferentes.'
            : 'Empate no total: a diferença está nos detalhes.'}
      </p>
    </div>
  )
}
/* Fim do Comparar. */
