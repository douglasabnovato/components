# Coleta informações do monorepo para o diagnóstico de MVP (somente leitura; ignora segredos)
$saida = "diagnostico-components.txt"
$ignorar = '\\node_modules\\|\\dist\\|\\\.git\\|\\build\\|\\\.react-router\\|\\coverage\\|\\\.env'

function Secao($titulo) { "`n==================== $titulo ====================" }

& {
  Secao "VERSOES"
  "node: $(node --version)"; "pnpm: $(pnpm --version)"

  Secao "GIT"
  git branch --show-current
  git remote get-url origin
  git branch -a
  git log --oneline -20
  git status --short

  Secao "ESTRUTURA (3 niveis)"
  Get-ChildItem -Recurse -Directory -Depth 2 |
    Where-Object { $_.FullName -notmatch $ignorar } |
    ForEach-Object { $_.FullName.Replace((Get-Location).Path, '.') }

  Secao "ARQUIVOS DA RAIZ"
  foreach ($f in 'pnpm-workspace.yaml','.npmrc','.gitattributes','.node-version','.nvmrc','tsconfig.json','eslint.config.js','.prettierrc','.prettierignore') {
    if (Test-Path $f) { "--- $f"; Get-Content $f }
  }

  Secao "WORKFLOWS DE CI"
  if (Test-Path .github/workflows) {
    Get-ChildItem .github/workflows -File | ForEach-Object { "--- $($_.Name)"; Get-Content $_.FullName }
  } else { "(nenhum workflow)" }

  Secao "PACKAGE.JSON DOS PROJETOS"
  Get-ChildItem -Recurse -Filter package.json |
    Where-Object { $_.FullName -notmatch $ignorar -and $_.DirectoryName -ne (Get-Location).Path } |
    ForEach-Object { "--- $($_.FullName.Replace((Get-Location).Path, '.'))"; Get-Content $_.FullName }

  Secao "CODIGO E TESTES POR PROJETO"
  $projetos = @(Get-ChildItem apps, packages -Directory) + @(Get-Item 1-flix -ErrorAction SilentlyContinue)
  foreach ($p in $projetos) {
    $arqs = Get-ChildItem $p.FullName -Recurse -File -Include *.ts,*.tsx,*.mdx,*.css |
            Where-Object { $_.FullName -notmatch $ignorar }
    $testes = $arqs | Where-Object { $_.Name -match '\.(test|spec)\.' }
    $linhas = ($arqs | Get-Content | Measure-Object -Line).Lines
    "{0,-14} arquivos: {1,4}   testes: {2,3}   linhas: {3,6}" -f $p.Name, $arqs.Count, $testes.Count, $linhas
  }

  Secao "PNPM VERIFICAR (ultimas 120 linhas)"
  pnpm verificar 2>&1 | Select-Object -Last 120

  Secao "DEPENDENCIAS DESATUALIZADAS"
  pnpm outdated -r 2>&1 | Select-Object -First 80

  Secao "VULNERABILIDADES"
  pnpm audit 2>&1 | Select-Object -Last 40
} *>&1 | Out-File -Encoding utf8 $saida

"Pronto: $saida"
