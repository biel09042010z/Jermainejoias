const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL não configurada — configure essa variável de ambiente na Vercel.');
}

const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
