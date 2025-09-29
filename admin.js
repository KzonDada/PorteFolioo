document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("journalForm");

  loadEntries(); // Charger les entrées existantes

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const realisations = document.getElementById("realisations").value;
    const notes = document.getElementById("notes").value || "";

    const newEntry = { date, realisations, notes };

    try {
      const res = await fetch("/.netlify/functions/save-journal", {
        method: "POST",
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      form.reset();
      loadEntries();
    } catch (err) {
      console.error(err);
      alert("Impossible d'ajouter l'entrée.");
    }
  });
});

async function loadEntries() {
  try {
    const res = await fetch("/.netlify/functions/get-journal");
    if (!res.ok) throw new Error("Erreur fetch journal");
    const entries = await res.json();

    const tbody = document.querySelector("#journalTable tbody");
    tbody.innerHTML = "";

    entries.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.realisations}</td>
        <td>${entry.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Impossible de charger les entrées du journal.");
  }
}