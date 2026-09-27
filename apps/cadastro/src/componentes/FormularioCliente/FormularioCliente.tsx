/*
 * FormularioCliente: React Hook Form validado pelo mesmo esquema Zod da API.
 * Erros do servidor (ex.: e-mail já cadastrado) voltam para o campo certo.
 */
import { esquemaDadosCliente, type Cliente, type DadosCliente } from '@components/contratos'
import { zodResolver } from '@hookform/resolvers/zod'
import { Campo } from '@components/ui'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useSalvarCliente } from '../../dados/consultas'
import { ErroRepositorio } from '../../dados/repositorio'
import styles from './FormularioCliente.module.css'

type Props = {
  cliente?: Cliente
  aoSalvar: (cliente: Cliente, criado: boolean) => void
  aoCancelar: () => void
}

type Campos = keyof DadosCliente

/* Controla o formulário, envia e distribui os erros por campo. */
export function FormularioCliente({ cliente, aoSalvar, aoCancelar }: Props) {
  const id = useId()
  const salvar = useSalvarCliente()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DadosCliente>({
    resolver: zodResolver(esquemaDadosCliente),
    defaultValues: cliente
      ? { nome: cliente.nome, email: cliente.email, idade: cliente.idade }
      : { nome: '', email: '' },
  })

  /* Envia e trata erros de validação e de conflito vindos do repositório. */
  async function enviar(dados: DadosCliente) {
    try {
      const salvo = await salvar.mutateAsync({ id: cliente?.id, dados })
      aoSalvar(salvo, !cliente)
    } catch (erro) {
      if (erro instanceof ErroRepositorio && Object.keys(erro.campos).length) {
        for (const [campo, mensagem] of Object.entries(erro.campos)) {
          setError(campo as Campos, { message: mensagem }, { shouldFocus: true })
        }
        return
      }
      setError('root', {
        message: erro instanceof Error ? erro.message : 'Não foi possível salvar.',
      })
    }
  }

  /* Atributos de acessibilidade de um campo. */
  const acessivel = (campo: Campos) => ({
    'aria-invalid': errors[campo] ? true : undefined,
    'aria-describedby': errors[campo] ? `${id}-${campo}-erro` : undefined,
  })

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(enviar)}
      noValidate
      aria-labelledby={`${id}-titulo`}
    >
      <h2 id={`${id}-titulo`} className={styles.titulo}>
        {cliente ? `Editar ${cliente.nome}` : 'Novo cliente'}
      </h2>
      <Campo rotulo="Nome" htmlFor={`${id}-nome`} erro={errors.nome?.message}>
        <input id={`${id}-nome`} autoComplete="name" {...register('nome')} {...acessivel('nome')} />
      </Campo>
      <Campo rotulo="E-mail" htmlFor={`${id}-email`} erro={errors.email?.message}>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          {...register('email')}
          {...acessivel('email')}
        />
      </Campo>
      <Campo rotulo="Idade" htmlFor={`${id}-idade`} erro={errors.idade?.message}>
        <input
          id={`${id}-idade`}
          type="number"
          inputMode="numeric"
          min={0}
          max={130}
          {...register('idade', { valueAsNumber: true })}
          {...acessivel('idade')}
        />
      </Campo>
      {errors.root ? (
        <p className={styles.erro} role="alert">
          {errors.root.message}
        </p>
      ) : null}
      <div className={styles.botoes}>
        <button type="submit" className={styles.salvar} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : cliente ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        <button type="button" className={styles.cancelar} onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
/* Fim do FormularioCliente. */
