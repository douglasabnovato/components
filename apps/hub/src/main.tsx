/*
 * Ponto de entrada do hub: carrega fontes e tokens e monta (ou hidrata) o App.
 */
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/fraunces'
import '@components/ui/tokens.css'
import './estilos/global.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'

const raiz = document.getElementById('raiz')
if (!raiz) throw new Error('Elemento #raiz não encontrado no index.html')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/*
 * No build, o index.html já vem pré-renderizado e este módulo só é pedido
 * depois da primeira pintura (scripts/pre-renderizar.mjs): o React hidrata o
 * HTML que já está na tela (#36). Em desenvolvimento, o #raiz vem vazio e o
 * React monta direto.
 */
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
/* Fim do ponto de entrada. */
