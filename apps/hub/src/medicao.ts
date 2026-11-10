/*
 * Medição de uso do hub (critério 5, decisão D5 de 10/11/2026): GoatCounter,
 * sem cookie e sem dado pessoal. Conta o caminho da visita e, como evento, o
 * clique em "Abrir <projeto>" (atributo data-evento). O clique é ouvido no
 * documento, porque as seções do hub entram depois do script (carregamento sob
 * demanda) e o data-goatcounter-click só vale para o que já está na tela. Só carrega
 * no build de produção e fora de navegador automatizado (Playwright), para
 * não contar desenvolvimento nem testes. A conta `douglasabnovato` é do
 * responsável; sem ela, o script carrega e os envios não são registrados.
 */
export const ENDERECO_CONTAGEM = 'https://douglasabnovato.goatcounter.com/count'
export const SCRIPT_CONTAGEM = 'https://gc.zgo.at/count.js'

type Ambiente = { producao: boolean; automatizado: boolean }

type Contador = { count: (dados: { path: string; title?: string; event: boolean }) => void }

/* Envia o evento do elemento clicado, se ele (ou um ancestral) tiver data-evento. */
export function contarClique(alvo: EventTarget | null, contador: Contador | undefined) {
  if (!(alvo instanceof Element) || !contador) return false
  const elemento = alvo.closest<HTMLElement>('[data-evento]')
  const nome = elemento?.dataset.evento
  if (!nome) return false
  contador.count({ path: nome, title: elemento.textContent?.trim(), event: true })
  return true
}

/* Diz se a visita deve ser contada. */
export function deveMedir({ producao, automatizado }: Ambiente) {
  return producao && !automatizado
}

/* Acrescenta o script do GoatCounter uma única vez, se a visita deve ser contada. */
export function iniciarMedicao(documento: Document, ambiente: Ambiente) {
  if (!deveMedir(ambiente)) return false
  if (documento.querySelector('script[data-goatcounter]')) return true
  documento.addEventListener('click', (evento) => {
    const janela = documento.defaultView as (Window & { goatcounter?: Contador }) | null
    contarClique(evento.target, janela?.goatcounter)
  })
  const script = documento.createElement('script')
  script.async = true
  script.src = SCRIPT_CONTAGEM
  script.dataset.goatcounter = ENDERECO_CONTAGEM
  documento.body.appendChild(script)
  return true
}
/* Fim da medição. */
