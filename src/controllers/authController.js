const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha' });
    }

    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao realizar login', detalhe: error.message });
  }
};

exports.gerarToken = gerarToken;
