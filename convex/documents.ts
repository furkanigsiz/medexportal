import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocuments = query({
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

    // Geçici olarak tüm dökümanları döndür
    return await ctx.db.query("documents").collect();
  },
});

export const addDocument = mutation({
  args: {
    title: v.string(),
    driveFileId: v.string(),
    accessLevel: v.union(v.literal("employee"), v.literal("admin"), v.literal("superadmin")),
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

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      driveFileId: args.driveFileId,
      addedBy: user._id,
      accessLevel: args.accessLevel,
      createdAt: Date.now(),
    });

    return documentId;
  },
});

export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    driveFileId: v.string(),
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

    await ctx.db.patch(args.documentId, {
      title: args.title,
      driveFileId: args.driveFileId,
    });
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
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

    await ctx.db.delete(args.documentId);
  },
});
