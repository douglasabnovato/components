# verificar.ps1 - roteiro de verificacao automatizada do components (revisao de 27/10/2026).
# Rode no Windows, em PowerShell, a partir de qualquer pasta: o script vai para a raiz do repositorio.
# Para no primeiro erro. Nao apaga nada e nao faz commit.
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -Ensaio
#   powershell -ExecutionPolicy Bypass -File docs\claudeia\verificar.ps1 -UrlBase https://components-dusky-nine.vercel.app/
#
# -Ensaio  : depois das etapas normais, monta publicar/ e pede para voce subir o ensaio em outro terminal.
# -UrlBase : roda o T-01 contra um endereco ja no ar (ensaio local ou site publicado).

param(
  [switch]$Ensaio,
  [string]$UrlBase = ''
)

$ErrorActionPreference = 'Stop'
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..\..'))
$inicio = Get-Date

# Executa uma etapa, explica o que ela faz e para se o comando falhar.
function Invoke-Etapa([string]$Nome, [string]$Explicacao, [scriptblock]$Comando) {
  Write-Host ''
  Write-Host "==> $Nome" -ForegroundColor Cyan
  Write-Host "    $Explicacao" -ForegroundColor DarkGray
  & $Comando
  if ($LASTEXITCODE -ne 0) {
    Write-Host "FALHOU: $Nome (codigo $LASTEXITCODE). Corrija e rode de novo." -ForegroundColor Red
    exit $LASTEXITCODE
  }
  Write-Host "OK: $Nome" -ForegroundColor Green
}

Invoke-Etapa 'Ambiente' 'Mostra as versoes de Node e pnpm. O projeto usa Node 24.22.1 (.node-version) e pnpm 10.28.0.' {
  node --version
  pnpm --version
}

Invoke-Etapa 'Instalacao reprodutivel' 'pnpm install --frozen-lockfile: falha se o pnpm-lock.yaml estiver desatualizado, igual ao CI, a Vercel e o Render.' {
  pnpm install --frozen-lockfile
}

Invoke-Etapa 'Verificacao completa' 'pnpm verificar: lint, tipos, testes unitarios e de componente (Vitest) e build de todos os projetos.' {
  pnpm verificar
}

Invoke-Etapa 'Chromium do Playwright' 'Instala o navegador usado pelos testes de navegador. So baixa na primeira vez.' {
  pnpm --filter @components/testes-e2e exec playwright install chromium
}

$urlAnterior = $env:URL_BASE
Remove-Item Env:URL_BASE -ErrorAction SilentlyContinue

Invoke-Etapa 'Navegacao do ecossistema (T-01)' 'pnpm test:navegacao: sobe API, hub e 8 filhos nas portas de desenvolvimento e confere hub <-> filhos sem erro de console. Leva cerca de 2 min.' {
  pnpm test:navegacao
}

Invoke-Etapa 'Ponta a ponta do Formularios' 'pnpm test:e2e: compila o Formularios, sobe o SSR na porta 4174 e testa o envio com e sem JavaScript.' {
  pnpm test:e2e
}

if ($Ensaio) {
  Invoke-Etapa 'Montar publicar/' 'node scripts/montar-publicacao.mjs (via pnpm montar:publicacao): junta o hub e os filhos como ficam na Vercel. O build ja foi feito pelo pnpm verificar.' {
    pnpm montar:publicacao
  }
  Write-Host ''
  Write-Host 'Agora abra OUTRO terminal na raiz e rode: pnpm ensaio:producao' -ForegroundColor Yellow
  Write-Host 'Quando aparecer "Servidor do components em http://localhost:3333", volte aqui e tecle Enter.' -ForegroundColor Yellow
  [void](Read-Host)
  if (-not $UrlBase) { $UrlBase = 'http://localhost:3333/' }
}

if ($UrlBase) {
  $env:URL_BASE = $UrlBase
  try {
    Invoke-Etapa "T-01 contra $UrlBase" 'Com URL_BASE o Playwright nao sobe servidores e testa o endereco informado. No site publicado, acorde o Render antes abrindo /api/saude.' {
      pnpm test:navegacao
    }
  } finally {
    Remove-Item Env:URL_BASE -ErrorAction SilentlyContinue
  }
}

if ($urlAnterior) { $env:URL_BASE = $urlAnterior }
$duracao = [int]((Get-Date) - $inicio).TotalSeconds
Write-Host ''
Write-Host "Tudo verde em $duracao s." -ForegroundColor Green
# Fim do verificar.ps1.
