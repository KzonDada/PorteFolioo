const { Client } = require('pg');

exports.handler = async function(event, context) {
  const client = new Client({
    connectionString: process.env.NEON_CONNECTION,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const res = await client.query('SELECT content, updated_at FROM journal WHERE id = 1');
    await client.end();

    if (res.rows.length === 0) {
      return { statusCode: 404, body: 'Journal non trouvé' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res.rows[0]),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Erreur serveur' };
  }
};