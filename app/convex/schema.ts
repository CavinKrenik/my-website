import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  journalEntries: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    color: v.string(),
    emotions: v.array(v.string()),
    createdAt: v.number(),
    intensity: v.optional(v.number()),
  }).index("by_user", ["userId"]),
  
  copingStrategies: defineTable({
    title: v.string(),
    description: v.string(),
    color: v.string(),
    emotions: v.array(v.string()),
    usageCount: v.optional(v.number()),
  }).index("by_color", ["color"]),
  
  guidedExplorations: defineTable({
    title: v.string(),
    prompt: v.string(),
    category: v.string(),
    color: v.string(),
  }).index("by_category", ["category"]),

  userProgress: defineTable({
    userId: v.id("users"),
    strategiesUsed: v.array(v.id("copingStrategies")),
    lastActivity: v.number(),
    streakDays: v.number(),
  }).index("by_user", ["userId"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
