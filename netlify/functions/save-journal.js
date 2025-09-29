import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import formidable from "formidable-serverless";

export async function handler(event) {
  // Vérifie que la requête est en POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        return resolve({ statusCode: 500, body: "Erreur lors du parsing du formulaire" });
      }

      // Gestion du fichier si présent
      let fileData = {};
      if (files.file) {
        try {
          const filePath = files.file.filepath;
          const fileName = files.file.originalFilename;
          const fileBase64 = readFileSync(filePath, { encoding: "base64" });
          fileData = { fileName, fileBase64 };
        } catch (err) {
          console.log("Erreur lors de la lecture du fichier :", err);
        }
      }

      // Nouvelle entrée
      const newEntry = {
        date: fields.date,
        realisation: fields.realisation,
        notes: fields.notes || "",
        ...fileData
      };

      // Chemin vers le JSON
      const filePath = join(process.cwd(), "netlify/functions/journal.json");
      const data = readFileSync(filePath, "utf8");
      const entries = JSON.parse(data);

      // Ajoute l’entrée
      entries.push(newEntry);
      writeFileSync(filePath, JSON.stringify(entries, null, 2));

      resolve({ statusCode: 200, body: JSON.stringify({ message: "Entrée ajoutée avec succès" }) });
    });
  });
};
