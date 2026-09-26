/*
 * Conteúdo das lições do Laboratório no formato desafio → conteúdo → solução.
 * As lições sem demo ainda aparecem no índice como "em breve".
 */
import type { ComponentType } from 'react'
import { DemoContador, DemoRelogio, DemoTema } from './demos'

export type Licao = {
  id: string
  titulo: string
  resumo: string
  simbolo: string
  desafio?: string
  conteudo?: string
  codigo?: string
  Demo?: ComponentType
}

export const licoes: Licao[] = [
  {
    id: 'use-state',
    titulo: 'useState',
    resumo: 'Guardar valores que mudam a tela.',
    simbolo: 'S',
    desafio: 'O contador soma na variável, mas o número na tela nunca muda. Por quê?',
    conteudo:
      'Variáveis comuns são recriadas a cada renderização e não avisam o React. O useState guarda o valor entre renderizações e agenda uma nova quando você chama o setter.',
    codigo: `const [cliques, setCliques] = useState(0)

<button onClick={() => setCliques((c) => c + 1)}>
  Somar 1
</button>`,
    Demo: DemoContador,
  },
  {
    id: 'use-effect',
    titulo: 'useEffect',
    resumo: 'Sincronizar com o mundo lá fora.',
    simbolo: 'E',
    desafio:
      'O cronômetro acelera cada vez que você pausa e retoma. De onde vêm os intervalos extras?',
    conteudo:
      'Todo efeito que cria algo (intervalo, assinatura, conexão) precisa devolver a limpeza. O React chama essa função antes de rodar o efeito de novo e ao desmontar.',
    codigo: `useEffect(() => {
  if (!rodando) return
  const id = setInterval(() => setSegundos((s) => s + 1), 1000)
  return () => clearInterval(id)
}, [rodando])`,
    Demo: DemoRelogio,
  },
  {
    id: 'use-context',
    titulo: 'useContext',
    resumo: 'Compartilhar dados sem repassar props.',
    simbolo: 'C',
    desafio:
      'No projeto original, a rota que usava contexto quebrava: o componente lia o tema, mas ninguém o fornecia.',
    conteudo:
      'useContext só encontra um valor se houver um Provider acima na árvore. Um hook próprio que lança erro sem Provider transforma um bug silencioso numa mensagem clara.',
    codigo: `function useTema() {
  const valor = useContext(TemaContexto)
  if (!valor) throw new Error('Falta o Provider')
  return valor
}

<TemaContexto.Provider value={{ tema, alternar }}>
  <CartaoComTema />
</TemaContexto.Provider>`,
    Demo: DemoTema,
  },
  {
    id: 'props',
    titulo: 'Props e composição',
    resumo: 'Componentes que se encaixam.',
    simbolo: 'P',
  },
  {
    id: 'css-modules',
    titulo: 'CSS Modules',
    resumo: 'Estilo sem vazamento entre telas.',
    simbolo: 'M',
  },
  {
    id: 'rotas',
    titulo: 'Rotas com parâmetro',
    resumo: 'Uma tela, muitos endereços.',
    simbolo: 'R',
  },
]
/* Fim das lições. */
