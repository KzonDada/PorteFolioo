import fs from "fs";
import path from "path";

export async function handler(event) {
  const filePath = path.join(process.cwd(), "data", "journal.json");

  try {
    const newEntry = JSON.parse(event.body);

    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
    const data = fs.readFileSync(filePath, "utf-8");
    const entries = JSON.parse(data);
    entries.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Entrée ajoutée avec succès" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible d'enregistrer l'entrée." }),
    };
  }
}