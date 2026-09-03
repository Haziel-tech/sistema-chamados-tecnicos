const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const Chamado = require('../models/Chamado');
const Categoria = require('../models/Categoria');
const Usuario = require('../models/Usuario');
const Comentario = require('../models/Comentario');

function exigirAutenticacao(context) {
  if (!context.usuario) {
    throw new AuthenticationError('Usuário não autenticado');
  }
}

function exigirPapel(context, ...papeis) {
  exigirAutenticacao(context);
  if (!papeis.includes(context.usuario.papel)) {
    throw new ForbiddenError('Acesso negado para este papel de usuário');
  }
}

const resolvers = {
  Query: {
    chamados: async (_, { filtro }, context) => {
      exigirAutenticacao(context);
      const query = { ...filtro };
      if (context.usuario.papel === 'funcionario') {
        query.solicitante = context.usuario.id;
      }
      return Chamado.find(query).sort({ createdAt: -1 });
    },
    chamado: async (_, { id }, context) => {
      exigirAutenticacao(context);
      return Chamado.findById(id);
    },
    categorias: async (_, __, context) => {
      exigirAutenticacao(context);
      return Categoria.find().sort({ nome: 1 });
    },
    usuarios: async (_, __, context) => {
      exigirPapel(context, 'admin');
      return Usuario.find();
    },
  },

  Mutation: {
    criarChamado: async (_, { titulo, descricao, categoria, prioridade }, context) => {
      exigirAutenticacao(context);
      return Chamado.create({
        titulo,
        descricao,
        categoria,
        prioridade,
        solicitante: context.usuario.id,
      });
    },
    atualizarStatusChamado: async (_, { id, status, tecnicoResponsavel }, context) => {
      exigirPapel(context, 'tecnico', 'admin');
      const dados = { status };
      if (tecnicoResponsavel) dados.tecnicoResponsavel = tecnicoResponsavel;
      if (status === 'fechado' || status === 'resolvido') dados.dataFechamento = new Date();
      return Chamado.findByIdAndUpdate(id, dados, { new: true, runValidators: true });
    },
    adicionarComentario: async (_, { chamadoId, texto }, context) => {
      exigirAutenticacao(context);
      return Comentario.create({
        chamado: chamadoId,
        autor: context.usuario.id,
        texto,
      });
    },
  },

  // Resolvers de campo para popular relacionamentos automaticamente
  Chamado: {
    id: (chamado) => chamado._id.toString(),
    categoria: (chamado) => Categoria.findById(chamado.categoria),
    solicitante: (chamado) => Usuario.findById(chamado.solicitante),
    tecnicoResponsavel: (chamado) =>
      chamado.tecnicoResponsavel ? Usuario.findById(chamado.tecnicoResponsavel) : null,
    comentarios: (chamado) => Comentario.find({ chamado: chamado._id }).sort({ createdAt: 1 }),
  },
  Comentario: {
    id: (comentario) => comentario._id.toString(),
    autor: (comentario) => Usuario.findById(comentario.autor),
    createdAt: (comentario) => comentario.createdAt.toISOString(),
  },
  Categoria: {
    id: (categoria) => categoria._id.toString(),
  },
  Usuario: {
    id: (usuario) => usuario._id.toString(),
  },
};

module.exports = resolvers;
