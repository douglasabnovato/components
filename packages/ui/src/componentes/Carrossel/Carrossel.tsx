/*
 * Carrossel: trilho de slides com Embla. Variante "espiar" mostra as bordas
 * dos slides vizinhos; "trilho" mostra vários cards lado a lado. Tem setas,
 * paginação em pílulas e anúncios para leitor de tela.
 */
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import styles from './Carrossel.module.css'

type Props = {
  rotulo: string
  itens: ReactNode[]
  variante?: 'espiar' | 'trilho'
  largura?: string
  setas?: boolean
  paginacao?: boolean
  laco?: boolean
}

/* Liga o Embla ao índice atual, às setas e à paginação. */
export function Carrossel({
  rotulo,
  itens,
  variante = 'espiar',
  largura,
  setas = true,
  paginacao = true,
  laco = false,
}: Props) {
  const [viewportRef, api] = useEmblaCarousel({
    align: variante === 'espiar' ? 'center' : 'start',
    loop: laco,
    containScroll: variante === 'espiar' ? false : 'trimSnaps',
  })
  const inicial = `0|0|${itens.length > 1 ? 1 : 0}|${itens.length}`

  /* Inscreve o React nos eventos do Embla que mudam a posição. */
  const inscrever = useCallback(
    (aviso: () => void) => {
      if (!api) return () => {}
      api.on('select', aviso).on('reInit', aviso)
      return () => {
        api.off('select', aviso).off('reInit', aviso)
      }
    },
    [api],
  )

  /* Resume o estado do Embla numa chave estável: atual|voltar|avançar|páginas. */
  const lerEstado = () =>
    api
      ? `${api.selectedScrollSnap()}|${Number(api.canScrollPrev())}|${Number(api.canScrollNext())}|${api.scrollSnapList().length}`
      : inicial

  const chave = useSyncExternalStore(inscrever, lerEstado, () => inicial)
  const [atual = 0, voltar = 0, avancar = 0, paginas = 0] = chave.split('|').map(Number)
  const podeVoltar = voltar === 1
  const podeAvancar = avancar === 1

  const estilo = (largura ? { '--largura-slide': largura } : {}) as CSSProperties
  const totalPaginas = paginas || itens.length

  return (
    <section
      className={styles.carrossel}
      data-variante={variante}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      style={estilo}
    >
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.trilho}>
          {itens.map((item, indice) => (
            <div
              key={indice}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${itens.length}`}
              data-ativo={indice === atual}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {setas || paginacao ? (
        <div className={styles.controles}>
          {paginacao ? (
            <div className={styles.paginacao}>
              {Array.from({ length: totalPaginas }, (_, indice) => (
                <button
                  key={indice}
                  type="button"
                  className={styles.ponto}
                  aria-label={`Ir para o slide ${indice + 1}`}
                  aria-current={indice === atual ? 'true' : undefined}
                  onClick={() => api?.scrollTo(indice)}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
          {setas ? (
            <div className={styles.setas}>
              <button
                type="button"
                className={styles.seta}
                onClick={() => api?.scrollPrev()}
                disabled={!podeVoltar && !laco}
                aria-label="Slide anterior"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className={styles.seta}
                onClick={() => api?.scrollNext()}
                disabled={!podeAvancar && !laco}
                aria-label="Próximo slide"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      <p className="visualmente-oculto" aria-live="polite">
        Slide {atual + 1} de {itens.length}
      </p>
    </section>
  )
}
/* Fim do Carrossel. */
