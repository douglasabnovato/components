/*
 * Regras comuns para falar com a API compartilhada: quanto tempo esperar,
 * quais respostas significam "servidor fora do ar" e o texto que explica a
 * falha. No site publicado a API passa por um encaminhamento (Vercel → Render);
 * se o servidor não sobe, o pedido fica pendurado ou volta 502, 503 ou 504.
 */

/* Tempo máximo de espera por uma resposta da API antes de mostrar a falha. */
export const PRAZO_API_MS = 15_000

const STATUS_FORA_DO_AR = new Set([502, 503, 504])

/* Diz se o status HTTP vem do encaminhamento, e não da própria API. */
export function statusForaDoAr(status: unknown): boolean {
  return typeof status === 'number' && STATUS_FORA_DO_AR.has(status)
}

/*
 * Texto que explica a falha. Em desenvolvimento, ensina a ligar a API; no
 * site publicado, diz que o servidor da demonstração está fora do ar.
 */
export function explicacaoApiFora(dev = import.meta.env.DEV): string {
  return dev
    ? 'Na raiz do monorepo, rode pnpm dev:api e tente de novo.'
    : 'O servidor desta demonstração está fora do ar no momento. Tente de novo em alguns minutos.'
}
/* Fim das regras da API. */
