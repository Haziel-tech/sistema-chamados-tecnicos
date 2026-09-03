const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema(
  {
    chamado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chamado',
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    texto: {
      type: String,
      required: [true, 'O texto do comentário é obrigatório'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comentario', ComentarioSchema);
