
import { GoogleGenAI } from "@google/genai";

export async function colorizeImage(base64Data: string, mimeType: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Please colorize this black and white photograph. Restore the natural colors as accurately as possible, making it look vibrant yet realistic. Preserve all the textures and details from the original image. Ensure skin tones, foliage, and sky look authentic.",
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("Invalid response format from AI model.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image. Please try again with a clearer photo.");
  } catch (error: any) {
    console.error("Gemini Colorization Error:", error);
    if (error.message?.includes("API key")) {
      throw new Error("Invalid API Key or quota exceeded.");
    }
    throw new Error(error.message || "An unexpected error occurred during colorization.");
  }
}
