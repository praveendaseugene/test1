"use server";

import { analyzeVisuals } from "@/ai/flows/analyze-visuals";
import { suggestUseCases } from "@/ai/flows/suggest-use-cases";

export async function analyzeImage(photoDataUri: string) {
  try {
    const result = await analyzeVisuals({ photoDataUri });
    return result.analysis;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

export async function getUseCases(objectName: string) {
  try {
    const result = await suggestUseCases({ objectName });
    return result.useCases;
  } catch (error) {
    console.error("Error suggesting use cases:", error);
    throw new Error("Failed to suggest use cases. Please try again.");
  }
}
