/*
 * Cabecalho: configura a NavPilula do hub com o megamenu dos 7 projetos,
 * os links institucionais, o atalho para o GitHub e o indicador da seção ativa.
 */
import { BotaoPilula, NavPilula } from '@components/ui'
import { doisDigitos, projetos, site } from '../../dados/projetos'
import { IconeProjeto } from '../IconeProjeto'
import { Marca } from '../Marca'
import styles from './Cabecalho.module.css'

type Props = { ativo: string | null }

/* Monta os itens do menu a partir dos dados dos projetos. */
export function Cabecalho({ ativo }: Props) {
  const atual = projetos.find((p) => p.id === ativo)
  const itens = projetos.map((p) => ({
    href: `#${p.id}`,
    titulo: p.nome,
    descricao: p.titulo,
    icone: <IconeProjeto projeto={p} tamanho={36} />,
    destaque: p.status === 'publicado' ? 'No ar' : `Fase ${p.fase}`,
  }))

  return (
    <NavPilula
      marca={<Marca />}
      rotuloMarca={`${site.nome}, voltar ao início`}
      mega={{ rotulo: 'Projetos', itens }}
      links={[
        { href: '#arquitetura', rotulo: 'Arquitetura' },
        { href: '#creditos', rotulo: 'Créditos' },
      ]}
      indicador={
        atual ? (
          <span className={styles.indicador} aria-hidden="true">
            <span className={styles.ponto} />
            {doisDigitos(atual.numero)} · {atual.nome}
          </span>
        ) : null
      }
      acao={
        <BotaoPilula href={site.github} variante="vazado" target="_blank" rel="noreferrer">
          GitHub
        </BotaoPilula>
      }
    />
  )
}
/* Fim do Cabecalho. */
