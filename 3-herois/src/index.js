import React from 'react'
import ReactDOM from 'react-dom' 
import {createRoot} from 'react-dom/client';
import {StrictMode} from 'react';

import App from './App'

import GlobalStyle from './assets/styles/global-style'
import { ThemeProvider } from 'styled-components'
import { media } from './assets/styles/media'

const theme = {
  primary: '#202020',
  secondary: '#393939'
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); 

root.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider
      theme={{
        ...theme,
        ...media
      }}
    >
      <App />
    </ThemeProvider>
  </StrictMode>,
);
 