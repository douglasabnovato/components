/*
 * Revelar: envolve um bloco e o faz surgir (opacidade + deslocamento)
 * quando entra na tela. Com movimento reduzido, o MotionConfig anula o efeito.
 */
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  atraso?: number
  className?: string
  como?: 'div' | 'li'
}

/* Aplica a animação de entrada uma única vez. */
export function Revelar({ children, atraso = 0, className, como = 'div' }: Props) {
  const Componente = como === 'li' ? motion.li : motion.div
  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Componente>
  )
}
/* Fim do Revelar. */
