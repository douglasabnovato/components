/*
 * Início da Trilha: visão geral do progresso, botão "continuar", filtros na
 * URL e os módulos com seus aprendizados. Totais e percentuais são derivados
 * do conteúdo e da lista de assistidos a cada renderização.
 */
import { BotaoPilula } from '@components/ui'
import { useId } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BarraProgresso } from '../../componentes/BarraProgresso/BarraProgresso'
import { EstadoVazio } from '../../componentes/Estados/Estados'
import { LinhaAprendizado } from '../../componentes/LinhaAprendizado/LinhaAprendizado'
import { PainelFiltros } from '../../componentes/PainelFiltros/PainelFiltros'
import { useAssistidos, useArmazem } from '../../dados/progresso'
import { aprendizados, modulos } from '../../dados/trilha'
import { formatarMinutos, minutosPorExtenso } from '../../dominio/duracao'
import { filtrar, lerFiltros, temFiltro } from '../../dominio/filtros'
import { aprendizadosDoModulo, proximoPendente, resumir } from '../../dominio/trilha'
import styles from './Inicio.module.css'

/* Monta o resumo, os filtros e a lista agrupada por módulo. */
export function Inicio() {
  const armazem = useArmazem()
  const assistidos = useAssistidos()
  const [parametros, setParametros] = useSearchParams()
  const filtros = lerFiltros(parametros)
  const idLista = useId()

  const geral = resumir(aprendizados, assistidos)
  const proximo = proximoPendente(assistidos)
  const concluidos = modulos.filter(
    (m) => resumir(aprendizadosDoModulo(m.numero), assistidos).percentual === 100,
  ).length
  const visiveis = filtrar(aprendizados, filtros, assistidos)
  const filtrando = temFiltro(filtros)

  return (
    <>
      <section className={styles.topo} aria-labelledby="titulo-trilha">
        <p className={styles.rotulo}>Projeto 08 · curadoria em 12 módulos</p>
        <h1 id="titulo-trilha" className={styles.titulo}>
          Trilha React: do zero ao fullstack
        </h1>
        <p className={styles.resumo}>
          {aprendizados.length} vídeos em ordem de consumo, dos primeiros componentes ao React 19,
          Next.js e IA. Marque o que assistiu, anote o que aprendeu e veja onde cada tecnologia é
          aplicada nos projetos do hub.
        </p>

        <dl className={styles.numeros}>
          <div>
            <dt>Assistidos</dt>
            <dd>
              {geral.assistidos}
              <span>/{geral.total}</span>
            </dd>
          </div>
          <div>
            <dt>Tempo restante</dt>
            <dd>
              <span className="visualmente-oculto">
                {minutosPorExtenso(geral.minutosRestantes)}
              </span>
              <span aria-hidden="true" className={styles.tempo}>
                {formatarMinutos(geral.minutosRestantes)}
              </span>
            </dd>
          </div>
          <div>
            <dt>Módulos concluídos</dt>
            <dd>
              {concluidos}
              <span>/{modulos.length}</span>
            </dd>
          </div>
        </dl>

        <BarraProgresso
          valor={geral.assistidos}
          maximo={geral.total}
          rotulo={`Progresso na trilha: ${geral.assistidos} de ${geral.total}`}
        />

        <div className={styles.acoes}>
          {proximo ? (
            <BotaoPilula comoFilho tamanho="g" icone="▶">
              <Link to={`/aprendizado/${proximo.numero}`}>
                {geral.assistidos ? 'Continuar' : 'Começar'}: {proximo.numero}. {proximo.titulo}
              </Link>
            </BotaoPilula>
          ) : (
            <p className={styles.concluida}>Trilha concluída. Parabéns!</p>
          )}
          {geral.assistidos ? (
            <BotaoPilula variante="vazado" onClick={() => armazem.reiniciar()}>
              Recomeçar do zero
            </BotaoPilula>
          ) : null}
        </div>
      </section>

      <PainelFiltros controla={idLista} />

      <p className={styles.contagem} role="status">
        {filtrando
          ? `${visiveis.length} ${visiveis.length === 1 ? 'aprendizado encontrado' : 'aprendizados encontrados'}`
          : `${aprendizados.length} aprendizados em ${modulos.length} módulos`}
      </p>

      <div id={idLista} className={styles.modulos}>
        {visiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nada por aqui"
            acoes={
              <BotaoPilula variante="vazado" onClick={() => setParametros({}, { replace: true })}>
                Limpar filtros
              </BotaoPilula>
            }
          >
            Nenhum aprendizado combina com os filtros escolhidos.
          </EstadoVazio>
        ) : (
          modulos.map((modulo) => {
            const doModulo = visiveis.filter((a) => a.modulo === modulo.numero)
            if (doModulo.length === 0) return null
            const resumo = resumir(aprendizadosDoModulo(modulo.numero), assistidos)
            const idTitulo = `modulo-${modulo.numero}`
            return (
              <section key={modulo.numero} className={styles.modulo} aria-labelledby={idTitulo}>
                <header className={styles.cabecalhoModulo}>
                  <p className={styles.numeroModulo}>
                    Módulo {String(modulo.numero).padStart(2, '0')}
                  </p>
                  <h2 id={idTitulo} className={styles.tituloModulo}>
                    {modulo.titulo}
                  </h2>
                  <p className={styles.metaModulo}>
                    {resumo.total} aprendizados · {formatarMinutos(resumo.minutos)}
                    {modulo.autor ? ` · série de ${modulo.autor}` : ''}
                    {resumo.assistidos ? ` · ${resumo.assistidos} assistidos` : ''}
                  </p>
                  <BarraProgresso
                    compacta
                    valor={resumo.assistidos}
                    maximo={resumo.total}
                    rotulo={`Progresso no módulo ${modulo.numero}: ${resumo.assistidos} de ${resumo.total}`}
                  />
                </header>
                <ol className={styles.lista}>
                  {doModulo.map((a) => (
                    <LinhaAprendizado
                      key={a.numero}
                      aprendizado={a}
                      assistido={assistidos.has(a.numero)}
                      aoAlternar={armazem.alternarAssistido}
                    />
                  ))}
                </ol>
              </section>
            )
          })
        )}
      </div>
    </>
  )
}
/* Fim do Início. */
