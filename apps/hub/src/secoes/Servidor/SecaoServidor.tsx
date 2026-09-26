/*
 * Seção 04 · Formulários no Servidor. Referência: editorial escuro com título
 * serifado, seletor de modo e cards escuros. O seletor mostra o mesmo envio de
 * formulário com e sem JavaScript, passo a passo.
 */
import { SeletorPilula } from '@components/ui'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { projeto } from '../../dados/projetos'
import { CabecalhoSecao, RodapeSecao, Secao } from '../../componentes/Secao/Secao'
import styles from './SecaoServidor.module.css'

type Modo = 'com-js' | 'sem-js'

const passos: Record<Modo, { titulo: string; detalhe: string }[]> = {
  'com-js': [
    {
      titulo: 'Envio interceptado',
      detalhe: 'O <Form> do React Router envia via fetch, sem recarregar.',
    },
    { titulo: 'Action no servidor', detalhe: 'Valida com Zod e grava. Erros voltam como dados.' },
    { titulo: 'Revalidação', detalhe: 'Os loaders da página rodam de novo automaticamente.' },
    { titulo: 'Tela atualizada', detalhe: 'Só o que mudou é renderizado; o foco é preservado.' },
  ],
  'sem-js': [
    { titulo: 'POST nativo', detalhe: 'O navegador envia o <form> como sempre fez.' },
    { titulo: 'Mesma action', detalhe: 'O servidor valida e grava com o mesmo código.' },
    {
      titulo: 'Redirecionamento',
      detalhe: 'Sucesso responde 303; erro devolve a página com mensagens.',
    },
    { titulo: 'Página completa', detalhe: 'Tudo funciona, só que com recarga. Nada quebra.' },
  ],
}

const paginas = [
  {
    rota: '/',
    nome: 'Início',
    texto: 'Apresenta o projeto e lista os envios recentes lidos por um loader.',
  },
  {
    rota: '/sobre',
    nome: 'Sobre',
    texto: 'Página estática renderizada no servidor, com cabeçalho e rodapé compartilhados.',
  },
  {
    rota: '/contato',
    nome: 'Contato',
    texto: 'Formulário com validação no servidor e erros ao lado de cada campo.',
  },
]

/* Monta o texto editorial, o comparativo de modos e os cards de páginas. */
export function SecaoServidor() {
  const p = projeto(4)
  const [modo, setModo] = useState<Modo>('com-js')
  const idLista = useId()

  return (
    <Secao projeto={p} className={styles.secao}>
      <div className={styles.dividido}>
        <CabecalhoSecao projeto={p} editorial />
        <div className={styles.comparativo}>
          <SeletorPilula<Modo>
            rotulo="Modo do navegador"
            valor={modo}
            aoMudar={setModo}
            controla={idLista}
            opcoes={[
              { valor: 'com-js', rotulo: 'Com JavaScript' },
              { valor: 'sem-js', rotulo: 'Sem JavaScript' },
            ]}
          />
          <AnimatePresence mode="wait">
            <motion.ol
              key={modo}
              id={idLista}
              className={styles.passos}
              aria-live="polite"
              initial="oculto"
              animate="visivel"
              exit="oculto"
              variants={{ visivel: { transition: { staggerChildren: 0.08 } } }}
            >
              {passos[modo].map((passo) => (
                <motion.li
                  key={passo.titulo}
                  className={styles.passo}
                  variants={{ oculto: { opacity: 0, x: 16 }, visivel: { opacity: 1, x: 0 } }}
                >
                  <h3 className={styles.tituloPasso}>{passo.titulo}</h3>
                  <p className={styles.detalhe}>{passo.detalhe}</p>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>

      <ul className={styles.paginas}>
        {paginas.map((pagina) => (
          <li key={pagina.rota} className={styles.pagina}>
            <code className={styles.rota}>{pagina.rota}</code>
            <h3 className={styles.nomePagina}>{pagina.nome}</h3>
            <p className={styles.textoPagina}>{pagina.texto}</p>
          </li>
        ))}
      </ul>

      <RodapeSecao projeto={p} />
    </Secao>
  )
}
/* Fim da seção Formulários no Servidor. */
