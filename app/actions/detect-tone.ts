"use server"

import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { ToneResult } from "@/app/types"

export async function detectTone(message: string): Promise<ToneResult> {
  try {
    const prompt = `
      Analyze the emotional tone of the following message. 
      Identify the primary emotion from this list: happy, sad, angry, surprised, fearful, disgusted, neutral, excited, anxious, confused, amused, loving, proud, grateful, hopeful, insult, joking.
      
      Also provide a confidence score from 0 to 1, and a brief explanation of why you detected this emotion.
      
      Format your response as JSON with the following structure:
      {
        "emotion": "the primary emotion",
        "confidence": 0.85,
        "explanation": "brief explanation of why this emotion was detected"
      }
      
      Message to analyze: "${message}"
    `

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    })

    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse response from AI")
    }

    const result = JSON.parse(jsonMatch[0]) as ToneResult

    // Ensure we have all required fields
    if (!result.emotion || result.confidence === undefined || !result.explanation) {
      throw new Error("Incomplete response from AI")
    }

    return result
  } catch (error) {
    console.error("Error detecting tone:", error)
    throw new Error("Failed to analyze tone")
  }
}
