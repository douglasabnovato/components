/*
 * Auxiliar de acessibilidade para testes: roda o axe-core num contêiner
 * e devolve as violações encontradas (vazio = aprovado).
 */
import axe from 'axe-core'

/* Executa o axe ignorando regras que dependem de layout real (contraste). */
export async function violacoesAxe(container: Element) {
  const resultado = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return resultado.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
}
/* Fim do auxiliar de acessibilidade. */
