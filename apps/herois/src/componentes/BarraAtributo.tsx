/*
 * BarraAtributo: valor de 1 a 10 como barra que cresce ao aparecer (Motion),
 * com o número visível e um rótulo acessível.
 */
import { motion } from 'motion/react'

type Props = { rotulo: string; valor: number; cor: string; destaque?: boolean }

/* Renderiza rótulo, barra e número. */
export function BarraAtributo({ rotulo, valor, cor, destaque = false }: Props) {
  return (
    <div className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3">
      <span className="text-sm text-suave">{rotulo}</span>
      <div
        className="h-3 overflow-hidden rounded-full bg-superficie-2"
        role="meter"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={valor}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: cor }}
          initial={{ width: 0 }}
          whileInView={{ width: `${valor * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span
        className={['text-right font-codigo', destaque ? 'font-bold text-acento' : ''].join(' ')}
      >
        {valor}
      </span>
    </div>
  )
}
/* Fim da BarraAtributo. */
