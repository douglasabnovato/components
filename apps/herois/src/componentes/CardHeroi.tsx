/*
 * CardHeroi: cartão do catálogo com emblema, nome, identidade e equipe.
 * Entra, sai e se reposiciona com animação de layout quando o filtro muda.
 */
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { equipePorSlug } from '../dominio/herois'
import type { Heroi } from '../dominio/tipos'
import { Emblema } from './Emblema'

/* Renderiza o cartão como item de lista animado. */
export function CardHeroi({ heroi }: { heroi: Heroi }) {
  const equipe = equipePorSlug(heroi.equipe)
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="list-none"
    >
      <Link
        to={`/heroi/${heroi.slug}`}
        className="group grid h-full gap-4 rounded-g border border-borda bg-superficie p-6 no-underline transition-colors hover:border-acento"
      >
        <div className="flex items-center gap-4">
          <Emblema
            emblema={heroi.emblema}
            cor={heroi.cor}
            tamanho={56}
            className="transition-transform group-hover:rotate-6"
          />
          <div>
            <h3 className="font-titulo text-xl">{heroi.nome}</h3>
            <p className="text-sm text-suave">{heroi.identidade}</p>
          </div>
        </div>
        <p className="text-suave">{heroi.resumo}</p>
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span
            className="size-2.5 rounded-full"
            style={{ background: equipe?.cor }}
            aria-hidden="true"
          />
          {equipe?.nome}
        </p>
      </Link>
    </motion.li>
  )
}
/* Fim do CardHeroi. */
