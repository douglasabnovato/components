/*
 * CampoBusca: no React 19, ref chega como prop comum (sem forwardRef).
 * Com useImperativeHandle, o componente expõe só duas ações ao pai.
 */
import { useImperativeHandle, useRef, type Ref } from 'react'
import estilos from '../demo.module.css'

export type ControleBusca = { focar: () => void; limpar: () => void }

/* Campo com ref própria no input e controle público para o pai. */
export function CampoBusca({ ref, rotulo }: { ref?: Ref<ControleBusca>; rotulo: string }) {
  const entrada = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({
    focar: () => entrada.current?.focus(),
    limpar: () => {
      if (entrada.current) entrada.current.value = ''
    },
  }))
  return (
    <label className={estilos.campo}>
      {rotulo}
      <input ref={entrada} type="search" />
    </label>
  )
}
/* Fim do CampoBusca. */
