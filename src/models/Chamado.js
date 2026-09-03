const mongoose = require('mongoose');

const STATUS = ['aberto', 'em_andamento', 'resolvido', 'fechado'];
const PRIORIDADES = ['baixa', 'media', 'alta', 'urgente'];

const ChamadoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'A descrição é obrigatória'],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'A categoria é obrigatória'],
    },
    prioridade: {
      type: String,
      enum: PRIORIDADES,
      default: 'media',
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'aberto',
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    tecnicoResponsavel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    dataFechamento: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chamado', ChamadoSchema);
module.exports.STATUS = STATUS;
module.exports.PRIORIDADES = PRIORIDADES;
