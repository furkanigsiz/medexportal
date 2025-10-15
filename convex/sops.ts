import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tüm SOP'ları getir
export const getSOPs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sops")
      .order("desc")
      .collect();
  },
});

// Kategoriye göre SOP'ları getir
export const getSOPsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sops")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// Aktif SOP'ları getir
export const getActiveSOPs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sops")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();
  },
});

// SOP ekle
export const addSOP = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    version: v.string(),
    content: v.string(),
    author: v.string(),
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

    return await ctx.db.insert("sops", {
      ...args,
      downloads: 0,
      status: "active",
      addedBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// SOP güncelle
export const updateSOP = mutation({
  args: {
    sopId: v.id("sops"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    version: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
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

    const { sopId, ...updateData } = args;
    return await ctx.db.patch(sopId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// SOP indirme sayısını artır
export const incrementSOPDownloads = mutation({
  args: { sopId: v.id("sops") },
  handler: async (ctx, args) => {
    const sop = await ctx.db.get(args.sopId);
    if (!sop) {
      throw new Error("SOP not found");
    }

    return await ctx.db.patch(args.sopId, {
      downloads: sop.downloads + 1,
    });
  },
});
