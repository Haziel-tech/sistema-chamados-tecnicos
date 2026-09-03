const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica se a requisição possui um token JWT válido
 * no header Authorization: Bearer <token>.
 * Se válido, anexa os dados do usuário decodificado em req.usuario.
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado; // { id, papel, nome, email }
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

/**
 * Middleware factory que restringe o acesso a determinados papéis.
 * Uso: autorizar('admin', 'tecnico')
 */
function autorizar(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    if (!papeisPermitidos.includes(req.usuario.papel)) {
      return res.status(403).json({ erro: 'Acesso negado para este papel de usuário' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
