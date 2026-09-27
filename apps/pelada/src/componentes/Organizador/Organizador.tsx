/*
 * Organizador: cartão com o perfil do GitHub de quem organiza as peladas
 * (foto, nome e link) e um formulário curto para trocar o usuário.
 */
import { Campo } from '@components/ui'
import { useId, useState, type FormEvent } from 'react'
import { usePerfilGithub } from '../../dados/github'
import styles from './Organizador.module.css'

type Props = { usuario: string; aoTrocar: (usuario: string) => void }

/* Mostra o estado da busca do perfil e permite trocar o usuário. */
export function Organizador({ usuario, aoTrocar }: Props) {
  const perfil = usePerfilGithub(usuario)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(usuario)
  const id = useId()

  /* Salva o novo usuário e fecha o formulário. */
  function salvar(evento: FormEvent) {
    evento.preventDefault()
    aoTrocar(texto)
    setEditando(false)
  }

  return (
    <section className={styles.cartao} aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className={styles.rotulo}>
        Organizador
      </h2>
      <div className={styles.perfil} aria-live="polite" aria-busy={perfil.tipo === 'carregando'}>
        {perfil.tipo === 'carregando' ? (
          <>
            <span className={[styles.avatar, styles.esqueleto].join(' ')} aria-hidden="true" />
            <p>Buscando @{usuario} no GitHub…</p>
          </>
        ) : null}
        {perfil.tipo === 'pronto' ? (
          <>
            <img
              className={styles.avatar}
              src={perfil.perfil.avatar}
              alt=""
              width="56"
              height="56"
            />
            <div>
              <p className={styles.nome}>{perfil.perfil.nome}</p>
              <a href={perfil.perfil.url} target="_blank" rel="noreferrer">
                @{perfil.perfil.usuario}{' '}
                <span className="visualmente-oculto">no GitHub (nova aba)</span>
              </a>
            </div>
          </>
        ) : null}
        {perfil.tipo === 'erro' ? <p className={styles.erro}>{perfil.mensagem}</p> : null}
        {perfil.tipo === 'vazio' ? <p>Sem organizador definido.</p> : null}
      </div>
      {editando ? (
        <form className={styles.form} onSubmit={salvar}>
          <Campo rotulo="Usuário do GitHub" htmlFor={`${id}-usuario`}>
            <input
              id={`${id}-usuario`}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </Campo>
          <div className={styles.botoes}>
            <button type="submit" className={styles.salvar}>
              Salvar
            </button>
            <button type="button" className={styles.trocar} onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className={styles.trocar}
          onClick={() => {
            setTexto(usuario)
            setEditando(true)
          }}
        >
          Trocar organizador
        </button>
      )}
    </section>
  )
}
/* Fim do Organizador. */
