const { sign } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha e-mail e senha.' });
  }

  const emailOk = email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const senhaOk = password === process.env.ADMIN_PASSWORD;

  if (!emailOk || !senhaOk) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = sign(email);
  return res.status(200).json({ token, email });
};
