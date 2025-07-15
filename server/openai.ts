import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateFinancialResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Arthik.ai, an expert AI financial trading assistant. You provide intelligent, actionable insights about:
- Stock market analysis and trends
- Trading strategies and risk management
- Portfolio optimization and diversification
- Financial news interpretation
- Technical and fundamental analysis
- Investment opportunities and recommendations

Always provide professional, accurate, and helpful financial advice. Be specific with data when possible, but always include disclaimers about market risks. Keep responses conversational but authoritative.

Important: Always include a disclaimer that past performance doesn't guarantee future results and users should do their own research.`
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response generated");
    }

    return content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response: " + (error as Error).message);
  }
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a short, descriptive title (max 50 characters) for a financial trading chat based on the user's first message. Focus on the main topic or question."
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      max_tokens: 20,
      temperature: 0.5,
    });

    const title = response.choices[0].message.content?.trim();
    if (!title) {
      return "Financial Trading Chat";
    }

    return title.length > 50 ? title.substring(0, 50) + "..." : title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "Financial Trading Chat";
  }
}
