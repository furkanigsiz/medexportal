import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_date")
      .order("asc")
      .collect();
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    location: v.string(),
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

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      date: args.date,
      location: args.location,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    return eventId;
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    title: v.string(),
    date: v.string(),
    location: v.string(),
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

    await ctx.db.patch(args.eventId, {
      title: args.title,
      date: args.date,
      location: args.location,
    });
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id("events"),
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

    await ctx.db.delete(args.eventId);
  },
});
