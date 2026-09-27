/*
 * Princípios exibidos no Início. No projeto original, um array de qualidades
 * era passado do Express para o EJS e percorrido com forEach; aqui ele vem do
 * loader e é percorrido com map no componente.
 */
export const principios = [
  {
    letra: 'H',
    titulo: 'HTML primeiro',
    texto:
      'O servidor entrega a página pronta. Links e formulários funcionam antes de qualquer script.',
  },
  {
    letra: 'V',
    titulo: 'Validação no servidor',
    texto: 'A regra mora na action. O navegador pode ajudar, mas quem decide é o servidor.',
  },
  {
    letra: 'P',
    titulo: 'Post, redirect, get',
    texto:
      'Depois de salvar, o servidor redireciona. Recarregar a página não reenvia o formulário.',
  },
  {
    letra: 'A',
    titulo: 'Aprimoramento progressivo',
    texto: 'Com JavaScript, o envio acontece sem recarregar e o botão mostra o andamento.',
  },
  {
    letra: 'E',
    titulo: 'Erros ao lado do campo',
    texto: 'Cada problema aparece junto do campo, com um resumo no topo que leva até ele.',
  },
]
/* Fim dos princípios. */
