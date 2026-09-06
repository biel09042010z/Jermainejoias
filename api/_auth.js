const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'jermaine-joias-troque-este-segredo';
const DURACAO_MS = 1000 * 60 * 60 * 12; // 12 horas

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(email) {
  const payload = base64url(JSON.stringify({ email, exp: Date.now() + DURACAO_MS }));
  const assinatura = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${assinatura}`;
}

function verify(token) {
  if (!token) return null;
  const [payload, assinatura] = token.split('.');
  if (!payload || !assinatura) return null;
  const esperado = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (assinatura !== esperado) return null;
  try {
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!dados.exp || dados.exp < Date.now()) return null;
    return dados;
  } catch {
    return null;
  }
}

function requireAuth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  return verify(token);
}

module.exports = { sign, verify, requireAuth };
