'use server';

// Initialize Gemini - Using direct API calls for better compatibility
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
    console.error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
}

export async function analyzeCarbonFootprint(imageBase64: string, mimeType: string, language: string = 'fr') {
    if (!apiKey) {
        throw new Error('Google Generative AI API key is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.');
    }

    if (!imageBase64 || !mimeType) {
        throw new Error('Image data and MIME type are required');
    }

    try {
        // Try different models in order of preference
        // Using direct API calls for better compatibility
        const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];


        const languageInstruction = language === 'fr'
            ? "Respond entirely in French."
            : "Respond in English.";

        const prompt = `You are an expert Carbon Footprint Analyst. 
Analyze this image. Identify the main object, food, or activity.
1. Name it clearly (Title).
2. Estimate its carbon footprint (e.g., "0.5 kg CO2e"). If exact is impossible, give a realistic range.
3. Provide a brief "Eco-Verdict": is it Good, Neutral, or High impact?
4. Suggest a greener alternative if it's high impact.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks, no explanations outside the JSON.
IMPORTANT: ${languageInstruction} The values for "title", "estimate", "explanation", and "alternative" MUST be in ${language === 'fr' ? 'French' : 'English'}. The "verdict" field must remain "Good", "Neutral", or "High" (do not translate the key values).

Format the response as JSON:
{
  "title": "string",
  "estimate": "string",
  "verdict": "Good" | "Neutral" | "High",
  "explanation": "short explanation",
  "alternative": "short suggestion or null"
}`;

        // Try each model until one works using direct API calls
        let lastError: Error | null = null;
        for (const modelName of modelNames) {
            try {
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

                const requestBody = {
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        data: imageBase64,
                                        mimeType: mimeType,
                                    },
                                },
                            ],
                        },
                    ],
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();

                // Extract text from response
                let text = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                    data.text ||
                    '';

                if (!text) {
                    throw new Error('No text response from Gemini API');
                }

                // Clean markdown code blocks and whitespace
                text = text
                    .replace(/```json/gi, '')
                    .replace(/```/g, '')
                    .trim();

                // Try to extract JSON if it's embedded in text
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    text = jsonMatch[0];
                }

                const parsed = JSON.parse(text);

                // Validate the response structure
                if (!parsed.title || !parsed.estimate || !parsed.verdict || !parsed.explanation) {
                    throw new Error('Invalid response format from Gemini');
                }

                return {
                    title: parsed.title,
                    estimate: parsed.estimate,
                    verdict: parsed.verdict,
                    explanation: parsed.explanation,
                    alternative: parsed.alternative || null,
                };
            } catch (modelError) {
                // If this model fails, try the next one
                lastError = modelError instanceof Error ? modelError : new Error(String(modelError));
                console.warn(`Model ${modelName} failed, trying next...`, lastError.message);
                continue;
            }
        }

        // If all models failed, throw the last error
        if (lastError) {
            throw lastError;
        }

        throw new Error('No available Gemini models found');

    } catch (error) {
        console.error('Gemini Analysis Error:', error);

        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse response from Gemini. Please try again.');
        }

        if (error instanceof Error) {
            // Provide more helpful error messages
            if (error.message.includes('404') || error.message.includes('not found')) {
                throw new Error('Modèle Gemini non disponible. Veuillez vérifier votre clé API et les modèles disponibles.');
            }
            throw error;
        }

        throw new Error('Failed to analyze image with Gemini. Please check your API key and try again.');
    }
}
