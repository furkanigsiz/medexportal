import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tüm geri bildirimleri getir (sadece admin için)
export const getFeedback = query({
  args: {},
  handler: async (ctx) => {
    // Geçici olarak authentication devre dışı
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_email", (q) => q.eq("email", identity.email!))
    //   .first();

    // if (!user) {
    //   throw new Error("User not found");
    // }

    // Geçici olarak tüm geri bildirimleri döndür
    return await ctx.db
      .query("feedback")
      .order("desc")
      .collect();
  },
});

// Kullanıcının geri bildirimlerini getir
export const getUserFeedback = query({
  args: {},
  handler: async (ctx) => {
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

    return await ctx.db
      .query("feedback")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect();
  },
});

// Kategoriye göre geri bildirimleri getir
export const getFeedbackByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// Duruma göre geri bildirimleri getir
export const getFeedbackByStatus = query({
  args: { status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Geri bildirim ekle
export const addFeedback = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
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

    return await ctx.db.insert("feedback", {
      ...args,
      status: "open",
      author: user.name,
      authorId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Geri bildirimi güncelle
export const updateFeedback = mutation({
  args: {
    id: v.optional(v.id("feedback")),
    feedbackId: v.optional(v.id("feedback")),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed"))),
    response: v.optional(v.string()),
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

    const feedbackId = args.feedbackId || args.id;
    if (!feedbackId) {
      throw new Error("feedbackId or id is required");
    }

    const { id, feedbackId: _, ...updateData } = args;
    return await ctx.db.patch(feedbackId, {
      ...updateData,
      respondedBy: user._id,
      updatedAt: Date.now(),
    });
  },
});

// Geri bildirimi sil
export const deleteFeedback = mutation({
  args: { feedbackId: v.id("feedback") },
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

    const feedback = await ctx.db.get(args.feedbackId);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    // Sadece kendi geri bildirimini silebilir veya admin olabilir
    if (feedback.authorId !== user._id && user.role !== 'admin' && user.role !== 'superadmin') {
      throw new Error("Bu geri bildirimi silme yetkiniz yok");
    }

    return await ctx.db.delete(args.feedbackId);
  },
});
