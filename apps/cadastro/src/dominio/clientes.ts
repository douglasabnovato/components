/*
 * Clientes de exemplo do repositório em memória (os mesmos da API) e
 * utilitários de exibição usados pela tela e pelo hub.
 */
import type { Cliente, OrdemCliente } from '@components/contratos'

/* Lista inicial, recriada a cada chamada para não compartilhar referências. */
export function clientesIniciais(): Cliente[] {
  return [
    {
      id: 'm-1',
      nome: 'Ana Ribeiro',
      email: 'ana.ribeiro@exemplo.com',
      idade: 34,
      criadoEm: '2026-09-01T10:00:00.000Z',
    },
    {
      id: 'm-2',
      nome: 'Bruno Costa',
      email: 'bruno.costa@exemplo.com',
      idade: 27,
      criadoEm: '2026-09-02T10:00:00.000Z',
    },
    {
      id: 'm-3',
      nome: 'Carla Souza',
      email: 'carla.souza@exemplo.com',
      idade: 45,
      criadoEm: '2026-09-03T10:00:00.000Z',
    },
    {
      id: 'm-4',
      nome: 'Diego Lima',
      email: 'diego.lima@exemplo.com',
      idade: 31,
      criadoEm: '2026-09-04T10:00:00.000Z',
    },
  ]
}

export const rotulosOrdem: Record<OrdemCliente, string> = {
  nome: 'Nome (A–Z)',
  idade: 'Idade (menor primeiro)',
  recentes: 'Mais recentes',
}

/* Iniciais para o avatar: "Ana Ribeiro" → "AR". */
export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/)
  return (
    (partes[0]?.[0] ?? '') + (partes.length > 1 ? (partes.at(-1)?.[0] ?? '') : '')
  ).toUpperCase()
}
/* Fim dos clientes de exemplo. */
