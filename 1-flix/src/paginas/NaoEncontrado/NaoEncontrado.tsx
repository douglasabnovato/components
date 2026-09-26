/*
 * Página 404 do Flix com caminho de volta.
 */
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { LinkPilula } from '../../componentes/LinkPilula/LinkPilula'

/* Informa que a página não existe e oferece a Início. */
export function NaoEncontrado({ titulo = 'Página não encontrada' }: { titulo?: string }) {
  return (
    <EstadoVazio titulo={titulo} acoes={<LinkPilula to="/">Ir para a Início</LinkPilula>}>
      O endereço pode ter mudado ou o vídeo foi excluído.
    </EstadoVazio>
  )
}
/* Fim da página 404. */
