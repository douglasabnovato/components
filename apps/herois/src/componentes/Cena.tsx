/*
 * Cena do topo: ilustração original em camadas (céu, serra, cidade e mangue).
 * Cada camada se move numa velocidade com a rolagem (parallax); com movimento
 * reduzido, o MotionConfig do Layout desliga o efeito.
 */
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/* Desenha as camadas e liga cada uma ao progresso da rolagem. */
export function Cena() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fundo = useTransform(scrollYProgress, [0, 1], [0, 40])
  const meio = useTransform(scrollYProgress, [0, 1], [0, 90])
  const frente = useTransform(scrollYProgress, [0, 1], [0, 150])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1435" />
            <stop offset="0.6" stopColor="#5b2a4a" />
            <stop offset="1" stopColor="#e8763d" />
          </linearGradient>
        </defs>
        <rect width="1200" height="520" fill="url(#ceu)" />
        <circle cx="900" cy="170" r="70" fill="#ffd166" opacity="0.9" />
      </svg>
      <motion.svg
        style={{ y: fundo }}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 330l140-90 110 60 160-120 150 110 120-70 180 100 150-80 190 90v190H0z"
          fill="#3a1f3d"
        />
      </motion.svg>
      <motion.svg
        style={{ y: meio }}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="#241530">
          <rect x="640" y="250" width="50" height="270" />
          <rect x="700" y="210" width="70" height="310" />
          <rect x="780" y="270" width="40" height="250" />
          <rect x="830" y="190" width="60" height="330" />
          <rect x="900" y="240" width="80" height="280" />
          <rect x="990" y="280" width="50" height="240" />
        </g>
        <g fill="#ffd166" opacity="0.5">
          <rect x="712" y="230" width="8" height="8" />
          <rect x="740" y="260" width="8" height="8" />
          <rect x="850" y="220" width="8" height="8" />
          <rect x="920" y="270" width="8" height="8" />
          <rect x="946" y="300" width="8" height="8" />
        </g>
      </motion.svg>
      <motion.svg
        style={{ y: frente }}
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 420c120-30 220-10 330 10s240 20 380-10 330-30 490 0v100H0z" fill="#120b1c" />
        <g stroke="#120b1c" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M120 430c0-40 10-70 30-90M150 340c-20-10-40-10-60 0M150 340c10-20 30-30 50-30" />
          <path d="M260 440c0-50 14-80 36-104M296 336c-24-6-44 0-60 12M296 336c14-18 34-24 56-22" />
        </g>
      </motion.svg>
      <div className="absolute inset-0 bg-gradient-to-t from-fundo via-fundo/40 to-transparent" />
    </div>
  )
}
/* Fim da Cena. */
