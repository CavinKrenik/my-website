import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getCounselingResponse = action({
  args: {
    userMessage: v.string(),
    color: v.string(),
    emotions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `You are a compassionate counselor specializing in color therapy and emotional wellness. 
The user is currently feeling emotions: ${args.emotions.join(", ")} 
and resonates with the color: ${args.color}.

Their message: "${args.userMessage}"

Provide a brief, caring response that:
1. Acknowledges their emotions
2. Incorporates the meaning of their chosen color
3. Suggests a simple coping strategy
Keep the response under 150 words and focus on empathy and practical support.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  },
});

export const getColorInsight = action({
  args: {
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `As a color therapy expert, provide a brief insight about the color ${args.color}. Include:
1. The emotional and psychological associations with this color
2. How this color can be used for emotional healing
3. A simple exercise or meditation focusing on this color
Keep it concise and practical, under 120 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  },
});
