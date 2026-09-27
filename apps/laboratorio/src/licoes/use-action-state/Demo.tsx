/*
 * Demo: useActionState e useFormStatus (React 19). O formulário chama uma
 * ação assíncrona; o React cuida do "pendente", do resultado e do reset,
 * sem useState para loading nem useEffect.
 */
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import estilos from '../demo.module.css'
import { estadoInicial, inscrever } from './inscricao'

/* Botão que sabe, sozinho, se o formulário está sendo enviado. */
function BotaoEnviar() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={estilos.botao} disabled={pending}>
      {pending ? 'Inscrevendo…' : 'Inscrever'}
    </button>
  )
}

/* Liga o formulário à ação e mostra o resultado. */
export default function Demo() {
  const [estado, acao] = useActionState(inscrever, estadoInicial)
  return (
    <form action={acao} className={estilos.caixa}>
      <label className={estilos.campo}>
        E-mail
        <input name="email" type="email" required={false} />
      </label>
      <BotaoEnviar />
      {estado.mensagem ? (
        <p role="status" className={estado.erro ? estilos.erro : estilos.sucesso}>
          {estado.mensagem}
        </p>
      ) : null}
      <p className={estilos.suave}>Inscritos: {estado.inscritos.length}</p>
    </form>
  )
}
/* Fim da demo. */
