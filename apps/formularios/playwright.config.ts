/*
 * Playwright: sobe o build de produção (react-router-serve na porta 4174) e
 * roda os testes de ponta a ponta em dois projetos, com e sem JavaScript.
 * Movimento reduzido desliga a rolagem suave dos tokens, que atrapalha os cliques.
 * Antes da primeira vez: pnpm exec playwright install chromium.
 */
import { defineConfig, devices } from '@playwright/test'

const executablePath = process.env.CAMINHO_CHROMIUM || undefined

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4174/formularios/',
    contextOptions: { reducedMotion: 'reduce' },
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'sem-javascript', use: { ...devices['Desktop Chrome'], javaScriptEnabled: false } },
    { name: 'com-javascript', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:4174/formularios/',
    env: { PORT: '4174' },
    reuseExistingServer: true,
  },
})
/* Fim da configuração do Playwright. */
