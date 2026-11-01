# Revisão independente · 05 · Testes manuais

_27/10/2026. Roteiro para o site publicado (https://components-dusky-nine.vercel.app). Os passos usam as regras de negócio dos READMEs de cada filho (códigos entre parênteses). Enquanto o A-38/A-09 não fecharem, os blocos de API e Formulários devem falhar: anote o resultado mesmo assim._

**Preparação:** um navegador de computador (janela anônima), um celular (ou DevTools em 390 × 844) e, antes dos blocos 6, 7 e 10, abrir `/api/saude` e esperar até 1 minuto para o Render acordar.

## 0 · Hub

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 0.1 | Abrir `/` | Hub carrega sem tela branca; um título principal no topo | [ ] |
| 0.2 | Ver o título da aba | Hoje: "components · 7 projetos React" (A-26). Depois do A-26: 8 projetos | [ ] |
| 0.3 | Tecla Tab a partir do topo | Primeiro foco é o link "pular para o conteúdo"; Enter leva ao conteúdo | [ ] |
| 0.4 | Abrir o megamenu do cabeçalho | Lista os 8 projetos; cada item leva à seção certa | [ ] |
| 0.5 | Rolar a página inteira | Cor de acento muda conforme a seção; seções claras e escuras alternam sem texto ilegível | [ ] |
| 0.6 | Interagir com a demo de cada seção | Demos respondem a clique, sem erro visível | [ ] |
| 0.7 | Clicar no link de cada um dos 8 filhos | Abre o filho na pasta certa (`/flix/`, `/cadastro/`…) | [ ] |
| 0.8 | Ativar "reduzir movimento" no sistema e recarregar | Animações somem ou ficam mínimas | [ ] |
| 0.9 | Links do rodapé (GitHub, perfil) | Abrem os endereços de `site` em `projetos.ts` | [ ] |

## 1 · Flix (`/flix/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 1.1 | Abrir e trocar de categoria | Banner e destaque coerentes (R1, R2) | [ ] |
| 1.2 | Abrir um vídeo | Rota `/flix/assistir/:id` com player | [ ] |
| 1.3 | Painel → novo vídeo com link do YouTube | Capa gerada pelo ID (R7) | [ ] |
| 1.4 | Editar e depois excluir com desfazer | Edição mantém o destaque (R11); desfazer restaura | [ ] |
| 1.5 | Recarregar a página | Dados mantidos no navegador (R9) | [ ] |
| 1.6 | Botão de voltar ao hub | Volta para `/#filho-1` | [ ] |

## 2 · Cadastro (`/cadastro/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 2.1 | Criar cliente com nome de 2 letras | Erro de validação (C1) | [ ] |
| 2.2 | Criar cliente válido | Aparece na lista | [ ] |
| 2.3 | Criar outro com o mesmo e-mail | Erro no campo e-mail, com foco nele (C2) | [ ] |
| 2.4 | Buscar sem acento e ordenar por idade | Filtra e ordena (C3) | [ ] |
| 2.5 | Excluir e desfazer | Pede confirmação e oferece desfazer (C4) | [ ] |
| 2.6 | No modo API, com o Render fora | Aviso de indisponível, sem tela quebrada | [ ] |
| 2.7 | Voltar ao hub | `/#filho-2` | [ ] |

## 3 · Portal de Heróis (`/herois/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 3.1 | Filtrar universo e equipe | Filtros na URL; trocar universo limpa equipe incompatível (H2) | [ ] |
| 3.2 | Buscar por poder | Encontra sem diferenciar acentos (H3) | [ ] |
| 3.3 | Abrir uma ficha | Rota `/herois/heroi/:slug` | [ ] |
| 3.4 | Equipes e Comparar dois heróis | Vencedor por atributo e total (H4) | [ ] |
| 3.5 | No celular, abrir o menu e apertar Esc | Painel fecha e devolve o foco (H6) | [ ] |
| 3.6 | Voltar ao hub | `/#filho-3` | [ ] |

## 4 · Formulários no Servidor (`/formularios/`, Render)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 4.1 | Abrir `/formularios/` | Página inicial pelo SSR (hoje falha: A-38) | [ ] |
| 4.2 | Sobre e Contato | Navegam | [ ] |
| 4.3 | Enviar contato vazio | Erros por campo, na ordem nome, e-mail, assunto, mensagem | [ ] |
| 4.4 | Enviar válido | Vai para `contato/enviado` com protocolo `MSG-0001`… | [ ] |
| 4.5 | Repetir 4.3 e 4.4 com JavaScript desligado | Mesmo resultado | [ ] |
| 4.6 | Abrir Mensagens | Lista as mensagens, inclusive de outros visitantes (A-47) | [ ] |
| 4.7 | Esvaziar a caixa | Lista vazia | [ ] |
| 4.8 | Abrir `/formularios/nao-existe` | Página de não encontrado | [ ] |

## 5 · Tarefas (`/tarefas/`, usa a API)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 5.1 | Escrever e Enter | Tarefa criada (T1) | [ ] |
| 5.2 | Escrever `^a` e Shift+Enter | Busca por regex com destaque (T1, T2) | [ ] |
| 5.3 | Escrever `[` e Shift+Enter | Erro de padrão, mantém busca anterior (T2) | [ ] |
| 5.4 | Esc | Limpa campo e busca | [ ] |
| 5.5 | Tentar excluir tarefa pendente | Bloqueado com explicação (T3) | [ ] |
| 5.6 | Concluir e "Limpar concluídas" | Concluir é imediato (T4); limpar remove todas (T5) | [ ] |
| 5.7 | Com o Render fora | "Não foi possível listar", sem tela quebrada | [ ] |

## 6 · Lista da Pelada (`/pelada/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 6.1 | Novo jogo | Rota `/pelada/novo`, depois `/pelada/jogo/:id` | [ ] |
| 6.2 | Inscrever o mesmo nome com acento diferente | Recusado (P1) | [ ] |
| 6.3 | Encher as vagas e inscrever mais um | Vai para a espera (P2) | [ ] |
| 6.4 | Tirar um confirmado | Primeiro da espera sobe (P3) | [ ] |
| 6.5 | Sortear e depois mudar a lista | Times equilibrados; o sorteio some ao mudar (P5, P7) | [ ] |
| 6.6 | Copiar a lista | Texto pronto na área de transferência (P6) | [ ] |

## 7 · Laboratório (`/laboratorio/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 7.1 | Abrir uma lição | Rota `/laboratorio/licao/:id` | [ ] |
| 7.2 | Alternar abas (desafio, solução, demo, código, teste) | Aba ativa na URL (L2) | [ ] |
| 7.3 | Copiar o link e abrir em outra aba | Cai na mesma aba | [ ] |
| 7.4 | Marcar como concluída e recarregar | Progresso mantido (L4) | [ ] |
| 7.5 | Link para a Trilha | Abre o aprendizado na `/trilha/` (L3) | [ ] |

## 8 · Trilha React (`/trilha/`)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 8.1 | Filtrar e recarregar | Filtro mantido pela URL (R4) | [ ] |
| 8.2 | Marcar aprendizado como assistido | Totais e percentuais atualizam (R2) | [ ] |
| 8.3 | "Continuar" | Primeiro não assistido (R3) | [ ] |
| 8.4 | Abrir a Trilha em duas abas e marcar em uma | A outra sincroniza (R5) | [ ] |
| 8.5 | Abrir Stack | Rota `/trilha/stack` | [ ] |

## 9 · Rotas internas diretas e 404

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 9.1 | Colar `/trilha/aprendizado/1` na barra e Enter | App carrega direto na rota (A-08) | [ ] |
| 9.2 | Idem `/herois/comparar`, `/flix/painel`, `/laboratorio/licao/1` | Carregam | [ ] |
| 9.3 | Recarregar (F5) dentro de uma rota interna | Não dá 404 | [ ] |
| 9.4 | Abrir `/caminho-inexistente` | 404 | [ ] |

## 10 · API

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 10.1 | `https://components-servidor.onrender.com/api/saude` | `{"ok":true}` (hoje falha: A-38) | [ ] |
| 10.2 | `/api/saude` pelo domínio da Vercel | `{"ok":true}` | [ ] |
| 10.3 | Medir a primeira resposta com o Render dormindo | Anotar segundos e se a Vercel devolveu erro antes (A-41) | [ ] |
| 10.4 | `/api/nao-existe` | 404 em JSON | [ ] |

## 11 · Celular e temas

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 11.1 | Hub em 390 px de largura | Sem rolagem horizontal; menu utilizável | [ ] |
| 11.2 | Cada filho em 390 px | Botões alcançáveis, textos legíveis | [ ] |
| 11.3 | Girar para paisagem | Layout se ajusta | [ ] |
| 11.4 | Sistema em modo claro e em modo escuro | Seções mantêm seus temas próprios (claro/escuro por seção) e contraste legível | [ ] |
| 11.5 | Zoom de 200% no computador | Conteúdo continua utilizável | [ ] |
