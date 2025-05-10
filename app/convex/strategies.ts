import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("copingStrategies")
      .order("desc")
      .collect();
  },
});

export const listByColor = query({
  args: {
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("copingStrategies")
      .withIndex("by_color", (q) => q.eq("color", args.color))
      .collect();
  },
});

export const markAsUsed = mutation({
  args: {
    strategyId: v.id("copingStrategies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const strategy = await ctx.db.get(args.strategyId);
    if (!strategy) throw new Error("Strategy not found");

    await ctx.db.patch(args.strategyId, {
      usageCount: (strategy.usageCount || 0) + 1,
    });

    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (userProgress) {
      await ctx.db.patch(userProgress._id, {
        strategiesUsed: [...new Set([...userProgress.strategiesUsed, args.strategyId])],
        lastActivity: Date.now(),
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId,
        strategiesUsed: [args.strategyId],
        lastActivity: Date.now(),
        streakDays: 1,
      });
    }
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const strategies = [
      {
        title: "Mindful Breathing with Blue",
        description: "Focus on deep breaths while visualizing calm blue waves or a clear sky.",
        color: "blue",
        emotions: ["Anxiety", "Stress", "Overwhelm"],
        usageCount: 0,
      },
      {
        title: "Green Growth Visualization",
        description: "Imagine yourself as a tree, growing stronger with each breath.",
        color: "green",
        emotions: ["Stagnation", "Depression", "Uncertainty"],
        usageCount: 0,
      },
      {
        title: "Yellow Energy Boost",
        description: "Engage in quick, energizing movements while focusing on bright, sunny thoughts.",
        color: "yellow",
        emotions: ["Lethargy", "Sadness", "Low Energy"],
        usageCount: 0,
      },
      {
        title: "Red Release Exercise",
        description: "Safely express and release intense emotions through movement or art.",
        color: "red",
        emotions: ["Anger", "Frustration", "Intensity"],
        usageCount: 0,
      },
    ];

    for (const strategy of strategies) {
      await ctx.db.insert("copingStrategies", strategy);
    }
  },
});
