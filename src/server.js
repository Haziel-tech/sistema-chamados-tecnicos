require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const contextoGraphQL = require('./graphql/context');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');

async function iniciar() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Rota de verificação de saúde da API
  app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Sistema de Chamados Técnicos no ar' });
  });

  // Rotas REST
  app.use('/auth', authRoutes);
  app.use('/usuarios', usuarioRoutes);
  app.use('/categorias', categoriaRoutes);
  app.use('/chamados', chamadoRoutes);

  // Servidor GraphQL (Apollo)
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextoGraphQL,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor REST rodando em http://localhost:${PORT}`);
    console.log(`Endpoint GraphQL em http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

iniciar().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});
