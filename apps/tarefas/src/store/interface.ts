/*
 * Fatia de interface (createSlice): o texto do campo, o padrão de busca
 * aplicado e a situação escolhida. É estado do cliente, separado do estado
 * do servidor, que fica no RTK Query.
 */
import { SITUACOES_TAREFA, validarPadrao, type SituacaoTarefa } from '@components/contratos'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type EstadoInterface = {
  texto: string
  busca: string
  situacao: SituacaoTarefa
  erroBusca: string
}

const inicial: EstadoInterface = { texto: '', busca: '', situacao: 'todas', erroBusca: '' }

export const interfaceSlice = createSlice({
  name: 'interface',
  initialState: inicial,
  reducers: {
    textoMudou(estado, acao: PayloadAction<string>) {
      estado.texto = acao.payload
    },
    buscar(estado) {
      const padrao = estado.texto.trim()
      const erro = padrao ? validarPadrao(padrao) : null
      estado.erroBusca = erro ?? ''
      if (!erro) estado.busca = padrao
    },
    limpar(estado) {
      estado.texto = ''
      estado.busca = ''
      estado.erroBusca = ''
    },
    situacaoMudou(estado, acao: PayloadAction<SituacaoTarefa>) {
      if (SITUACOES_TAREFA.includes(acao.payload)) estado.situacao = acao.payload
    },
  },
})

export const { textoMudou, buscar, limpar, situacaoMudou } = interfaceSlice.actions
/* Fim da fatia de interface. */
