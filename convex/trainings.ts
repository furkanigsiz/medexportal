import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tüm eğitimleri getir
export const getTrainings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("trainings")
      .order("desc")
      .collect();
  },
});

// Kategoriye göre eğitimleri getir
export const getTrainingsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trainings")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// Eğitim ekle
export const addTraining = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    duration: v.string(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    instructor: v.string(),
    videoUrl: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
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

    // Sadece admin ve superadmin eğitim ekleyebilir
    if (user.role !== "admin" && user.role !== "superadmin") {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    return await ctx.db.insert("trainings", {
      ...args,
      createdBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Eğitimi güncelle
export const updateTraining = mutation({
  args: {
    id: v.optional(v.id("trainings")),
    trainingId: v.optional(v.id("trainings")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    duration: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))),
    instructor: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
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

    // Sadece admin ve superadmin eğitim güncelleyebilir
    if (user.role !== "admin" && user.role !== "superadmin") {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    const trainingId = args.trainingId || args.id;
    if (!trainingId) {
      throw new Error("trainingId or id is required");
    }

    const { id, trainingId: _, ...updateData } = args;
    return await ctx.db.patch(trainingId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eğitimi sil
export const deleteTraining = mutation({
  args: { trainingId: v.id("trainings") },
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

    // Sadece admin ve superadmin eğitim silebilir
    if (user.role !== "admin" && user.role !== "superadmin") {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    return await ctx.db.delete(args.trainingId);
  },
});
