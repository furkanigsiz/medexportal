import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Yeni çalışanları getir
export const getNewJoiners = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newJoiners")
      .order("desc")
      .take(10);
  },
});

// Yeni çalışan ekle
export const addNewJoiner = mutation({
  args: {
    name: v.string(),
    position: v.string(),
    department: v.string(),
    location: v.string(),
    joinDate: v.string(),
    profileImage: v.optional(v.string()),
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

    return await ctx.db.insert("newJoiners", {
      ...args,
      addedBy: user._id,
      createdAt: Date.now(),
    });
  },
});
