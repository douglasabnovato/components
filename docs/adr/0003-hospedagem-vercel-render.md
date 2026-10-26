# ADR 0003 · Hospedagem: Vercel para estáticos, Render para o dinâmico

- **Status:** aceita
- **Data:** 24/10/2026 (proposta) · 26/10/2026 (aceita, com a parte estática publicada)

## Contexto

O projeto tem partes estáticas (hub e 7 filhos) e partes que exigem um processo Node contínuo (API com PGlite e SSR do Formulários). O critério do MVP é que todo clicável funcione, inclusive para quem abre o portfólio pela primeira vez.

## Decisão

- **Vercel** entrega o hub e os filhos estáticos, a partir da pasta `publicar/`, e encaminha `/api` e `/formularios` ao Render.
- **Render** roda um único servidor Node (`apps/servidor`, ver [ADR 0004](0004-servidor-de-producao-unico.md)) com a API e o SSR.
- O visitante usa um único domínio, o da Vercel.

## Alternativas consideradas

| Alternativa | Por que não (por ora) |
| --- | --- |
| Tudo no Render gratuito (`apps/servidor` em modo ensaio) | O serviço dorme após 15 minutos e leva cerca de 1 minuto para acordar; o hub inteiro ficaria lento na primeira visita. Continua disponível como plano B, sem mudar código |
| Vercel Services (beta), sugerido pela Vercel no import | Transformaria cada pasta em um serviço e a API em funções sem processo contínuo, o que não serve para o PGlite em disco. A sugestão automática também tratava pacotes internos (`ui`, `testes-e2e`) como aplicações |
| Um projeto da Vercel por pasta | Um domínio por projeto, contrariando a [ADR 0002](0002-um-dominio-com-pastas.md) |
| Hospedagem paga sem hibernação | Custo mensal desnecessário para o MVP |

## Consequências

- Hub e filhos estáticos sempre rápidos.
- A primeira visita a Cadastro (modo API), Tarefas e Formulários pode esperar o Render acordar.
- Os dados da API voltam ao exemplo a cada reinício (disco temporário), aceitável para demonstração.
- Dois provedores para manter, com o endereço do Render fixado no `vercel.json`.
- Na Vercel, o preset do projeto precisa ser **Other**, para que o `vercel.json` controle o build.
