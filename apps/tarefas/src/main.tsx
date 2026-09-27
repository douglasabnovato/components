/*
 * Ponto de entrada das Tarefas: fontes, tokens e o App (store do Redux dentro dele).
 */
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@components/ui/tokens.css'
import './estilos/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const raiz = document.getElementById('raiz')
if (!raiz) throw new Error('Elemento #raiz não encontrado no index.html')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
/* Fim do ponto de entrada. */
