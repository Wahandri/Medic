import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { symptoms, remedyType, duration, restrictions } = await request.json();

    const prompt = `
      Eres un experto en medicina tradicional y remedios naturales. Genera un remedio casero seguro en formato JSON con:

      PARÁMETROS:
      - Síntomas: ${symptoms.join(", ")}
      - Tipo: ${remedyType}
      - Duración: ${duration}
      - Restricciones: ${restrictions}

      FORMATO REQUERIDO (SOLO JSON):
      {
        "ok": true,
        "warningmessage": null,
        "title": "Nombre creativo del remedio",
        "symptoms": ["síntoma1", "síntoma2"],
        "ingredients": ["Ingrediente1 + cantidad/detalle", "Ingrediente2 + cantidad"],
        "preparation": [
          "1. Paso detallado de preparación",
          "2. Indicaciones claras"
        ],
        "application": [
          "• Forma de aplicación",
          "• Frecuencia de uso"
        ],
        "warnings": "Advertencias importantes de seguridad",
        "tips": "Consejos adicionales"
      }

      INSTRUCCIONES CRÍTICAS:
      1. Priorizar seguridad y claridad
      2. Considerar restricciones médicas
      3. Si algún ingrediente es peligroso, activar "ok": false
      4. Incluir advertencias sobre uso prolongado
      5. Evitar combinaciones riesgosas
      6. Si los síntomas son graves, recomendar consulta médica
      7. Usar lenguaje claro y no técnico
      8. Incluir tiempos de preparación y aplicación
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rawContent = response.choices[0].message.content;
    const jsonMatch = rawContent.match(/{[\s\S]*}/);
    const remedy = JSON.parse(jsonMatch[0]);

    if (remedy.warnings.toLowerCase().includes("consultar médico")) {
      remedy.ok = false;
      remedy.warningmessage = "⚠️ Síntomas graves detectados: Recomendamos consultar urgentemente con un profesional médico.";
    }

    return NextResponse.json(remedy);
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ 
      error: "Error generando el remedio",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    }, { status: 500 });
  }
}