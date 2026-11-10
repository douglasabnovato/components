/*
 * Medição de uso do hub (critério 5, decisão D5 de 10/11/2026): GoatCounter,
 * sem cookie e sem dado pessoal. Conta o caminho da visita e, como evento, o
 * clique em "Abrir <projeto>" (atributo data-goatcounter-click). Só carrega
 * no build de produção e fora de navegador automatizado (Playwright), para
 * não contar desenvolvimento nem testes. A conta `douglasabnovato` é do
 * responsável; sem ela, o script carrega e os envios não são registrados.
 */
export const ENDERECO_CONTAGEM = 'https://douglasabnovato.goatcounter.com/count'
export const SCRIPT_CONTAGEM = 'https://gc.zgo.at/count.js'

type Ambiente = { producao: boolean; automatizado: boolean }

/* Diz se a visita deve ser contada. */
export function deveMedir({ producao, automatizado }: Ambiente) {
  return producao && !automatizado
}

/* Acrescenta o script do GoatCounter uma única vez, se a visita deve ser contada. */
export function iniciarMedicao(documento: Document, ambiente: Ambiente) {
  if (!deveMedir(ambiente)) return false
  if (documento.querySelector('script[data-goatcounter]')) return true
  const script = documento.createElement('script')
  script.async = true
  script.src = SCRIPT_CONTAGEM
  script.dataset.goatcounter = ENDERECO_CONTAGEM
  documento.body.appendChild(script)
  return true
}
/* Fim da medição. */
