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
}): Promise<z.infer<TSchema>> {
  const { contents, schema, model, maxOutputTokens } = opts;

  console.log("Calling Gemini with contents type:", typeof contents);

  const response = await ai.models.generateContent({
    model: model ?? MODEL,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(schema),
      maxOutputTokens: maxOutputTokens ?? MAX_TOKENS,
    },
  });

  const fullText = response.text;
  console.log("Gemini full response:", fullText);

  if (!fullText || !fullText.trim()) {
    throw new Error("Gemini returned empty or undefined result");
  }

  let json: any;
  try {
    json = JSON.parse(fullText);
  } catch (parseError) {
    console.error("Failed to parse as JSON:", parseError);
    console.error("Raw response:", fullText);
    throw new Error(`Invalid JSON response from Gemini: ${fullText}`);
  }

  // Gemini sometimes returns JSON as a string literal; attempt a second parse before failing.
  if (typeof json === "string") {
    const trimmed = json.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        json = JSON.parse(trimmed);
      } catch (nestedParseError) {
        console.error("Failed to parse nested JSON string:", nestedParseError);
        console.error("Nested JSON candidate:", json);
        throw new Error(
          `Gemini returned a JSON string that could not be parsed. ` +
            `Received: ${json}. Error: ${(nestedParseError as Error).message}`,
        );
      }
    }
  }

  // Bail out if a primitive remains after the nested parse attempt.
  if (typeof json === "string" || typeof json === "number" || typeof json === "boolean" || json === null) {
    console.error("❌ Received primitive value instead of structured object");
    console.error("Received:", json);
    console.error("Expected schema:", zodToJsonSchema(schema));
    throw new Error(
      `Gemini returned a primitive value instead of structured data. ` +
        `Expected JSON compatible with the schema but received: ${JSON.stringify(json)}`,
    );
  }

  console.log("Parsed JSON:", json);

  try {
    const validated = schema.parse(json);
    console.log("Validated result:", validated);
    return validated; // ← THIS WAS MISSING
  } catch (validationError) {
    console.error("Schema validation failed:", validationError);
    console.error("Received data:", json);
    console.error("Expected schema:", zodToJsonSchema(schema));
    throw validationError;
  }
}
