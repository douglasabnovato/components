/*
 * CenaHerois: ilustração original em camadas (céu, lua, cidade ao fundo,
 * prédios à frente e três silhuetas). Cada camada se desloca numa
 * velocidade diferente com a rolagem; com movimento reduzido fica parada.
 */
import { useMovimentoReduzido } from '@components/ui'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import styles from './SecaoHerois.module.css'

const estrelas = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 137) % 1440,
  y: (i * 71) % 420,
  r: (i % 3) + 1,
}))

/* Camada que se move no eixo Y conforme o progresso da rolagem. */
function Camada({
  progresso,
  distancia,
  children,
}: {
  progresso: MotionValue<number>
  distancia: number
  children: ReactNode
}) {
  const y = useTransform(progresso, [0, 1], [distancia * -1, distancia])
  return (
    <motion.svg
      className={styles.camada}
      style={{ y }}
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {children}
    </motion.svg>
  )
}

/* Silhueta de herói com capa, desenhada com formas simples. */
function Silhueta({ x, escala, cor }: { x: number; escala: number; cor: string }) {
  return (
    <g transform={`translate(${x} 520) scale(${escala})`}>
      <path d="M-46 20 Q-70 150 -60 190 L60 190 Q70 150 46 20 Z" fill={cor} opacity="0.9" />
      <path d="M-26 10 L26 10 L34 120 L-34 120 Z" fill="#0B0C10" />
      <circle cx="0" cy="-12" r="20" fill="#0B0C10" />
      <path d="M-34 120 L-22 190 L-6 190 L-4 120 M4 120 L6 190 L22 190 L34 120" fill="#0B0C10" />
      <path d="M-12 40 L0 28 L12 40 L0 56 Z" fill={cor} />
    </g>
  )
}

/* Monta as camadas da cena ligadas à rolagem da seção. */
export function CenaHerois() {
  const ref = useRef<HTMLDivElement>(null)
  const reduzido = useMovimentoReduzido()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const fator = reduzido ? 0 : 1

  return (
    <div ref={ref} className={styles.cena}>
      <Camada progresso={scrollYProgress} distancia={10 * fator}>
        <defs>
          <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E1026" />
            <stop offset="0.7" stopColor="#2A1B4A" />
            <stop offset="1" stopColor="#6B3A2E" />
          </linearGradient>
        </defs>
        <rect width="1440" height="800" fill="url(#ceu)" />
        {estrelas.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill="#FFFFFF"
            opacity={0.25 + (i % 4) * 0.15}
          />
        ))}
      </Camada>
      <Camada progresso={scrollYProgress} distancia={30 * fator}>
        <circle cx="1120" cy="210" r="110" fill="#FFB020" opacity="0.9" />
        <circle cx="1160" cy="190" r="110" fill="#2A1B4A" opacity="0.35" />
      </Camada>
      <Camada progresso={scrollYProgress} distancia={60 * fator}>
        <path
          d="M0 620 V520 h80 v-60 h60 v90 h70 v-140 h90 v110 h60 v-70 h110 v150 h80 v-200 h70 v160 h90 v-90 h120 v120 h80 v-160 h90 v130 h110 v-80 h90 v110 h90 V800 H0 Z"
          fill="#1C1433"
        />
      </Camada>
      <Camada progresso={scrollYProgress} distancia={100 * fator}>
        <path d="M0 800 V690 h260 v-40 h200 v60 h520 v-80 h220 v50 h240 V800 Z" fill="#0B0C10" />
        <Silhueta x={560} escala={0.9} cor="#FFB020" />
        <Silhueta x={720} escala={1.1} cor="#FF5C7A" />
        <Silhueta x={880} escala={0.95} cor="#3DDC97" />
      </Camada>
      <div className={styles.veu} />
    </div>
  )
}
/* Fim da CenaHerois. */
