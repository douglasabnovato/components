/*
 * Ponto de entrada do Cadastro: fontes, tokens e o App com o roteador do navegador.
 */
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@components/ui/tokens.css'
import './estilos/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'

const raiz = document.getElementById('raiz')
if (!raiz) throw new Error('Elemento #raiz não encontrado no index.html')

createRoot(raiz).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
/* Fim do ponto de entrada. */
