import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config()

const promtCandidateInfo= "Proporciona un resumen breve de la trayectoria política y propuestas de "

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  //baseURL: "https://api.x.ai/v1",
});

export async function getGrokinfo(candidateName) {
  try {
    const xaiResponse = await client.chat.completions.create({
      model: "grok-3-mini", //grok-3
      Messages:[
        {role: "user",
        content:`
        Actúe como un analista político con una visión conservadora que promueve los valores de la familia tradicional, la defensa de la vida desde la concepción, el respaldo a las uniones exclusivamente heterosexuales y el apoyo a una migración regulada y legal. Redacte un análisis objetivo y profesional, de máximo seis párrafos, sobre el candidato ${candidateName}. Incluya su ideología política, trayectoria profesional, principales propuestas de campaña, posturas en temas clave relacionados con los valores mencionados, y su viabilidad electoral. Evite lenguaje polarizante y fundamente las observaciones en hechos comprobables o declaraciones públicas del candidato.
        
        `}
      ]
    }
    );
    return xaiResponse.data.info || 'Resumen proporcionado por el LLM';
  } catch (error) {
    console.error('Error fetching LLM info:', error.message);
    return 'Error al obtener información del XAI';
  }
  
};

// // OPENAI
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Asegúrate de definir la clave de API
// });
// export async function getOpenAIinfo (candidateName) {
//   try {
//     const openAiResponse = await openai.responses.create({
//       model: "gpt-4.1-mini", // o "gpt-3.5-turbo" si no tienes acceso a GPT-4
//       input:`
//               Actúe como un analista político con una visión conservadora que promueve los valores de la familia tradicional, la defensa de la vida desde la concepción, el respaldo a las uniones exclusivamente heterosexuales y el apoyo a una migración regulada y legal. Redacte un análisis objetivo y profesional, de máximo seis párrafos, sobre el candidato ${candidateName}. Incluya su ideología política, trayectoria profesional, principales propuestas de campaña, posturas en temas clave relacionados con los valores mencionados, y su viabilidad electoral. Evite lenguaje polarizante y fundamente las observaciones en hechos comprobables o declaraciones públicas del candidato.
//       `,
//     });
//     //return openAiResponse.data.choices[0].message.content || "Resumen proporcionado por el LLM"
//     return openAiResponse.choices?.[0]?.message?.content || "Resumen proporcionado por el LLM";
//   } catch (error) {
//     console.error("Error al comunicarse con la API de OpenAI:", error);
//     return "Error al obtener la información de OpenAI";
//   }

  
// }


