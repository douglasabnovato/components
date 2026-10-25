# ADR 0003 · Hospedagem: Vercel para estáticos, Render para o dinâmico

- **Status:** proposta
- **Data:** 24/10/2026

## Contexto

O projeto tem partes estáticas (hub e 7 filhos) e partes que exigem servidor Node (API com PGlite e SSR do Formulários). O critério do MVP é que todo clicável funcione, inclusive para quem abre o portfólio pela primeira vez.

## Decisão

- **Vercel** entrega o hub e os filhos estáticos e encaminha `/api` e `/formularios` ao Render.
- **Render** roda um único servidor Node (`apps/servidor`) com a API e o SSR.

## Alternativas consideradas

| Alternativa | Por que não (por ora) |
| --- | --- |
| Tudo no Render gratuito (o `apps/servidor` em modo `SERVIR_ESTATICOS=1`) | O serviço dorme após 15 minutos e leva cerca de 1 minuto para acordar; o hub inteiro ficaria lento na primeira visita. Continua disponível como plano B, sem mudar código |
| Hospedagem paga sem hibernação | Custo mensal desnecessário para o MVP |

## Consequências

- Hub e filhos estáticos sempre rápidos.
- Primeira visita a Cadastro (modo API), Tarefas e Formulários pode esperar o Render acordar.
- Dados da API voltam ao exemplo a cada reinício (disco temporário), aceitável para demonstração.
- Dois provedores para manter.
