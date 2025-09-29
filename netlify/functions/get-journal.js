import pkg from "pg";
const { Client } = pkg;

export async function handler() {
  const client = new Client({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query("SELECT * FROM journal ORDER BY date DESC");
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible de charger le journal." }),
    };
  }
}