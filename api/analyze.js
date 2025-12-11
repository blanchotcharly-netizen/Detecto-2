import { Perplexity } from "perplexityai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { article } = req.body;
  if (!article) {
    return res.status(400).json({ error: "Article manquant" });
  }

  try {
    const client = new Perplexity({
      apiKey: process.env.PERPLEXITY_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "sonar-pro", // ou "sonar-small" pour moins cher
      messages: [
        {
          role: "system",
          content: `Tu es Detecto, un outil d'analyse des biais journalistiques. Analyse l'article pour : biais politiques/émotionnels/idéologiques, mots connotés, sources, frames, style, score de neutralité 0-100. Renvoie un JSON strict : {neutrality, biases, connotations, sources, frames}.`,
        },
        {
          role: "user",
          content: `Article :\n${article}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur Perplexity:", error);
    res.status(500).json({ error: "Analyse impossible" });
  }
}
