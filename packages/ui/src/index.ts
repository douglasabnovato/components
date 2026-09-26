/*
 * Ponto de entrada do pacote @components/ui: componentes e hooks
 * compartilhados. Os tokens são importados à parte: '@components/ui/tokens.css'.
 */
export { AbasSegmentadas, type Aba } from './componentes/AbasSegmentadas/AbasSegmentadas'
export { BarraWidget, Campo } from './componentes/BarraWidget/BarraWidget'
export { useAvisos, type Aviso } from './componentes/Avisos/contexto'
export { ProvedorAvisos } from './componentes/Avisos/ProvedorAvisos'
export { Dialogo } from './componentes/Dialogo/Dialogo'
export { BotaoPausa } from './componentes/BotaoPausa/BotaoPausa'
export { BotaoPilula, type BotaoPilulaProps } from './componentes/BotaoPilula/BotaoPilula'
export { BotaoVoltar } from './componentes/BotaoVoltar/BotaoVoltar'
export { CardCategoria } from './componentes/CardCategoria/CardCategoria'
export { CardEtiqueta } from './componentes/CardEtiqueta/CardEtiqueta'
export { CardEvento } from './componentes/CardEvento/CardEvento'
export { Carrossel } from './componentes/Carrossel/Carrossel'
export { Contador } from './componentes/Contador/Contador'
export { LinkSeta } from './componentes/LinkSeta/LinkSeta'
export { MegaMenu, MegaMenuGrade, type ItemMegaMenu } from './componentes/MegaMenu/MegaMenu'
export { NavPilula, type LinkNav } from './componentes/NavPilula/NavPilula'
export { SeletorPilula, type OpcaoSeletor } from './componentes/SeletorPilula/SeletorPilula'
export { SkipLink } from './componentes/SkipLink/SkipLink'
export {
  corDoTextoSobre,
  nivelWcag,
  razaoContraste,
  TEXTO_CLARO,
  TEXTO_ESCURO,
} from './utilitarios/contraste'
export { useMovimentoReduzido } from './hooks/useMovimentoReduzido'
export { useSecaoAtiva } from './hooks/useSecaoAtiva'
/* Fim do ponto de entrada. */
