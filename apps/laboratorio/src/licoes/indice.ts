/*
 * Índice das lições: metadados, texto MDX, demo e o código da demo e do teste
 * lidos como texto (?raw). O código mostrado na tela é o mesmo que roda e o
 * mesmo que é testado, então nunca fica desatualizado.
 */
import DemoComponentesEProps from './componentes-e-props/Demo'
import codigoComponentesEProps from './componentes-e-props/Demo.tsx?raw'
import testeComponentesEProps from './componentes-e-props/demo.test.tsx?raw'
import TextoComponentesEProps from './componentes-e-props/texto.mdx'
import DemoRenderizacaoCondicional from './renderizacao-condicional/Demo'
import codigoRenderizacaoCondicional from './renderizacao-condicional/Demo.tsx?raw'
import testeRenderizacaoCondicional from './renderizacao-condicional/demo.test.tsx?raw'
import TextoRenderizacaoCondicional from './renderizacao-condicional/texto.mdx'
import DemoListasEKeys from './listas-e-keys/Demo'
import codigoListasEKeys from './listas-e-keys/Demo.tsx?raw'
import testeListasEKeys from './listas-e-keys/demo.test.tsx?raw'
import TextoListasEKeys from './listas-e-keys/texto.mdx'
import DemoComunicacao from './comunicacao/Demo'
import codigoComunicacao from './comunicacao/Demo.tsx?raw'
import testeComunicacao from './comunicacao/demo.test.tsx?raw'
import TextoComunicacao from './comunicacao/texto.mdx'
import DemoEstadoElevado from './estado-elevado/Demo'
import codigoEstadoElevado from './estado-elevado/Demo.tsx?raw'
import testeEstadoElevado from './estado-elevado/demo.test.tsx?raw'
import TextoEstadoElevado from './estado-elevado/texto.mdx'
import DemoUseState from './use-state/Demo'
import codigoUseState from './use-state/Demo.tsx?raw'
import testeUseState from './use-state/demo.test.tsx?raw'
import TextoUseState from './use-state/texto.mdx'
import DemoUseEffect from './use-effect/Demo'
import codigoUseEffect from './use-effect/Demo.tsx?raw'
import testeUseEffect from './use-effect/demo.test.tsx?raw'
import TextoUseEffect from './use-effect/texto.mdx'
import DemoUseRef from './use-ref/Demo'
import codigoUseRef from './use-ref/Demo.tsx?raw'
import testeUseRef from './use-ref/demo.test.tsx?raw'
import TextoUseRef from './use-ref/texto.mdx'
import DemoUseMemo from './use-memo/Demo'
import codigoUseMemo from './use-memo/Demo.tsx?raw'
import testeUseMemo from './use-memo/demo.test.tsx?raw'
import TextoUseMemo from './use-memo/texto.mdx'
import DemoUseReducer from './use-reducer/Demo'
import codigoUseReducer from './use-reducer/Demo.tsx?raw'
import testeUseReducer from './use-reducer/demo.test.tsx?raw'
import TextoUseReducer from './use-reducer/texto.mdx'
import DemoUseContext from './use-context/Demo'
import codigoUseContext from './use-context/Demo.tsx?raw'
import testeUseContext from './use-context/demo.test.tsx?raw'
import TextoUseContext from './use-context/texto.mdx'
import DemoHooksProprios from './hooks-proprios/Demo'
import codigoHooksProprios from './hooks-proprios/Demo.tsx?raw'
import testeHooksProprios from './hooks-proprios/demo.test.tsx?raw'
import TextoHooksProprios from './hooks-proprios/texto.mdx'
import DemoRefComoProp from './ref-como-prop/Demo'
import codigoRefComoProp from './ref-como-prop/Demo.tsx?raw'
import testeRefComoProp from './ref-como-prop/demo.test.tsx?raw'
import TextoRefComoProp from './ref-como-prop/texto.mdx'
import DemoUseActionState from './use-action-state/Demo'
import codigoUseActionState from './use-action-state/Demo.tsx?raw'
import testeUseActionState from './use-action-state/demo.test.tsx?raw'
import TextoUseActionState from './use-action-state/texto.mdx'
import DemoUseTransition from './use-transition/Demo'
import codigoUseTransition from './use-transition/Demo.tsx?raw'
import testeUseTransition from './use-transition/demo.test.tsx?raw'
import TextoUseTransition from './use-transition/texto.mdx'
import DemoJogoDaVelha from './jogo-da-velha/Demo'
import codigoJogoDaVelha from './jogo-da-velha/Demo.tsx?raw'
import testeJogoDaVelha from './jogo-da-velha/demo.test.tsx?raw'
import TextoJogoDaVelha from './jogo-da-velha/texto.mdx'
import DemoComponentesDeClasse from './componentes-de-classe/Demo'
import codigoComponentesDeClasse from './componentes-de-classe/Demo.tsx?raw'
import testeComponentesDeClasse from './componentes-de-classe/demo.test.tsx?raw'
import TextoComponentesDeClasse from './componentes-de-classe/texto.mdx'
import type { Licao, Modulo } from './tipos'

export const modulos: Modulo[] = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentos',
    descricao: 'Componentes, props, listas e formulários.',
  },
  { id: 'hooks', titulo: 'Hooks', descricao: 'Do useState aos hooks próprios.' },
  { id: 'react-19', titulo: 'React 18 e 19', descricao: 'Refs como prop, actions e transições.' },
  { id: 'projetos', titulo: 'Projetos guiados', descricao: 'Juntar tudo, e ler código antigo.' },
]

export const licoes: Licao[] = [
  {
    id: 'componentes-e-props',
    modulo: 'fundamentos',
    titulo: 'Componentes e props',
    resumo: 'Peças que se encaixam e recebem dados do pai.',
    simbolo: 'P',
    aprendizados: [5, 8],
    Texto: TextoComponentesEProps,
    Demo: DemoComponentesEProps,
    codigo: codigoComponentesEProps,
    teste: testeComponentesEProps,
  },
  {
    id: 'renderizacao-condicional',
    modulo: 'fundamentos',
    titulo: 'Renderização condicional',
    resumo: 'Mostrar e esconder com ternário, && e retorno antecipado.',
    simbolo: '?',
    aprendizados: [1, 11],
    Texto: TextoRenderizacaoCondicional,
    Demo: DemoRenderizacaoCondicional,
    codigo: codigoRenderizacaoCondicional,
    teste: testeRenderizacaoCondicional,
  },
  {
    id: 'listas-e-keys',
    modulo: 'fundamentos',
    titulo: 'Listas e keys',
    resumo: 'Por que a key certa evita bugs silenciosos.',
    simbolo: 'K',
    aprendizados: [11, 27],
    Texto: TextoListasEKeys,
    Demo: DemoListasEKeys,
    codigo: codigoListasEKeys,
    teste: testeListasEKeys,
  },
  {
    id: 'comunicacao',
    modulo: 'fundamentos',
    titulo: 'Comunicação entre componentes',
    resumo: 'Props descem, funções avisam o pai.',
    simbolo: '↕',
    aprendizados: [5, 11],
    Texto: TextoComunicacao,
    Demo: DemoComunicacao,
    codigo: codigoComunicacao,
    teste: testeComunicacao,
  },
  {
    id: 'estado-elevado',
    modulo: 'fundamentos',
    titulo: 'Formulário controlado e estado elevado',
    resumo: 'Dois campos, uma fonte da verdade.',
    simbolo: '⇄',
    aprendizados: [30, 31, 51],
    Texto: TextoEstadoElevado,
    Demo: DemoEstadoElevado,
    codigo: codigoEstadoElevado,
    teste: testeEstadoElevado,
  },
  {
    id: 'use-state',
    modulo: 'hooks',
    titulo: 'useState',
    resumo: 'Guardar valores que mudam a tela.',
    simbolo: 'S',
    aprendizados: [6, 9],
    Texto: TextoUseState,
    Demo: DemoUseState,
    codigo: codigoUseState,
    teste: testeUseState,
  },
  {
    id: 'use-effect',
    modulo: 'hooks',
    titulo: 'useEffect',
    resumo: 'Sincronizar com o mundo lá fora, com limpeza.',
    simbolo: 'E',
    aprendizados: [7, 12],
    Texto: TextoUseEffect,
    Demo: DemoUseEffect,
    codigo: codigoUseEffect,
    teste: testeUseEffect,
  },
  {
    id: 'use-ref',
    modulo: 'hooks',
    titulo: 'useRef',
    resumo: 'Acessar o DOM e guardar valores sem renderizar.',
    simbolo: 'R',
    aprendizados: [15],
    Texto: TextoUseRef,
    Demo: DemoUseRef,
    codigo: codigoUseRef,
    teste: testeUseRef,
  },
  {
    id: 'use-memo',
    modulo: 'hooks',
    titulo: 'useMemo, useCallback e memo',
    resumo: 'Evitar trabalho repetido, medindo antes.',
    simbolo: 'M',
    aprendizados: [10, 55, 56],
    Texto: TextoUseMemo,
    Demo: DemoUseMemo,
    codigo: codigoUseMemo,
    teste: testeUseMemo,
  },
  {
    id: 'use-reducer',
    modulo: 'hooks',
    titulo: 'useReducer',
    resumo: 'Todas as regras de mudança num só lugar.',
    simbolo: '⚙',
    aprendizados: [42, 43],
    Texto: TextoUseReducer,
    Demo: DemoUseReducer,
    codigo: codigoUseReducer,
    teste: testeUseReducer,
  },
  {
    id: 'use-context',
    modulo: 'hooks',
    titulo: 'useContext',
    resumo: 'Compartilhar sem repassar props, com erro claro.',
    simbolo: 'C',
    aprendizados: [20, 46],
    Texto: TextoUseContext,
    Demo: DemoUseContext,
    codigo: codigoUseContext,
    teste: testeUseContext,
  },
  {
    id: 'hooks-proprios',
    modulo: 'hooks',
    titulo: 'Hooks próprios e regras dos hooks',
    resumo: 'Reaproveitar lógica com estado.',
    simbolo: 'H',
    aprendizados: [11, 13],
    Texto: TextoHooksProprios,
    Demo: DemoHooksProprios,
    codigo: codigoHooksProprios,
    teste: testeHooksProprios,
  },
  {
    id: 'ref-como-prop',
    modulo: 'react-19',
    titulo: 'Ref como prop e useImperativeHandle',
    resumo: 'O pai controla o filho sem forwardRef.',
    simbolo: '↗',
    aprendizados: [16, 98],
    Texto: TextoRefComoProp,
    Demo: DemoRefComoProp,
    codigo: codigoRefComoProp,
    teste: testeRefComoProp,
  },
  {
    id: 'use-action-state',
    modulo: 'react-19',
    titulo: 'useActionState e useFormStatus',
    resumo: 'Formulários com ações assíncronas.',
    simbolo: 'A',
    aprendizados: [91, 99, 100],
    Texto: TextoUseActionState,
    Demo: DemoUseActionState,
    codigo: codigoUseActionState,
    teste: testeUseActionState,
  },
  {
    id: 'use-transition',
    modulo: 'react-19',
    titulo: 'useTransition',
    resumo: 'Separar o urgente do que pode esperar.',
    simbolo: 'T',
    aprendizados: [97, 101],
    Texto: TextoUseTransition,
    Demo: DemoUseTransition,
    codigo: codigoUseTransition,
    teste: testeUseTransition,
  },
  {
    id: 'jogo-da-velha',
    modulo: 'projetos',
    titulo: 'Jogo da velha com histórico',
    resumo: 'Estado mínimo, imutabilidade e volta no tempo.',
    simbolo: '#',
    aprendizados: [3, 14],
    Texto: TextoJogoDaVelha,
    Demo: DemoJogoDaVelha,
    codigo: codigoJogoDaVelha,
    teste: testeJogoDaVelha,
  },
  {
    id: 'componentes-de-classe',
    modulo: 'projetos',
    titulo: 'Componentes de classe',
    resumo: 'Ler código legado traduzindo para hooks.',
    simbolo: '{}',
    aprendizados: [12, 116],
    historico: true,
    Texto: TextoComponentesDeClasse,
    Demo: DemoComponentesDeClasse,
    codigo: codigoComponentesDeClasse,
    teste: testeComponentesDeClasse,
  },
]

/* Lição pelo id, ou null. */
export function licaoPorId(id: string) {
  return licoes.find((l) => l.id === id) ?? null
}

/* Anterior e próxima na ordem do índice. */
export function vizinhas(id: string) {
  const i = licoes.findIndex((l) => l.id === id)
  return {
    anterior: i > 0 ? licoes[i - 1]! : null,
    proxima: i >= 0 ? (licoes[i + 1] ?? null) : null,
  }
}
/* Fim do índice das lições. */
