const { sql } = require('./_db');
const { requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Criação de pedido: pública (é o checkout do site)
      const b = req.body || {};
      if (!Array.isArray(b.itens) || !b.itens.length) {
        return res.status(400).json({ error: 'Pedido vazio.' });
      }
      const [linha] = await sql`
        INSERT INTO pedidos (itens, total, cliente_nome, cliente_contato)
        VALUES (${JSON.stringify(b.itens)}::jsonb, ${b.total || 0}, ${b.cliente_nome || null}, ${b.cliente_contato || null})
        RETURNING *
      `;
      return res.status(201).json(linha);
    }

    // Demais métodos: só o painel admin
    const auth = requireAuth(req);
    if (!auth) return res.status(401).json({ error: 'Não autorizado.' });

    if (req.method === 'GET') {
      const linhas = await sql`SELECT * FROM pedidos ORDER BY criado_em DESC`;
      return res.status(200).json(linhas);
    }

    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'ID obrigatório.' });
      const [linha] = await sql`UPDATE pedidos SET status = ${b.status} WHERE id = ${b.id} RETURNING *`;
      return res.status(200).json(linha);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'ID obrigatório.' });
      await sql`DELETE FROM pedidos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
