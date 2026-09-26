/*
 * NavPilula: navegação principal flutuante em pílula, centralizada no topo.
 * No desktop mostra links, um megamenu e uma ação; no celular vira um botão
 * "Menu" que abre um painel com os mesmos destinos.
 */
import { useEffect, useId, useState, type ReactNode } from 'react'
import { MegaMenu, MegaMenuGrade, type ItemMegaMenu } from '../MegaMenu/MegaMenu'
import styles from './NavPilula.module.css'

export type LinkNav = {
  href: string
  rotulo: string
}

type Props = {
  marca: ReactNode
  hrefMarca?: string
  rotuloMarca: string
  links: LinkNav[]
  mega?: { rotulo: string; itens: ItemMegaMenu[] }
  acao?: ReactNode
  indicador?: ReactNode
}

/* Renderiza a pílula e controla o painel do celular. */
export function NavPilula({
  marca,
  hrefMarca = '#topo',
  rotuloMarca,
  links,
  mega,
  acao,
  indicador,
}: Props) {
  const [aberto, setAberto] = useState(false)
  const idPainel = useId()

  useEffect(() => {
    if (!aberto) return
    /* Fecha o painel do celular com Esc. */
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAberto(false)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  /* Fecha o painel depois de escolher um destino. */
  const fechar = () => setAberto(false)

  return (
    <header className={styles.cabecalho}>
      <nav className={styles.pilula} aria-label="Principal">
        <a className={styles.marca} href={hrefMarca} aria-label={rotuloMarca}>
          {marca}
        </a>

        <div className={styles.desktop}>
          {mega ? <MegaMenu rotulo={mega.rotulo} itens={mega.itens} /> : null}
          {links.map((link) => (
            <a key={link.href} className={styles.link} href={link.href}>
              {link.rotulo}
            </a>
          ))}
        </div>

        {indicador ? <div className={styles.indicador}>{indicador}</div> : null}
        {acao ? <div className={styles.acao}>{acao}</div> : null}

        <button
          type="button"
          className={styles.menu}
          aria-expanded={aberto}
          aria-controls={idPainel}
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? 'Fechar' : 'Menu'}
        </button>
      </nav>

      <div id={idPainel} className={styles.painel} hidden={!aberto}>
        {mega ? (
          <>
            <p className={styles.tituloPainel}>{mega.rotulo}</p>
            <MegaMenuGrade itens={mega.itens} aoEscolher={fechar} />
          </>
        ) : null}
        <ul className={styles.linksPainel}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={fechar}>
                {link.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
/* Fim da NavPilula. */
