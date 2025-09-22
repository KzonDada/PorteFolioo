const { Client } = require('pg');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.NEON_CONNECTION,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const data = JSON.parse(event.body);
    const query = `
      INSERT INTO journal (id, content, updated_at) 
      VALUES (1, $1, NOW())
      ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
    `;
    await client.query(query, [data.content]);
    await client.end();

    return { statusCode: 200, body: 'Journal sauvegardé avec succès' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Erreur serveur' };
  }
};