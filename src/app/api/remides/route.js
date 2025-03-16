import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para limpiar el JSON
function cleanJson(jsonString) {
  return jsonString.replace(/,\s*([\]}])/g, '$1');
}

// Contexto inicial que se enviará una sola vez
const initialContext = `
Eres un experto en medicina tradicional y remedios naturales con 30 años de experiencia. Tu tarea es generar remedios caseros  seguros **en formato JSON** basados en los parámetros que te proporcionaré.

📌 **Formato estricto esperado en la respuesta**: SOLO DEVOLVERÁS UN JSON. Sin nada antes ni después.
{
  "ok": true,
  "warningmessage": null,
  "title": "Nombre del remedio",
  "symptoms": ["síntoma1", "síntoma2"],
  "ingredients": [
    "Ingrediente1 + cantidad/detalle",
    "Ingrediente2 + cantidad"
  ],
  "preparation": [
    "1. Paso detallado de preparación",
    "2. Indicaciones claras"
  ],
  "warnings": "Advertencias importantes de seguridad",
  "tips": "Consejos adicionales"
}

📌 **Instrucciones obligatorias**:
1 **Formato de salida:** Solo responde en **JSON válido**, sin texto adicional.  
2 **Ingredientes:** Devuelve solo una lista de nombres de ingredientes (de españa) con cantidades exactas.  
3 **Pasos de preparación:** Explica cada paso con **claridad**, incluyendo tiempos de preparación si es necesario.  
4 **Remedios únicos:** Evita generar remedios repetitivos o sin sentido. 
5 **Enfermedad grave:** Si la enfermedad es grave, **igualmente aconsejaras un remedio casero** pero en "tips" diras que necesita ayuda de un medico.
6 **Coherencia:** 
   - Si se especifica una restricción médica, **evita** ingredientes que la contradigan.
   - El remedio debe ser **realista y factible** con los síntomas dados.
7 **Nombre del remedio:** Debe ser **Simple y claro**.

📌 **Instrucciones para "symptoms":**:
1 El usuario proporcionará una lista de síntomas que deben ser tratados con el remedio.
2 Los síntomas deben ser **simples y claros** (ej: "dolor de cabeza", "tos", "insomnio").
3 El usuario podra introducir la "enfermedad" en lugar de los sintomas. (ej: "gripe", "esguince" "resfriado", "soriasis capilar", "jaqueca", etc..).
4 Si los sintomas son graves o no son remediables con remedios caseros, **deberás indicar que el usuario necesita atención médica** en "warnings" (ej: Cancer, Emoragia graves, huesos rotos).
   
🚨 **INSTRUCCIONES PARA "warningmessage":** 
1 **Ingredientes no compatibles con las restricciones:** Si el remedio contiene ingredientes que contradicen las restricciones, activa "ok": false y explica en "warningmessage".
2 **Síntomas inválidos:** Si la lista contiene palabras que no son síntomas (sentimientos, conceptos, etc), activa "ok": false.  
3 **Advertencias:** Si el remedio **no es seguro o es peligroso** (ej: objetos, cosas, ingredientes peligrosos de ingerir), "ok": false y incluye un "warningmessage" explicando el motivo (**el mensaje tendrá un poco de humor**).  
4 **Si el remedio contiene nombres propios, conceptos, verbos o palabras que no son síntomas, activa "ok": false y explica en "warningmessage": "mensaje".**
`;

export async function POST(request) {
  try {
    const { symptoms, remedyType, duration, restrictions } = await request.json();

    console.log("📌 Síntomas recibidos:", symptoms);
    console.log("📌 Filtros -> Tipo de remedio:", remedyType, "| Duración:", duration, "| Restricciones:", restrictions);

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({ error: "Debes proporcionar síntomas." }, { status: 400 });
    }

    // Construir el prompt con los parámetros específicos
    const userPrompt = `
      📌 **Parámetros de entrada**:
      - Síntomas: ${symptoms.join(", ")}
      - Tipo de remedio: ${remedyType}
      - Duración: ${duration}
      - Restricciones: ${restrictions || "ninguna"}
    `;

    // Array de mensajes que incluye el contexto inicial y el prompt del usuario
    const messages = [
      { role: "system", content: initialContext }, // Contexto inicial
      { role: "user", content: userPrompt },       // Parámetros específicos
    ];

    console.log("📌 Enviando prompt a OpenAI...");

    // Llamada a la API de OpenAI con manejo de errores
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages, // Usar el array de mensajes
      temperature: 0.8,
    });

    // Validar la respuesta antes de intentar analizarla
    if (!response.choices || response.choices.length === 0 || !response.choices[0].message?.content) {
      console.error("❌ Respuesta inesperada de OpenAI:", response);
      return NextResponse.json({ error: "Respuesta inválida de OpenAI." }, { status: 500 });
    }

    // Limpiar la respuesta para extraer solo el JSON
    const rawContent = response.choices[0].message.content;

    // Intentar extraer el JSON de un bloque ```json ``` (si existe)
    let jsonContent = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

    // Si no se encuentra un bloque ```json ```, asumir que la respuesta es directamente un JSON
    if (!jsonContent || !jsonContent[1]) {
      jsonContent = rawContent; // Usar la respuesta completa como JSON
    } else {
      jsonContent = jsonContent[1].trim(); // Extraer el JSON del bloque ```json ```
    }

    // Validar que el contenido es un JSON válido
    if (!jsonContent) {
      console.error("❌ No se encontró JSON válido en la respuesta:", rawContent);
      return NextResponse.json({ error: "Formato de respuesta inválido." }, { status: 500 });
    }

    // Limpiar el JSON antes de analizarlo
    const cleanedJsonContent = cleanJson(jsonContent);

    let remedy;
    try {
      remedy = JSON.parse(cleanedJsonContent); // Analizar el JSON limpio
    } catch (error) {
      console.error("❌ Error al analizar JSON de OpenAI:", error, cleanedJsonContent);
      return NextResponse.json({ error: "Error al procesar la respuesta de OpenAI." }, { status: 500 });
    }

    console.log("📌 Remedio generado correctamente:", remedy);
    return NextResponse.json(remedy);
  } catch (error) {
    console.error("❌ Error en la API:", error);
    return NextResponse.json({ error: "Error al generar el remedio." }, { status: 500 });
  }
}