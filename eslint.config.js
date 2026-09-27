/*
 * Configuração única do ESLint para todo o monorepo (flat config). As pastas
 * antigas (2 a 7) ficam fora: são só referência. As rotas do modo framework do
 * React Router podem exportar loader, action e meta junto do componente.
 */
import js from '@eslint/js'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/build/**',
      '**/.react-router/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '_referencia/**',
      '2-cadastro/**',
      '3-herois/**',
      '4-servidor/**',
      '5-tarefas/**',
      '6-pelada/**',
      '7-laboratorio/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: ['pre'], roles: ['tabpanel'] }],
    },
  },
  {
    files: ['apps/formularios/app/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: ['meta', 'links', 'loader', 'action', 'Layout', 'ErrorBoundary'],
        },
      ],
    },
  },
)
/* Fim da configuração do ESLint. */
