/*
 * PainelFiltros: busca, módulo, situação e históricos. Não guarda estado
 * próprio: lê e escreve direto na URL (R4), então a lista filtrada pode ser
 * compartilhada por link e sobrevive ao recarregar a página.
 */
import { SeletorPilula } from '@components/ui'
import { useId } from 'react'
import { useSearchParams } from 'react-router'
import { modulos } from '../../dados/trilha'
import {
  lerFiltros,
  paraParametros,
  temFiltro,
  type Filtros,
  type Situacao,
} from '../../dominio/filtros'
import styles from './PainelFiltros.module.css'

const situacoes: { valor: Situacao; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'pendentes', rotulo: 'Pendentes' },
  { valor: 'assistidos', rotulo: 'Assistidos' },
]

/* Renderiza os controles e atualiza a URL a cada mudança. */
export function PainelFiltros({ controla }: { controla: string }) {
  const [parametros, setParametros] = useSearchParams()
  const filtros = lerFiltros(parametros)
  const id = useId()

  /* Mescla uma mudança nos filtros e grava na URL sem empilhar histórico. */
  function mudar(parcial: Partial<Filtros>) {
    setParametros(paraParametros({ ...filtros, ...parcial }), { replace: true })
  }

  return (
    <search className={styles.painel} aria-label="Filtros da trilha">
      <div className={styles.busca}>
        <label htmlFor={`${id}-busca`}>Buscar na trilha</label>
        <input
          id={`${id}-busca`}
          type="search"
          placeholder="Título, assunto ou autor"
          value={filtros.busca}
          onChange={(e) => mudar({ busca: e.target.value })}
          aria-controls={controla}
        />
      </div>
      <div className={styles.modulo}>
        <label htmlFor={`${id}-modulo`}>Módulo</label>
        <select
          id={`${id}-modulo`}
          value={filtros.modulo ?? ''}
          onChange={(e) => mudar({ modulo: e.target.value ? Number(e.target.value) : null })}
          aria-controls={controla}
        >
          <option value="">Todos os módulos</option>
          {modulos.map((m) => (
            <option key={m.numero} value={m.numero}>
              {m.numero}. {m.titulo}
            </option>
          ))}
        </select>
      </div>
      <SeletorPilula
        rotulo="Situação"
        opcoes={situacoes}
        valor={filtros.situacao}
        aoMudar={(situacao) => mudar({ situacao })}
        controla={controla}
      />
      <label className={styles.historicos}>
        <input
          type="checkbox"
          checked={filtros.semHistoricos}
          onChange={(e) => mudar({ semHistoricos: e.target.checked })}
        />
        Esconder históricos
      </label>
      {temFiltro(filtros) ? (
        <button
          type="button"
          className={styles.limpar}
          onClick={() => setParametros({}, { replace: true })}
        >
          Limpar filtros
        </button>
      ) : null}
    </search>
  )
}
/* Fim do PainelFiltros. */
