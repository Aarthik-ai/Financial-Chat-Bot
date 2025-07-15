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
      return "I apologize, but I couldn't generate a proper response at this time. Please try rephrasing your question.";
    }

    return content;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Handle specific OpenAI errors with user-friendly messages
    if (error.status === 429) {
      return `Hello! I'm Arthik, your AI trading assistant. I'm currently experiencing high demand, but I can still help you with general trading advice.

Regarding your question about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}":

While I can't access real-time market data right now, here are some fundamental principles for successful trading:

📊 **Key Trading Factors:**
- **Risk Management**: Never risk more than 2-3% of your portfolio on a single trade
- **Research**: Always analyze company fundamentals and market trends
- **Diversification**: Spread investments across different sectors and assets
- **Market Timing**: Consider market conditions and economic indicators
- **Emotional Control**: Stick to your strategy and avoid impulsive decisions

💡 **Remember**: This is educational information, not financial advice. Always consult with qualified financial professionals before making investment decisions.

Please check back later when our full AI capabilities are restored, or contact support if you need immediate assistance with your OpenAI API quota.`;
    }
    
    if (error.status === 401) {
      return "I'm currently experiencing authentication issues with my AI services. Please contact support to resolve this issue with the OpenAI API configuration.";
    }
    
    // Generic fallback for other errors
    return `Hello! I'm Arthik, your financial trading assistant. I'm experiencing temporary technical difficulties, but I can still provide some general guidance.

For your question about trading, here are some essential principles:

📈 **Smart Trading Fundamentals:**
- Start with a clear strategy and stick to it
- Always use stop-loss orders to limit potential losses
- Research before you invest - understand what you're buying
- Keep emotions in check - fear and greed are a trader's worst enemies
- Stay informed about market news and economic indicators

⚠️ **Important**: This is educational content only, not financial advice. Always do your own research and consider consulting with financial professionals.

I'll be back to full functionality soon. Thank you for your patience!`;
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
