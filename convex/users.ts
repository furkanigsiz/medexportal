import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Geçici olarak authentication devre dışı - mock user döndür
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   return null;
    // }

    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_email", (q) => q.eq("email", identity.email!))
    //   .first();

    // return user;
    
    // Geçici olarak mock admin user döndür
    return {
      _id: "mock-user-id",
      name: "Demo Admin",
      email: "admin@medex.com",
      role: "admin",
      createdAt: Date.now()
    };
  },
});

export const createUserIfNotExists = mutation({
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

    // Eğer kullanıcı yoksa otomatik oluştur
    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: identity.name || identity.email!.split('@')[0],
        email: identity.email!,
        role: "employee",
        createdAt: Date.now(),
      });
      
      return await ctx.db.get(userId);
    }

    return user;
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: "employee", // Varsayılan rol
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("employee"), v.literal("admin"), v.literal("superadmin")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Sadece admin ve superadmin rol değiştirebilir
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Geçici olarak authentication devre dışı
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const currentUser = await ctx.db
    //   .query("users")
    //   .withIndex("by_email", (q) => q.eq("email", identity.email!))
    //   .first();

    // if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    //   throw new Error("Bu işlem için yetkiniz yok");
    // }

    // Geçici olarak tüm kullanıcıları döndür
    return await ctx.db.query("users").collect();
  },
});
