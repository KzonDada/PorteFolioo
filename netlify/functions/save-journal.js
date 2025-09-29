import pkg from "pg";
const { Client } = pkg;

export async function handler(event) {
  const { date, realisations, notes } = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(
      "INSERT INTO journal (date, realisations, notes) VALUES ($1, $2, $3)",
      [date, realisations, notes]
    );
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Entrée ajoutée avec succès" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible d'enregistrer l'entrée." }),
    };
  }
}