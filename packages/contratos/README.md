# @components/contratos

Esquemas Zod compartilhados entre a API (`apps/api`) e os filhos que a consomem (02 · Cadastro e 05 · Tarefas). A mesma regra valida o formulário no navegador e a requisição no servidor; os tipos TypeScript saem dos esquemas.

Se um campo mudar aqui, o typecheck do front e do back quebra junto, antes de chegar à produção (aprendizado 60 da Trilha: comunicação tipada entre front e back).

| Arquivo       | Conteúdo                                                             |
| ------------- | -------------------------------------------------------------------- |
| `clientes.ts` | dados do cliente (nome, e-mail, idade), cliente salvo e consulta     |
| `tarefas.ts`  | nova tarefa, alteração, tarefa salva, consulta e validação de regex  |
| `erros.ts`    | formato de erro `{ erro, campos? }` e conversão dos problemas do Zod |
