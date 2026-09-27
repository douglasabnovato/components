/*
 * Página 404 do Cadastro.
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
          <Link to="/">Ver clientes</Link>
        </BotaoPilula>
      }
    >
      O endereço não existe no Cadastro.
    </EstadoVazio>
  )
}
/* Fim da página 404. */
