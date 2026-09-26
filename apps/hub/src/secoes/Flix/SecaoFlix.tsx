/*
 * Seção 01 · Flix. Referência: carrossel com os slides vizinhos à mostra,
 * paginação em pílulas e abas por categoria com trilho de vídeos.
 * A prévia de cada destaque pode ser "tocada" (barra de progresso).
 */
import { AbasSegmentadas, BotaoPilula, Carrossel } from '@components/ui'
import { useState, type CSSProperties } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoFlix.module.css'

const destaques = [
  {
    categoria: 'Front End',
    titulo: 'Grid e Flexbox na prática',
    duracao: '18 min',
    cores: ['#C8183F', '#5B0B1E'],
  },
  {
    categoria: 'Back End',
    titulo: 'Uma API REST do zero',
    duracao: '24 min',
    cores: ['#1F4FD6', '#0B1A4A'],
  },
  {
    categoria: 'Mobile',
    titulo: 'Layouts que cabem no bolso',
    duracao: '12 min',
    cores: ['#0F7A5A', '#06311F'],
  },
  {
    categoria: 'Front End',
    titulo: 'Hooks sem mistério',
    duracao: '21 min',
    cores: ['#6B2BD9', '#230C4F'],
  },
]

const categorias = [
  {
    id: 'front',
    rotulo: 'Front End',
    videos: [
      ['Componentes acessíveis', '14 min'],
      ['CSS Modules na prática', '09 min'],
      ['Formulários com validação', '16 min'],
    ],
  },
  {
    id: 'back',
    rotulo: 'Back End',
    videos: [
      ['Rotas e validação com Zod', '19 min'],
      ['SQL para quem é do front', '22 min'],
      ['Testes de API', '15 min'],
    ],
  },
  {
    id: 'mobile',
    rotulo: 'Mobile',
    videos: [
      ['Toque, gesto e foco', '11 min'],
      ['Imagens responsivas', '08 min'],
      ['PWA em 10 minutos', '10 min'],
    ],
  },
]

/* Um destaque do carrossel com prévia que alterna entre tocar e parar. */
function Destaque({ item }: { item: (typeof destaques)[number] }) {
  const [tocando, setTocando] = useState(false)
  const estilo = { '--c1': item.cores[0], '--c2': item.cores[1] } as CSSProperties
  return (
    <article className={styles.destaque} style={estilo}>
      <svg
        className={styles.padrao}
        viewBox="0 0 400 240"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="330" cy="40" r="120" fill="rgb(255 255 255 / 0.08)" />
        <circle cx="360" cy="200" r="70" fill="rgb(255 255 255 / 0.06)" />
        <path
          d="M0 200 Q100 150 200 190 T400 170"
          stroke="rgb(255 255 255 / 0.18)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <div className={styles.textoDestaque}>
        <p className={styles.categoria}>
          {item.categoria} · {item.duracao}
        </p>
        <h3 className={styles.tituloDestaque}>{item.titulo}</h3>
        <BotaoPilula variante="claro" aria-pressed={tocando} onClick={() => setTocando((v) => !v)}>
          {tocando ? 'Parar prévia' : 'Assistir prévia'}
        </BotaoPilula>
      </div>
      <div className={styles.progresso} data-tocando={tocando} aria-hidden="true">
        <span />
      </div>
    </article>
  )
}

/* Monta cabeçalho, carrossel de destaques, abas por categoria e rodapé. */
export function SecaoFlix() {
  const p = projeto(1)
  const abas = categorias.map((c) => ({
    id: c.id,
    rotulo: c.rotulo,
    conteudo: (
      <ul className={styles.trilho}>
        {c.videos.map(([titulo, duracao], indice) => (
          <li key={titulo} className={styles.video}>
            <div className={styles.miniatura} data-variacao={indice} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </div>
            <h4 className={styles.tituloVideo}>{titulo}</h4>
            <p className={styles.duracao}>{duracao}</p>
          </li>
        ))}
      </ul>
    ),
  }))

  return (
    <Secao projeto={p}>
      <CabecalhoSecao projeto={p} />
      <Carrossel
        rotulo="Vídeos em destaque"
        variante="espiar"
        largura="min(78%, 56rem)"
        itens={destaques.map((d) => (
          <Destaque key={d.titulo} item={d} />
        ))}
      />
      <div className={styles.categorias}>
        <h3 className={styles.subtitulo}>Por categoria</h3>
        <AbasSegmentadas rotulo="Categorias de vídeo" abas={abas} />
      </div>
      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Flix. */
