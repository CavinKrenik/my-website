import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const PROMPTS = [
  { text: "What color represents your strongest emotion right now?", type: "reflection" },
  { text: "Describe a moment today that brought out your brightest colors.", type: "positive" },
  { text: "If your current mood was a painting, what would it look like?", type: "creative" },
  { text: "What shade of your personality surprised you today?", type: "discovery" },
  { text: "Draw or describe a color that calms your chaos.", type: "soothing" },
];

export const getRandomPrompt = query({
  args: {
    currentPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let availablePrompts = PROMPTS;
    if (args.currentPrompt) {
      availablePrompts = PROMPTS.filter(p => p.text !== args.currentPrompt);
    }
    return availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
  },
});

export const getEmotionStats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const stats = new Map<string, { count: number; colors: Set<string> }>();
    
    entries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        if (!stats.has(emotion)) {
          stats.set(emotion, { count: 0, colors: new Set() });
        }
        const stat = stats.get(emotion)!;
        stat.count++;
        stat.colors.add(entry.color);
      });
    });
    
    return Array.from(stats.entries()).map(([emotion, data]) => ({
      emotion,
      count: data.count,
      colors: Array.from(data.colors),
    }));
  },
});
