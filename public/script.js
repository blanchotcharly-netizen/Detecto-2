// Navigation landing → analyse
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".landing").classList.add("hidden");
  document.getElementById("analysis").classList.remove("hidden");
});

// Fonction d’analyse via l’API Perplexity
async function analyzeArticle(article) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article }),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur : impossible de générer l’analyse. Vérifie ta connexion.");
    return null;
  }
}

// Gestion du bouton Analyser
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const article = document.getElementById("inputText").value.trim();
  if (!article) {
    alert("Colle un article avant d’analyser.");
    return;
  }

  const loadingEl = document.getElementById("loading");
  loadingEl.classList.remove("hidden");

  const result = await analyzeArticle(article);
  loadingEl.classList.add("hidden");

  if (result) {
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("neutralityScore").textContent = result.neutrality;

    // Biais
    document.getElementById("biasList").innerHTML = result.biases
      .map((b) => `<li>${b}</li>`)
      .join("");

    // Mots connotés
    document.getElementById("connotationList").innerHTML = result.connotations
      .map((c) => `<li><strong>${c.mot}</strong> : ${c.explication}</li>`)
      .join("");

    // Sources
    document.getElementById("sourceList").innerHTML = result.sources
      .map((s) => `<li><strong>${s.citation}</strong> : ${s.analys}</li>`)
      .join("");

    // Frames
    document.getElementById("frameList").innerHTML = result.frames
      .map((f) => `<li>${f}</li>`)
      .join("");
  }
});
