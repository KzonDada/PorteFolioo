import { readFileSync } from "fs";
import { join } from "path";

export async function handler() {
  try {
    const filePath = join(process.cwd(), "netlify/functions/journal.json");
    const data = readFileSync(filePath, "utf8");
    const entries = JSON.parse(data);
    return {
      statusCode: 200,
      body: JSON.stringify(entries),
    };
  } catch (err) {
    return { statusCode: 500, body: "Erreur lors de la lecture du journal" };
  }
}
