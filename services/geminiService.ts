
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-3-pro-image-preview';

export async function synthesizeImages(imageA: string, imageB: string): Promise<string> {
  // Use the most up-to-date API key from selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageAPart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageA.split(',')[1],
    },
  };
  
  const imageBPart = {
    inlineData: {
      mimeType: 'image/png',
      data: imageB.split(',')[1],
    },
  };

  const textPart = {
    text: `
      ## ROLE: AUTONOMOUS IDENTITY & POSE SYNTHESIZER
      You are a high-end visual effects engine. Your goal is to generate a final image based solely on the two provided inputs (Image A and Image B).
      
      ## THE "ZERO-PROMPT" LOGIC:
      1. **PRIMARY SUBJECT (Image A):** Treat the person in Image A as the 'Lead Actor'. Lock their facial geometry, skin texture, hair color/style, and exact wardrobe.
      2. **ENVIRONMENT (Image A):** Use the background, lighting temperature, and camera depth-of-field from Image A as the 'Set'.
      3. **ACTION & PROPS (Image B):** Treat Image B as the 'Stunt Double'. Extract the exact skeletal pose, hand/finger articulation, and any handheld objects (props).
      
      ## NATURALISM & PHYSICS:
      - Retain natural micro-textures from Image A.
      - Render accurate shadows cast by the new pose from Image B using Image A's lighting.
      - Ensure contact points with props are physically grounded.
      
      Generate a single high-fidelity image that merges these perfectly.
    `
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { 
        parts: [
          { text: "Image A (Identity/Set):" },
          imageAPart, 
          { text: "Image B (Pose/Props):" },
          imageBPart, 
          textPart
        ] 
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image part found in model response");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
}
