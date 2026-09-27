/*
 * Página 404 da Trilha.
 */
import { BotaoPilula } from '@components/ui'
import { Link } from 'react-router'
import { EstadoVazio } from '../../componentes/Estados/Estados'

/* Mostra o aviso e o caminho de volta. */
export function NaoEncontrado() {
  return (
    <EstadoVazio
      nivel="h1"
      titulo="Página não encontrada"
      acoes={
        <BotaoPilula comoFilho>
          <Link to="/">Ir para a trilha</Link>
        </BotaoPilula>
      }
    >
      O endereço não existe nesta trilha.
    </EstadoVazio>
  )
}
/* Fim da página 404. */
