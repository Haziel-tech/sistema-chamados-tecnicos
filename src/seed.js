require('dotenv').config();
const connectDB = require('./config/db');
const Usuario = require('./models/Usuario');
const Categoria = require('./models/Categoria');

async function seed() {
  await connectDB();

  const adminExistente = await Usuario.findOne({ email: 'admin@chamados.com' });
  if (!adminExistente) {
    await Usuario.create({
      nome: 'Administrador',
      email: 'admin@chamados.com',
      senha: 'admin123',
      papel: 'admin',
    });
    console.log('Usuário admin criado: admin@chamados.com / senha: admin123');
  } else {
    console.log('Usuário admin já existe, pulando...');
  }

  const categorias = ['Hardware', 'Software', 'Rede', 'Impressoras', 'Acesso e Login'];
  for (const nome of categorias) {
    const existe = await Categoria.findOne({ nome });
    if (!existe) {
      await Categoria.create({ nome });
      console.log(`Categoria criada: ${nome}`);
    }
  }

  console.log('Seed concluído.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});
