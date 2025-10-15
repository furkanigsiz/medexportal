import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTickets = query({
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

    // Geçici olarak tüm ticketları döndür
    return await ctx.db.query("tickets").collect();
    
    // Admin ve superadmin tüm ticketları görebilir
    // if (user.role === "admin" || user.role === "superadmin") {
    //   return await ctx.db.query("tickets").collect();
    // }

    // Employee sadece kendi ticketlarını görebilir
    // return await ctx.db
    //   .query("tickets")
    //   .withIndex("by_user", (q) => q.eq("userId", user._id))
    //   .collect();
  },
});

export const createTicket = mutation({
  args: {
    title: v.string(),
    description: v.string(),
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

    const ticketId = await ctx.db.insert("tickets", {
      userId: user._id,
      title: args.title,
      description: args.description,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return ticketId;
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("closed")),
    reply: v.optional(v.string()),
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

    await ctx.db.patch(args.ticketId, {
      status: args.status,
      reply: args.reply,
      updatedAt: Date.now(),
    });
  },
});

export const addTicketReply = mutation({
  args: {
    ticketId: v.id("tickets"),
    reply: v.string(),
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

    await ctx.db.patch(args.ticketId, {
      reply: args.reply,
      status: "in_progress",
      updatedAt: Date.now(),
    });
  },
});

export const getTicketById = query({
  args: {
    ticketId: v.id("tickets"),
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

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Admin ve superadmin tüm ticketları görebilir
    if (user.role === "admin" || user.role === "superadmin") {
      return ticket;
    }

    // Employee sadece kendi ticketını görebilir
    if (ticket.userId !== user._id) {
      throw new Error("Bu ticketı görme yetkiniz yok");
    }

    return ticket;
  },
});

export const deleteTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
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

    // Sadece admin ve superadmin ticket silebilir
    if (user.role !== "admin" && user.role !== "superadmin") {
      throw new Error("Bu işlem için yetkiniz yok");
    }

    // Ticket'ı sil
    await ctx.db.delete(args.ticketId);
  },
});
