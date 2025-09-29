import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    const newEntry = JSON.parse(event.body);

    const filePath = join(process.cwd(), "netlify/functions/journal.json");
    const data = readFileSync(filePath, "utf8");
    const entries = JSON.parse(data);

    entries.push(newEntry);
    writeFileSync(filePath, JSON.stringify(entries, null, 2));

    return { statusCode: 200, body: JSON.stringify({ message: "Entrée ajoutée" }) };
  } catch (err) {
    return { statusCode: 500, body: "Erreur lors de l'ajout de l'entrée" };
  }
}
