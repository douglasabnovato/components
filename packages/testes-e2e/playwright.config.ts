/*
 * Playwright do ecossistema. Sem URL_BASE, sobe a API, o hub e os 8 filhos em
 * modo de desenvolvimento, nas portas do mapa do ecossistema (fonte única).
 * Com URL_BASE, não sobe nada e testa o endereço informado: o site publicado
 * (T-05) ou o ensaio de produção local (pnpm ensaio:producao).
 * Antes da primeira vez: pnpm --filter @components/testes-e2e exec playwright install chromium.
 */
import { ecossistema, PORTA_API } from '@components/ui/ecossistema'
import { defineConfig, devices } from '@playwright/test'

const URL_BASE = process.env.URL_BASE
const naCI = Boolean(process.env.CI)
const executablePath = process.env.CAMINHO_CHROMIUM || undefined

const hub = ecossistema.find((p) => p.numero === 0)
if (!hub) throw new Error('O hub (projeto 0) não está no mapa do ecossistema')

/* Um servidor de desenvolvimento por projeto, mais a API compartilhada. */
function servidoresDeDesenvolvimento() {
  const projetos = ecossistema.map(({ slug, porta, pastaTambemNoDev }) => ({
    command: `pnpm --filter @components/${slug || 'hub'} dev`,
    url: `http://localhost:${porta}/${pastaTambemNoDev ? `${slug}/` : ''}`,
    env: { BROWSER: 'none' },
    reuseExistingServer: !naCI,
    timeout: 120_000,
  }))
  const api = {
    command: 'pnpm --filter @components/api start',
    url: `http://127.0.0.1:${PORTA_API}/saude`,
    reuseExistingServer: !naCI,
    timeout: 120_000,
  }
  return [api, ...projetos]
}

export default defineConfig({
  testDir: './testes',
  fullyParallel: true,
  forbidOnly: naCI,
  retries: naCI ? 1 : 0,
  workers: naCI ? 2 : undefined,
  timeout: 60_000,
  reporter: naCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: URL_BASE ?? `http://localhost:${hub.porta}/`,
    contextOptions: { reducedMotion: 'reduce' },
    launchOptions: { executablePath },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: URL_BASE ? undefined : servidoresDeDesenvolvimento(),
})
/* Fim da configuração do Playwright. */
