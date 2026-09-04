const jwt = require('jsonwebtoken');

function contextoGraphQL({ req }) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { usuario: null };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    return { usuario: decodificado };
  } catch (error) {
    return { usuario: null };
  }
}

module.exports = contextoGraphQL;

/**
 * Monta o contexto de cada requisição GraphQL, extraindo o usuário
 * autenticado a partir do header Authorization: Bearer <token>.
 * Se não houver token válido, context.usuario fica null (queries/mutations
 * que exigem autenticação vão barrar isso nos resolvers).
 */
