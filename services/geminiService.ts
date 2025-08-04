
import { GoogleGenAI, Type } from "@google/genai";

// Ensure API_KEY is available in the environment.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might have a more sophisticated config system.
  // For this environment, we rely on it being set.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface SongInfo {
    title: string;
    artist: string;
}

export const extractSongInfo = async (youtubeUrl: string): Promise<SongInfo> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Extrae el título de la canción y el artista principal del siguiente enlace de YouTube: ${youtubeUrl}. Devuelve solo el título y el artista. No incluyas "feat.", "ft.", "con" o artistas invitados en el nombre del artista.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "El título exacto de la canción."
                        },
                        artist: {
                            type: Type.STRING,
                            description: "El nombre del artista o banda principal."
                        }
                    },
                    required: ["title", "artist"]
                },
            }
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);

        if (parsed && typeof parsed.title === 'string' && typeof parsed.artist === 'string') {
            return parsed as SongInfo;
        } else {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

    } catch (error) {
        console.error("Error al contactar la API de Gemini:", error);
        throw new Error("No se pudo extraer la información de la canción. Por favor, introdúcela manualmente.");
    }
};
