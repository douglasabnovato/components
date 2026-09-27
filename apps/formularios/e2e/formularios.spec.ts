/*
 * Ponta a ponta: o mesmo roteiro roda com e sem JavaScript. Sem JS, cada
 * envio é um POST comum e a página volta do servidor com os erros.
 */
import { expect, test } from '@playwright/test'

test('mostra erros do servidor e envia a mensagem', async ({ page }) => {
  await page.goto('contato')
  await page.getByRole('button', { name: 'Enviar mensagem' }).click()
  await expect(page.getByRole('alert')).toContainText('Corrija 4 campos')
  await expect(page.getByText('Escolha um assunto.', { exact: true })).toBeVisible()

  await page.getByLabel('Nome', { exact: true }).fill('Ana Lima')
  await page.getByLabel('E-mail', { exact: true }).fill('ana@exemplo.com')
  await page.getByLabel('Assunto').selectOption('duvida')
  await page
    .getByLabel('Mensagem', { exact: true })
    .fill('Mensagem enviada pelo teste de ponta a ponta.')
  await page.getByRole('button', { name: 'Enviar mensagem' }).click()

  await expect(page.getByRole('heading', { name: 'Mensagem recebida.' })).toBeVisible()
  await expect(page).toHaveURL(/contato\/enviado\?protocolo=MSG-\d{4}/)
})

test('indica o modo de funcionamento', async ({ page, javaScriptEnabled }) => {
  await page.goto('')
  const texto = javaScriptEnabled
    ? 'Com JavaScript: envio sem recarregar'
    : 'Sem JavaScript: HTML puro do servidor'
  await expect(page.getByText(texto)).toBeVisible()
})

test('responde 404 dentro do layout', async ({ page }) => {
  const resposta = await page.goto('nada-aqui')
  expect(resposta?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})
/* Fim dos testes de ponta a ponta. */
