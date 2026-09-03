const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Usuario {
    id: ID!
    nome: String!
    email: String!
    papel: String!
    ativo: Boolean!
  }

  type Categoria {
    id: ID!
    nome: String!
    descricao: String
  }

  type Comentario {
    id: ID!
    texto: String!
    autor: Usuario!
    createdAt: String!
  }

  type Chamado {
    id: ID!
    titulo: String!
    descricao: String!
    categoria: Categoria!
    prioridade: String!
    status: String!
    solicitante: Usuario!
    tecnicoResponsavel: Usuario
    comentarios: [Comentario!]!
    createdAt: String!
    updatedAt: String!
  }

  # Consultas combinadas — útil para dashboards e filtros ricos
  input FiltroChamados {
    status: String
    prioridade: String
    categoria: ID
    tecnicoResponsavel: ID
  }

  type Query {
    chamados(filtro: FiltroChamados): [Chamado!]!
    chamado(id: ID!): Chamado
    categorias: [Categoria!]!
    usuarios: [Usuario!]!
  }

  type Mutation {
    criarChamado(
      titulo: String!
      descricao: String!
      categoria: ID!
      prioridade: String
    ): Chamado!

    atualizarStatusChamado(
      id: ID!
      status: String!
      tecnicoResponsavel: ID
    ): Chamado!

    adicionarComentario(chamadoId: ID!, texto: String!): Comentario!
  }
`;

module.exports = typeDefs;
