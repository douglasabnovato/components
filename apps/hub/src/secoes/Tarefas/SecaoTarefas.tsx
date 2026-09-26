/*
 * Seção 05 · Tarefas. Referência: faixa de imagem no topo com um formulário
 * sobreposto (padrão de reserva) e uma grade com card de destaque e cards
 * menores com etiqueta. Regra herdada do todo-app: só exclui o que foi concluído.
 */
import { BarraWidget, Campo, CardEtiqueta, Contador } from '@components/ui'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoTarefas.module.css'

type Prioridade = 'Alta' | 'Média' | 'Baixa'

type Tarefa = {
  id: number
  titulo: string
  prioridade: Prioridade
  estimativa: number
  concluida: boolean
}

const cores: Record<Prioridade, string> = { Alta: '#C8183F', Média: '#9A4A06', Baixa: '#0E7490' }

const iniciais: Tarefa[] = [
  {
    id: 4,
    titulo: 'Revisar o fluxo de cadastro',
    prioridade: 'Alta',
    estimativa: 3,
    concluida: false,
  },
  {
    id: 3,
    titulo: 'Escrever testes da busca',
    prioridade: 'Média',
    estimativa: 2,
    concluida: false,
  },
  { id: 2, titulo: 'Publicar a versão 0.1', prioridade: 'Baixa', estimativa: 1, concluida: true },
  {
    id: 1,
    titulo: 'Configurar o banco local',
    prioridade: 'Média',
    estimativa: 2,
    concluida: true,
  },
]

const LIMITE = 4

/* Ilustração do card: prancheta na cor da prioridade. */
function MidiaTarefa({ tarefa }: { tarefa: Tarefa }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="200" fill={cores[tarefa.prioridade]} />
      <circle cx="270" cy="30" r="90" fill="rgb(255 255 255 / 0.1)" />
      <rect x="120" y="40" width="80" height="110" rx="10" fill="rgb(255 255 255 / 0.92)" />
      <rect x="140" y="32" width="40" height="16" rx="6" fill="rgb(255 255 255 / 0.6)" />
      {[70, 92, 114].map((y, i) => (
        <g key={y}>
          <rect
            x="134"
            y={y}
            width="12"
            height="12"
            rx="3"
            fill={i < tarefa.estimativa ? cores[tarefa.prioridade] : '#d9d6cd'}
          />
          <rect x="152" y={y + 3} width="36" height="6" rx="3" fill="#d9d6cd" />
        </g>
      ))}
    </svg>
  )
}

/* Controla o formulário sobreposto e a grade de tarefas. */
export function SecaoTarefas() {
  const p = projeto(5)
  const [tarefas, setTarefas] = useState(iniciais)
  const [titulo, setTitulo] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('Média')
  const [estimativa, setEstimativa] = useState(1)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  /* Valida o título e coloca a nova tarefa em destaque. */
  function adicionar() {
    if (titulo.trim().length === 0) {
      setErro('Dê um título para a tarefa.')
      return
    }
    const nova: Tarefa = {
      id: Date.now(),
      titulo: titulo.trim(),
      prioridade,
      estimativa,
      concluida: false,
    }
    setTarefas((atual) => [nova, ...atual])
    setTitulo('')
    setErro('')
    setAviso(`Tarefa "${nova.titulo}" adicionada.`)
  }

  /* Alterna entre concluída e pendente. */
  function alternar(id: number) {
    setTarefas((atual) => atual.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)))
  }

  /* Exclui somente se a tarefa já estiver concluída. */
  function excluir(tarefa: Tarefa) {
    if (!tarefa.concluida) return
    setTarefas((atual) => atual.filter((t) => t.id !== tarefa.id))
    setAviso(`Tarefa "${tarefa.titulo}" excluída.`)
  }

  const visiveis = tarefas.slice(0, LIMITE)

  return (
    <Secao projeto={p}>
      <CabecalhoSecao projeto={p} />

      <div className={styles.palco}>
        <div className={styles.faixa} aria-hidden="true">
          <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice">
            <rect width="1200" height="320" fill="#0E7490" />
            <circle cx="1040" cy="60" r="200" fill="#22D3EE" opacity="0.35" />
            <circle cx="160" cy="340" r="220" fill="#083344" opacity="0.5" />
            <path d="M0 250 Q300 180 600 240 T1200 210 V320 H0 Z" fill="#083344" opacity="0.6" />
          </svg>
          <p className={styles.frase}>Planeje. Faça. Conclua.</p>
        </div>

        <BarraWidget
          rotulo="Nova tarefa"
          acao="Adicionar"
          aoEnviar={adicionar}
          className={styles.widget}
        >
          <Campo rotulo="Título" htmlFor="tarefa-titulo" erro={erro}>
            <input
              id="tarefa-titulo"
              value={titulo}
              placeholder="Ex.: revisar o layout"
              onChange={(e) => setTitulo(e.target.value)}
              aria-invalid={Boolean(erro)}
              aria-describedby={erro ? 'tarefa-titulo-erro' : undefined}
              autoComplete="off"
            />
          </Campo>
          <Campo rotulo="Prioridade" htmlFor="tarefa-prioridade">
            <select
              id="tarefa-prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as Prioridade)}
            >
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>
          </Campo>
          <Contador
            rotulo="Estimativa"
            unidade="h"
            valor={estimativa}
            min={1}
            max={3}
            aoMudar={setEstimativa}
          />
        </BarraWidget>
      </div>

      <p className="visualmente-oculto" role="status">
        {aviso}
      </p>
      <p id="regra-exclusao" className={styles.regra}>
        Só tarefas concluídas podem ser excluídas · mostrando {visiveis.length} de {tarefas.length}
      </p>

      <ul className={styles.grade}>
        <AnimatePresence initial={false}>
          {visiveis.map((t, indice) => (
            <motion.li
              key={t.id}
              layout
              className={indice === 0 ? styles.destaque : styles.item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardEtiqueta
                destaque={indice === 0}
                titulo={t.titulo}
                etiqueta={t.concluida ? 'Concluída' : `Prioridade ${t.prioridade.toLowerCase()}`}
                descricao={`Estimativa: ${t.estimativa}h`}
                midia={<MidiaTarefa tarefa={t} />}
              >
                <div className={styles.acoes}>
                  <button type="button" onClick={() => alternar(t.id)} aria-pressed={t.concluida}>
                    {t.concluida ? 'Reabrir' : 'Concluir'}{' '}
                    <span className="visualmente-oculto">{t.titulo}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(t)}
                    aria-disabled={!t.concluida}
                    aria-describedby={t.concluida ? undefined : 'regra-exclusao'}
                  >
                    Excluir <span className="visualmente-oculto">{t.titulo}</span>
                  </button>
                </div>
              </CardEtiqueta>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Tarefas. */
