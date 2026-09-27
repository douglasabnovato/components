/*
 * Novo jogo: formulário controlado com hooks puros, validado pelo esquema Zod
 * do domínio. Os erros aparecem ao lado de cada campo e o foco vai para o
 * primeiro campo com problema.
 */
import { Campo, Contador, useAvisos } from '@components/ui'
import { useId, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { usePelada } from '../../dados/estado'
import { criarJogo, validarDataFutura } from '../../dominio/pelada'
import { dataRelativa } from '../../dominio/seed'
import { esquemaNovoJogo, MODALIDADES, type Modalidade } from '../../dominio/tipos'
import styles from './NovoJogo.module.css'

type Erros = Partial<Record<'titulo' | 'data' | 'local' | 'vagas' | 'porTime', string>>

/* Controla os campos, valida e cria o jogo. */
export function NovoJogo() {
  const { despachar, agora, novoId } = usePelada()
  const avisar = useAvisos()
  const navegar = useNavigate()
  const id = useId()
  const formulario = useRef<HTMLFormElement>(null)
  const [titulo, setTitulo] = useState('')
  const [modalidade, setModalidade] = useState<Modalidade>('Society')
  const [data, setData] = useState(() => dataRelativa(agora(), 3, 19))
  const [local, setLocal] = useState('')
  const [vagas, setVagas] = useState(14)
  const [porTime, setPorTime] = useState(7)
  const [erros, setErros] = useState<Erros>({})

  /* Valida com Zod e com a regra de data futura; cria e navega se estiver tudo certo. */
  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const resultado = esquemaNovoJogo.safeParse({ titulo, modalidade, data, local, vagas, porTime })
    const encontrados: Erros = {}
    if (!resultado.success) {
      for (const problema of resultado.error.issues) {
        const campo = problema.path[0] as keyof Erros
        encontrados[campo] ??= problema.message
      }
    }
    const erroData = validarDataFutura(data, agora())
    if (erroData) encontrados.data ??= erroData
    setErros(encontrados)

    const primeiro = Object.keys(encontrados)[0]
    if (primeiro || !resultado.success) {
      formulario.current?.querySelector<HTMLElement>(`[data-campo="${primeiro}"]`)?.focus()
      return
    }
    const jogo = criarJogo(resultado.data, novoId())
    despachar({ tipo: 'criar', jogo })
    avisar({ mensagem: `Jogo "${jogo.titulo}" criado. Compartilhe a lista!` })
    navegar(`/jogo/${jogo.id}`)
  }

  /* Atributos de acessibilidade de um campo com erro. */
  const invalido = (campo: keyof Erros) => ({
    'data-campo': campo,
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `${id}-${campo}-erro` : undefined,
  })

  return (
    <div className={styles.pagina}>
      <header>
        <p className={styles.rotulo}>Novo jogo</p>
        <h1 className={styles.titulo}>Marcar uma pelada</h1>
      </header>
      <form ref={formulario} className={styles.form} onSubmit={enviar} noValidate>
        <Campo rotulo="Nome do jogo" htmlFor={`${id}-titulo`} erro={erros.titulo}>
          <input
            id={`${id}-titulo`}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Society de quinta"
            {...invalido('titulo')}
          />
        </Campo>
        <Campo rotulo="Modalidade" htmlFor={`${id}-modalidade`}>
          <select
            id={`${id}-modalidade`}
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value as Modalidade)}
          >
            {MODALIDADES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Dia e horário" htmlFor={`${id}-data`} erro={erros.data}>
          <input
            id={`${id}-data`}
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            {...invalido('data')}
          />
        </Campo>
        <Campo rotulo="Local" htmlFor={`${id}-local`} erro={erros.local}>
          <input
            id={`${id}-local`}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex.: Quadra do bairro"
            {...invalido('local')}
          />
        </Campo>
        <div className={styles.contadores}>
          <div>
            <Contador rotulo="Vagas" valor={vagas} aoMudar={setVagas} min={4} max={40} />
            {erros.vagas ? (
              <p className={styles.erro} role="alert">
                {erros.vagas}
              </p>
            ) : null}
          </div>
          <div>
            <Contador
              rotulo="Jogadores por time"
              valor={porTime}
              aoMudar={setPorTime}
              min={2}
              max={11}
            />
            {erros.porTime ? (
              <p className={styles.erro} role="alert">
                {erros.porTime}
              </p>
            ) : null}
          </div>
        </div>
        <p className={styles.dica}>
          Com {vagas} vagas e {porTime} por time, o sorteio forma até {Math.floor(vagas / porTime)}{' '}
          {Math.floor(vagas / porTime) === 1 ? 'time' : 'times'}.
        </p>
        <button type="submit" className={styles.enviar}>
          Criar jogo
        </button>
      </form>
    </div>
  )
}
/* Fim do Novo jogo. */
