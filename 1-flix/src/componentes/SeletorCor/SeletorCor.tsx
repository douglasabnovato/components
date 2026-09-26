/*
 * SeletorCor: campo de cor com prévia da etiqueta e o indicador de contraste
 * (razão WCAG e nível), evolução visível da regra de legibilidade R8.
 */
import { corDoTextoSobre, nivelWcag, razaoContraste } from '@components/ui'
import type { InputHTMLAttributes, Ref } from 'react'
import styles from './SeletorCor.module.css'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & {
  rotulo: string
  valor: string
  nomePrevia: string
  ref?: Ref<HTMLInputElement>
}

/* Mostra o seletor nativo, a prévia e o texto com a razão de contraste. */
export function SeletorCor({ rotulo, valor, nomePrevia, id, ref, ...resto }: Props) {
  const cor = /^#[0-9a-fA-F]{6}$/.test(valor) ? valor : '#000000'
  const texto = corDoTextoSobre(cor)
  const razao = razaoContraste(cor, texto)
  const idInfo = `${id}-contraste`
  return (
    <div className={styles.seletor}>
      <label htmlFor={id} className={styles.rotulo}>
        {rotulo}
      </label>
      <div className={styles.linha}>
        <input
          ref={ref}
          id={id}
          type="color"
          value={cor}
          aria-describedby={idInfo}
          className={styles.cor}
          {...resto}
        />
        <span className={styles.previa} style={{ background: cor, color: texto }}>
          {nomePrevia || 'Prévia'}
        </span>
      </div>
      <p id={idInfo} className={styles.info}>
        Texto {texto === '#FFFFFF' ? 'branco' : 'escuro'} · {razao.toFixed(1).replace('.', ',')}:1 ·{' '}
        {nivelWcag(razao)}
      </p>
    </div>
  )
}
/* Fim do SeletorCor. */
