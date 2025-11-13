// services/gemini.ts
import { type Content, GoogleGenAI } from "@google/genai";
import { env } from "@numero/env";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const MODEL = "gemini-2.5-flash" as const;
const MAX_TOKENS = 2000;

export async function streamStructured<TSchema extends z.ZodTypeAny>(opts: {
  contents: string | Content[];
  schema: TSchema;
  model?: string;
  maxOutputTokens?: number;
  onChunk?: (partialJsonChunk: string) => void;
}): Promise<z.infer<TSchema>> {
  const { contents, schema, model, maxOutputTokens, onChunk } = opts;

  const stream = await ai.models.generateContentStream({
    model: model ?? MODEL,
    contents,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(schema),
      maxOutputTokens: maxOutputTokens ?? MAX_TOKENS,
    },
  });

  let fullText = "";

  for await (const chunk of stream) {
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!text) continue;

    fullText += text;
    onChunk?.(text);
  }

  if (!fullText.trim()) {
    throw new Error("Gemini streaming returned empty result");
  }

  const json = JSON.parse(fullText);
  return schema.parse(json);
}
