import fs from "fs";
import path from "path";

export async function handler() {
  const filePath = path.join(process.cwd(), "data", "journal.json");

  try {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
    const data = fs.readFileSync(filePath, "utf-8");
    const entries = JSON.parse(data);
    return {
      statusCode: 200,
      body: JSON.stringify(entries),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible de charger le journal." }),
    };
  }
}