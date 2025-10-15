import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Başarı hikayelerini getir
export const getSuccessStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("successStories")
      .order("desc")
      .take(10);
  },
});

// Öne çıkan başarı hikayelerini getir
export const getFeaturedSuccessStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("successStories")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .take(5);
  },
});

// Başarı hikayesi ekle
export const addSuccessStory = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    author: v.string(),
    publishDate: v.string(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("successStories", {
      ...args,
      addedBy: user._id,
      createdAt: Date.now(),
    });
  },
});
