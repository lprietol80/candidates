import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

export async function getGrokinfo(candidateName) {
  let xaiInfo;

  const client = new OpenAI({
    apiKey:"xai-cmQdskpvvPOIuWKA2m0tZJlomMDTEHLeb4hUpL5x0Qlcl8Cvn64m2w0Gc8R69pxaqKULysVnvOkMAymy",
    baseURL:"https://api.x.ai/v1",
  });

  const completion = await client.chat.completions.create({

    model: "grok-3-mini-latest",
    messages: [
          { 
            role: "user", 
            content: `Actúe como un analista político con una visión conservadora que promueve los valores de la familia tradicional, la defensa de la vida desde la concepción, el respaldo a las uniones exclusivamente heterosexuales y el apoyo a una migración regulada y legal. Redacte un análisis objetivo y profesional, de máximo 500 palabras, sobre el candidato ${candidateName} para las elecciones del 2026 en Colombia. Incluya su ideología política, trayectoria profesional, principales propuestas de campaña, posturas en temas clave relacionados con los valores mencionados, y su viabilidad electoral. Evite lenguaje polarizante y fundamente las observaciones en hechos comprobables o declaraciones públicas del candidato. El análisis no debe incluir título ni total de palabras`
          }]
    });
    xaiInfo= completion.choices[0].message.content || "Resumen proporcionado por la IA";
    return xaiInfo;
  }


