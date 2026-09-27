/*
 * TabelaClientes: tabela acessível (legenda, cabeçalhos de coluna e de linha)
 * com avatar de iniciais, ações por linha e linhas-esqueleto no carregamento.
 */
import type { Cliente } from '@components/contratos'
import { iniciais } from '../../dominio/clientes'
import styles from './TabelaClientes.module.css'

type Props = {
  clientes: Cliente[]
  carregando: boolean
  aoEditar: (cliente: Cliente) => void
  aoExcluir: (cliente: Cliente) => void
}

/* Renderiza a tabela ou as linhas de esqueleto. */
export function TabelaClientes({ clientes, carregando, aoEditar, aoExcluir }: Props) {
  return (
    <div className={styles.moldura}>
      <table className={styles.tabela} aria-busy={carregando}>
        <caption className="visualmente-oculto">Clientes cadastrados</caption>
        <thead>
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col" className={styles.numero}>
              Idade
            </th>
            <th scope="col" className={styles.acoesCabecalho}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {carregando
            ? [1, 2, 3].map((n) => (
                <tr key={n} className={styles.esqueleto} aria-hidden="true">
                  <td>
                    <span className={styles.barra} />
                  </td>
                  <td>
                    <span className={styles.barraCurta} />
                  </td>
                  <td />
                </tr>
              ))
            : clientes.map((c) => (
                <tr key={c.id}>
                  <th scope="row" className={styles.cliente}>
                    <span className={styles.avatar} aria-hidden="true">
                      {iniciais(c.nome)}
                    </span>
                    <span className={styles.textos}>
                      <span className={styles.nome}>{c.nome}</span>
                      <span className={styles.email}>{c.email}</span>
                    </span>
                  </th>
                  <td className={styles.numero}>{c.idade}</td>
                  <td className={styles.acoes}>
                    <button type="button" className={styles.botao} onClick={() => aoEditar(c)}>
                      Editar <span className="visualmente-oculto">{c.nome}</span>
                    </button>
                    <button
                      type="button"
                      className={[styles.botao, styles.perigo].join(' ')}
                      onClick={() => aoExcluir(c)}
                    >
                      Excluir <span className="visualmente-oculto">{c.nome}</span>
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
/* Fim da TabelaClientes. */
