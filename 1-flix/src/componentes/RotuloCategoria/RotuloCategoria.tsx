/*
 * RotuloCategoria: etiqueta com a cor da categoria. A cor do texto é escolhida
 * pelo contraste WCAG (regra R8), então qualquer cor escolhida fica legível.
 */
import { corDoTextoSobre } from '@components/ui'
import type { Categoria } from '../../dominio/tipos'
import styles from './RotuloCategoria.module.css'

type Props = { categoria: Pick<Categoria, 'nome' | 'cor'>; tamanho?: 'p' | 'g' }

/* Pinta o fundo com a cor da categoria e o texto com a cor de maior contraste. */
export function RotuloCategoria({ categoria, tamanho = 'p' }: Props) {
  return (
    <span
      className={[styles.rotulo, tamanho === 'g' ? styles.grande : ''].join(' ')}
      style={{ background: categoria.cor, color: corDoTextoSobre(categoria.cor) }}
    >
      {categoria.nome}
    </span>
  )
}
/* Fim do RotuloCategoria. */
