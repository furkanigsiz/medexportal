import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Medex perspektifini getir
export const getMedexPerspective = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("medexPerspective")
      .order("desc")
      .take(5);
  },
});

// Medex perspektifi ekle
export const addMedexPerspective = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publishDate: v.string(),
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

    return await ctx.db.insert("medexPerspective", {
      ...args,
      addedBy: user._id,
      createdAt: Date.now(),
    });
  },
});
