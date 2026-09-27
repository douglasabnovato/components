/*
 * Página 404 do Portal (também usada para herói inexistente).
 */
import { Link } from 'react-router'

/* Mostra o aviso e o caminho de volta. */
export function NaoEncontrado({ titulo = 'Página não encontrada' }: { titulo?: string }) {
  return (
    <section className="grid justify-items-center gap-4 rounded-g border border-dashed border-borda p-12 text-center">
      <h1 className="font-titulo text-3xl">{titulo}</h1>
      <p className="text-suave">Esse endereço não existe no Portal.</p>
      <Link
        to="/"
        className="rounded-full bg-acento px-5 py-2.5 font-bold text-sobre-acento no-underline"
      >
        Ver todos os heróis
      </Link>
    </section>
  )
}
/* Fim da página 404. */
