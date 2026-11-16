/*
 * Medição de uso (D5): o script do GoatCounter só entra no build de produção,
 * fora de navegador automatizado, e o clique em "Abrir <projeto>" é marcado
 * como evento sem dado pessoal.
 */
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChamadaProjeto } from '../componentes/Secao/Secao'
import { projetos } from '../dados/projetos'
import { ENDERECO_CONTAGEM, contarClique, deveMedir, iniciarMedicao } from '../medicao'

const seletor = 'script[data-goatcounter]'

afterEach(() => {
  document.querySelectorAll(seletor).forEach((s) => s.remove())
})

describe('medição de uso', () => {
  it('não carrega em desenvolvimento', () => {
    expect(iniciarMedicao(document, { producao: false, automatizado: false })).toBe(false)
    expect(document.querySelector(seletor)).toBeNull()
  })

  it('não carrega em navegador automatizado, mesmo no build', () => {
    expect(deveMedir({ producao: true, automatizado: true })).toBe(false)
    iniciarMedicao(document, { producao: true, automatizado: true })
    expect(document.querySelector(seletor)).toBeNull()
  })

  it('não carrega nos testes do hub (import.meta.env.PROD falso)', () => {
    iniciarMedicao(document, { producao: import.meta.env.PROD, automatizado: false })
    expect(document.querySelector(seletor)).toBeNull()
  })

  it('carrega uma vez no build de produção, com o endereço do portfólio', () => {
    iniciarMedicao(document, { producao: true, automatizado: false })
    iniciarMedicao(document, { producao: true, automatizado: false })
    const scripts = document.querySelectorAll<HTMLScriptElement>(seletor)
    expect(scripts).toHaveLength(1)
    expect(scripts[0]?.dataset.goatcounter).toBe(ENDERECO_CONTAGEM)
    expect(scripts[0]?.src).toBe('https://gc.zgo.at/count.js')
  })

  it('marca o clique em "Abrir <projeto>" como evento', () => {
    const projeto = projetos.find((p) => p.status === 'publicado')
    if (!projeto) throw new Error('Nenhum projeto publicado nos dados')
    render(<ChamadaProjeto projeto={projeto} />)
    const link = screen.getByRole('link', { name: `Abrir ${projeto.nome}` })
    expect(link).toHaveAttribute('data-evento', `abrir-${projeto.id}`)
    const contador = { count: vi.fn() }
    expect(contarClique(link, contador)).toBe(true)
    expect(contador.count).toHaveBeenCalledWith({
      path: `abrir-${projeto.id}`,
      title: `Abrir ${projeto.nome}`,
      event: true,
    })
  })

  it('não conta clique fora dos botões marcados nem sem o contador', () => {
    const contador = { count: vi.fn() }
    expect(contarClique(document.body, contador)).toBe(false)
    const botao = document.createElement('a')
    botao.dataset.evento = 'abrir-filho-1'
    expect(contarClique(botao, undefined)).toBe(false)
    expect(contador.count).not.toHaveBeenCalled()
  })
})
/* Fim dos testes da medição. */
