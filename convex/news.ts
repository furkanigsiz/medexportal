import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("news")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const createNews = mutation({
  args: {
    title: v.string(),
    content: v.string(),
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

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    const newsId = await ctx.db.insert("news", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      createdAt: Date.now(),
    });

    return newsId;
  },
});

export const updateNews = mutation({
  args: {
    newsId: v.id("news"),
    title: v.string(),
    content: v.string(),
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

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    await ctx.db.patch(args.newsId, {
      title: args.title,
      content: args.content,
    });
  },
});

export const deleteNews = mutation({
  args: {
    newsId: v.id("news"),
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

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    await ctx.db.delete(args.newsId);
  },
});
