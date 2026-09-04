const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chamados_tecnicos';
    await mongoose.connect(uri);
    console.log(`[MongoDB] Conectado com sucesso em: ${uri}`);
  } catch (error) {
    console.error('[MongoDB] Erro ao conectar:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

/**
 * Conecta a aplicação ao MongoDB usando a string de conexão
 * definida em MONGODB_URI (arquivo .env).
 */
