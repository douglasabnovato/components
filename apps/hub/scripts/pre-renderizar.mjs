/*
 * Pré-renderização do hub (#36), depois do vite build. Faz duas coisas no
 * dist/index.html:
 * 1. Coloca dentro do <div id="raiz"> o HTML inicial do App, gerado pela
 *    entrada SSR (dist-ssr/pre-renderizar.js). O título pinta sem JavaScript.
 * 2. Troca o <script type="module"> do <head> por um carregador no fim do
 *    <body> que só pede o JavaScript depois da primeira pintura. Assim o
 *    download e a execução do React não disputam com o CSS e as fontes do
 *    topo, e o main.tsx hidrata o HTML que já está na tela.
 * Apaga dist-ssr ao final.
 * Uso: vite build && vite build --ssr src/pre-renderizar.tsx --outDir dist-ssr && node scripts/pre-renderizar.mjs
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const pastaSsr = join(raiz, 'dist-ssr')
const caminhoHtml = join(raiz, 'dist', 'index.html')
const marcador = '<div id="raiz"></div>'
const scriptModulo = /\s*<script type="module" crossorigin src="([^"]+)"><\/script>/

function falhar(mensagem) {
  console.error(mensagem)
  rmSync(pastaSsr, { recursive: true, force: true })
  process.exit(1)
}

const { renderizar } = await import(pathToFileURL(join(pastaSsr, 'pre-renderizar.js')).href)
let html = readFileSync(caminhoHtml, 'utf8')
if (!html.includes(marcador)) falhar(`dist/index.html sem ${marcador}: rode o vite build antes.`)

const corpo = renderizar()
if (!corpo.includes('id="topo-titulo"')) falhar('A pré-renderização não gerou o título do topo.')
html = html.replace(marcador, () => `<div id="raiz">${corpo}</div>`)

const achado = html.match(scriptModulo)
if (!achado) falhar('dist/index.html sem o <script type="module"> do Vite.')
const src = achado[1]
html = html.replace(scriptModulo, '')

/* Espera a primeira pintura com conteúdo (entrada first-contentful-paint) e
   pede o JavaScript logo depois. Sem o tipo 'paint' no PerformanceObserver, usa o par
   requestAnimationFrame + setTimeout. A espera de 3 s cobre a aba aberta em
   segundo plano, onde não há pintura. */
const carregador = `<script>
      (function () {
        var feito = false
        function carregar() {
          if (feito) return
          feito = true
          var s = document.createElement('script')
          s.type = 'module'
          s.crossOrigin = ''
          s.src = ${JSON.stringify(src)}
          document.head.appendChild(s)
        }
        function depois() { setTimeout(carregar, 0) }
        var tipos = window.PerformanceObserver && PerformanceObserver.supportedEntryTypes
        if (tipos && tipos.indexOf('paint') >= 0) {
          new PerformanceObserver(function (lista) {
            if (lista.getEntriesByName('first-contentful-paint').length) depois()
          }).observe({ type: 'paint', buffered: true })
        } else {
          requestAnimationFrame(depois)
        }
        setTimeout(carregar, 3000)
      })()
    </script>
  </body>`
html = html.replace('</body>', () => carregador)

writeFileSync(caminhoHtml, html)
rmSync(pastaSsr, { recursive: true, force: true })
console.log(
  `dist/index.html pré-renderizado (${(corpo.length / 1024).toFixed(1)} KB de HTML); ${src} carrega depois da primeira pintura.`,
)
/* Fim da pré-renderização. */
