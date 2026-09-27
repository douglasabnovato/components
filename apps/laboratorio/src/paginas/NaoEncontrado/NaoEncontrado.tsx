/*
 * Página 404 do Laboratório (também para lição inexistente).
 */
import { BotaoPilula } from '@components/ui'
import { Link } from 'react-router'

/* Mostra o aviso e o caminho de volta. */
export function NaoEncontrado({ titulo = 'Página não encontrada' }: { titulo?: string }) {
  return (
    <section
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: '1rem',
        padding: '3rem 1rem',
        textAlign: 'center',
      }}
    >
      <h1>{titulo}</h1>
      <p style={{ color: 'var(--texto-suave)' }}>O endereço não existe no Laboratório.</p>
      <BotaoPilula comoFilho>
        <Link to="/">Ver todas as lições</Link>
      </BotaoPilula>
    </section>
  )
}
/* Fim da página 404. */
