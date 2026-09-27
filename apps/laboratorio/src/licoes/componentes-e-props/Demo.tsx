/*
 * Demo: componentes e props. Um Cartao genérico recebe título, destaque e
 * filhos; a Familia repassa o sobrenome para cada Membro por props.
 */
import type { ReactNode } from 'react'
import estilos from '../demo.module.css'

type CartaoProps = { titulo: string; destaque?: boolean; children: ReactNode }

/* Moldura reutilizável: o conteúdo chega por children. */
function Cartao({ titulo, destaque = false, children }: CartaoProps) {
  return (
    <section
      className={[estilos.cartao, destaque ? estilos.destaque : ''].join(' ')}
      aria-label={titulo}
    >
      <strong>{titulo}</strong>
      {children}
    </section>
  )
}

/* Um membro mostra o nome com o sobrenome recebido do pai. */
function Membro({ nome, sobrenome }: { nome: string; sobrenome: string }) {
  return (
    <li>
      {nome} {sobrenome}
    </li>
  )
}

/* A família define o sobrenome uma vez e o repassa. */
function Familia({ sobrenome, nomes }: { sobrenome: string; nomes: string[] }) {
  return (
    <ul className={estilos.lista}>
      {nomes.map((nome) => (
        <Membro key={nome} nome={nome} sobrenome={sobrenome} />
      ))}
    </ul>
  )
}

/* Monta dois cartões com o mesmo componente e conteúdos diferentes. */
export default function Demo() {
  return (
    <div className={estilos.caixa}>
      <Cartao titulo="Família Silva" destaque>
        <Familia sobrenome="Silva" nomes={['Ana', 'Bia', 'Caio']} />
      </Cartao>
      <Cartao titulo="Recado">
        <p>O mesmo Cartao, outro conteúdo.</p>
      </Cartao>
    </div>
  )
}
/* Fim da demo. */
