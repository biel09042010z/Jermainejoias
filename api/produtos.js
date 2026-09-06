const { sql } = require('./_db');
const { requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const querendoTodos = req.query.all === '1';
      if (querendoTodos) {
        const auth = requireAuth(req);
        if (!auth) return res.status(401).json({ error: 'Não autorizado.' });
        const linhas = await sql`SELECT * FROM produtos ORDER BY id DESC`;
        return res.status(200).json(linhas);
      }
      // Público: só produtos ativos, para o site
      const linhas = await sql`
        SELECT * FROM produtos WHERE ativo = true ORDER BY destaque DESC, id DESC
      `;
      return res.status(200).json(linhas);
    }

    const auth = requireAuth(req);
    if (!auth) return res.status(401).json({ error: 'Não autorizado.' });

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.nome || !b.categoria || !b.preco) {
        return res.status(400).json({ error: 'Preencha nome, categoria e preço.' });
      }
      const [linha] = await sql`
        INSERT INTO produtos
          (nome, categoria, preco, preco_antigo, avaliacao, tag, descricao, materiais, dimensoes, cuidados, garantia, entrega, tamanhos, imagem_url, destaque, ativo)
        VALUES
          (${b.nome}, ${b.categoria}, ${b.preco}, ${b.preco_antigo || null}, ${b.avaliacao || 5}, ${b.tag || null},
           ${b.descricao || null}, ${b.materiais || null}, ${b.dimensoes || null}, ${b.cuidados || null},
           ${b.garantia || null}, ${b.entrega || null}, ${b.tamanhos || null}, ${b.imagem_url || null},
           ${!!b.destaque}, ${b.ativo !== false})
        RETURNING *
      `;
      return res.status(201).json(linha);
    }

    if (req.method === 'PUT') {
      const b = req.body || {};
      if (!b.id) return res.status(400).json({ error: 'ID obrigatório.' });
      const [linha] = await sql`
        UPDATE produtos SET
          nome = ${b.nome},
          categoria = ${b.categoria},
          preco = ${b.preco},
          preco_antigo = ${b.preco_antigo || null},
          avaliacao = ${b.avaliacao || 5},
          tag = ${b.tag || null},
          descricao = ${b.descricao || null},
          materiais = ${b.materiais || null},
          dimensoes = ${b.dimensoes || null},
          cuidados = ${b.cuidados || null},
          garantia = ${b.garantia || null},
          entrega = ${b.entrega || null},
          tamanhos = ${b.tamanhos || null},
          imagem_url = ${b.imagem_url || null},
          destaque = ${!!b.destaque},
          ativo = ${b.ativo !== false}
        WHERE id = ${b.id}
        RETURNING *
      `;
      return res.status(200).json(linha);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'ID obrigatório.' });
      await sql`DELETE FROM produtos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
