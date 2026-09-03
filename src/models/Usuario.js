const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PAPEIS = ['funcionario', 'tecnico', 'admin'];

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: 6,
      select: false, // não retorna a senha nas consultas por padrão
    },
    papel: {
      type: String,
      enum: PAPEIS,
      default: 'funcionario',
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Criptografa a senha antes de salvar, apenas se ela foi modificada
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método de instância para comparar senha informada com o hash salvo
UsuarioSchema.methods.compararSenha = async function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
module.exports.PAPEIS = PAPEIS;
