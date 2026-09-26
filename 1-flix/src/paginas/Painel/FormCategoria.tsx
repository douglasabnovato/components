/*
 * Formulário de categoria (nome + cor com indicador de contraste), usado
 * para criar no painel e para editar no diálogo. Valida com Zod e mostra
 * erros de regra (ex.: nome repetido) ao lado do campo.
 */
import { Campo } from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { SeletorCor } from '../../componentes/SeletorCor/SeletorCor'
import { ErroDominio, esquemaCor, type DadosCategoria } from '../../dominio/tipos'
import styles from './Painel.module.css'

const esquema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome da categoria.').max(40, 'Use até 40 caracteres.'),
  cor: esquemaCor,
})

type Props = {
  inicial?: DadosCategoria
  rotuloAcao: string
  aoSalvar: (dados: DadosCategoria) => Promise<void>
  aoCancelar?: () => void
}

/* Controla os campos e converte ErroDominio em erro do campo nome. */
export function FormCategoria({ inicial, rotuloAcao, aoSalvar, aoCancelar }: Props) {
  const id = useId()
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DadosCategoria>({
    resolver: zodResolver(esquema),
    defaultValues: inicial ?? { nome: '', cor: '#C8183F' },
  })

  /* Salva e limpa o formulário de criação; erros de regra voltam para o campo. */
  const enviar = handleSubmit(async (dados) => {
    try {
      await aoSalvar(dados)
      if (!inicial) reset({ nome: '', cor: dados.cor })
    } catch (erro) {
      if (erro instanceof ErroDominio) setError('nome', { message: erro.message })
      else throw erro
    }
  })

  const nome = useWatch({ control, name: 'nome' })
  const cor = useWatch({ control, name: 'cor' })

  return (
    <form className={styles.formCategoria} onSubmit={enviar} noValidate>
      <Campo rotulo="Nome" htmlFor={`${id}-nome`} erro={errors.nome?.message}>
        <input
          id={`${id}-nome`}
          autoComplete="off"
          aria-invalid={Boolean(errors.nome)}
          aria-describedby={errors.nome ? `${id}-nome-erro` : undefined}
          {...register('nome')}
        />
      </Campo>
      <SeletorCor
        id={`${id}-cor`}
        rotulo="Cor"
        valor={cor}
        nomePrevia={nome}
        {...register('cor')}
      />
      <div className={styles.acoesForm}>
        {aoCancelar ? (
          <button type="button" className={styles.botaoSecundario} onClick={aoCancelar}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" className={styles.botaoPrimario} disabled={isSubmitting}>
          {rotuloAcao}
        </button>
      </div>
    </form>
  )
}
/* Fim do FormCategoria. */
