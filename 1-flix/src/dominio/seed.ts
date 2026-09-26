/*
 * Catálogo inicial do Flix: vídeos públicos e curtos sobre programação
 * (série "in 100 Seconds" e guias do canal Fireship), em 4 categorias.
 * Títulos são os originais do YouTube; descrições são resumos próprios.
 */
import { normalizar } from './catalogo'
import type { Catalogo } from './tipos'

const canal = 'Fireship'

const base: Catalogo = {
  versao: 1,
  categorias: [
    { id: 'front-end', nome: 'Front End', cor: '#E8A33D' },
    { id: 'back-end', nome: 'Back End', cor: '#1F4FD6' },
    { id: 'mobile', nome: 'Mobile', cor: '#0F7A5A' },
    { id: 'ferramentas', nome: 'Ferramentas', cor: '#6B2BD9' },
  ],
  videos: [
    {
      id: 'react-100',
      titulo: 'React in 100 Seconds',
      descricao:
        'Componentes, JSX, estado e props: o essencial do React explicado num resumo rápido, ótimo para revisar os conceitos antes de começar um projeto.',
      youtubeId: 'Tn6-PIqc4UM',
      categoriaId: 'front-end',
      canal,
    },
    {
      id: 'typescript-100',
      titulo: 'TypeScript in 100 Seconds',
      descricao:
        'Como a tipagem estática do TypeScript pega erros antes da execução e melhora o autocompletar do editor.',
      youtubeId: 'zQnBQ4tB3ZA',
      categoriaId: 'front-end',
      canal,
    },
    {
      id: 'javascript-100',
      titulo: 'JavaScript in 100 Seconds',
      descricao:
        'A linguagem da web em poucos minutos: tipos, funções, eventos e onde o JavaScript roda hoje.',
      youtubeId: 'DHjqpvDnNGE',
      categoriaId: 'front-end',
      canal,
    },
    {
      id: 'redux-100',
      titulo: 'Redux in 100 Seconds',
      descricao:
        'Store, actions e reducers: o padrão de estado global que inspirou o Redux Toolkit usado no projeto Tarefas.',
      youtubeId: '_shA5Xwe8_4',
      categoriaId: 'front-end',
      canal,
    },
    {
      id: 'node-guia',
      titulo: 'Node.js Ultimate Beginner’s Guide in 7 Easy Steps',
      descricao:
        'Do "olá, mundo" a um servidor web: módulos, eventos, sistema de arquivos e npm, passo a passo.',
      youtubeId: 'ENrzD9HAZK4',
      categoriaId: 'back-end',
      canal,
    },
    {
      id: 'sql-100',
      titulo: 'SQL Explained in 100 Seconds',
      descricao:
        'Tabelas, consultas e junções: a base dos bancos relacionais que guardam os dados das APIs.',
      youtubeId: 'zsjvFFKOm3c',
      categoriaId: 'back-end',
      canal,
    },
    {
      id: 'graphql-100',
      titulo: 'GraphQL Explained in 100 Seconds',
      descricao:
        'Uma alternativa ao REST em que o cliente pede exatamente os campos de que precisa.',
      youtubeId: 'eIQh02xuVw4',
      categoriaId: 'back-end',
      canal,
    },
    {
      id: 'flutter-100',
      titulo: 'Flutter in 100 seconds',
      descricao:
        'O kit de interface do Google para criar apps para celular, web e desktop com um único código.',
      youtubeId: 'lHhRhPV--G0',
      categoriaId: 'mobile',
      canal,
    },
    {
      id: 'react-native-100',
      titulo: 'React Native in 100 Seconds',
      descricao: 'Como levar o que você já sabe de React para apps nativos de Android e iOS.',
      youtubeId: 'gvkqT_Uoahw',
      categoriaId: 'mobile',
      canal,
    },
    {
      id: 'expo-100',
      titulo: 'Expo in 100 Seconds',
      descricao:
        'Ferramentas que simplificam criar, testar e publicar apps React Native sem configurar tudo à mão.',
      youtubeId: 'vFW_TxKLyrE',
      categoriaId: 'mobile',
      canal,
    },
    {
      id: 'kotlin-100',
      titulo: 'Kotlin in 100 Seconds',
      descricao: 'A linguagem moderna e concisa preferida para desenvolvimento Android.',
      youtubeId: 'xT8oP0wy-A0',
      categoriaId: 'mobile',
      canal,
    },
    {
      id: 'git-100',
      titulo: 'Git Explained in 100 Seconds',
      descricao:
        'Commits, branches e merges: o controle de versão que guarda toda a história deste monorepo.',
      youtubeId: 'hwP7WQkmECE',
      categoriaId: 'ferramentas',
      canal,
    },
    {
      id: 'docker-100',
      titulo: 'Docker in 100 Seconds',
      descricao:
        'Contêineres que empacotam a aplicação com tudo de que ela precisa para rodar igual em qualquer máquina.',
      youtubeId: 'Gjnup-PuquQ',
      categoriaId: 'ferramentas',
      canal,
    },
  ],
  categoriaBannerId: 'front-end',
  destaquePorCategoria: {},
}

/* Devolve uma cópia nova do catálogo inicial, já normalizada. */
export function catalogoInicial(): Catalogo {
  return normalizar(structuredClone(base))
}
/* Fim do catálogo inicial. */
