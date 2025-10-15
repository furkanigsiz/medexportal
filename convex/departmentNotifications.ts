import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Departman bildirimlerini getir
export const getDepartmentNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("departmentNotifications")
      .order("desc")
      .take(10);
  },
});

// Departman bildirimi ekle
export const addDepartmentNotification = mutation({
  args: {
    department: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
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

    return await ctx.db.insert("departmentNotifications", {
      ...args,
      addedBy: user._id,
      createdAt: Date.now(),
    });
  },
});
