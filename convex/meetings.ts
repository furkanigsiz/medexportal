import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Toplantı oluşturma
export const createMeeting = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    participants: v.array(v.id("users")),
    invitedEmails: v.optional(v.array(v.string())),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Demo için mock user kullan
    let organizerId;
    
    // Demo user'ı bul veya oluştur
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "demo@medex.com"))
      .first();
    
    if (existingUser) {
      organizerId = existingUser._id;
    } else {
      organizerId = await ctx.db.insert("users", {
        name: "Demo User",
        email: "demo@medex.com",
        role: "employee",
        createdAt: Date.now(),
      });
    }
    
    const meetingId = `medex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingUrl = `https://meet.jit.si/${meetingId}`;
    
    const meeting = await ctx.db.insert("meetings", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      organizerId,
      participants: args.participants,
      invitedEmails: args.invitedEmails,
      status: "scheduled",
      meetingId,
      meetingUrl,
      isRecurring: args.isRecurring || false,
      recurrencePattern: args.recurrencePattern,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return meeting;
  },
});

// Toplantıları getirme
export const getMeetings = query({
  args: {},
  handler: async (ctx) => {
    // Tüm toplantıları döndür
    return await ctx.db.query("meetings").collect();
  },
});

// Belirli bir toplantıyı getirme
export const getMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.meetingId);
  },
});

// Toplantıya katılma
export const joinMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Toplantı bulunamadı");
    }
    
    // Toplantı durumunu ongoing olarak güncelle
    await ctx.db.patch(args.meetingId, {
      status: "ongoing",
      updatedAt: Date.now(),
    });
    
    return meeting;
  },
});

// Toplantı durumunu güncelleme
export const updateMeetingStatus = mutation({
  args: {
    meetingId: v.id("meetings"),
    status: v.union(
      v.literal("scheduled"), 
      v.literal("ongoing"), 
      v.literal("completed"), 
      v.literal("cancelled")
    ),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetingId, {
      status: args.status,
      recordingUrl: args.recordingUrl,
      updatedAt: Date.now(),
    });
  },
});

// Toplantı silme
export const deleteMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.meetingId);
  },
});

// Toplantı güncelleme
export const updateMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    participants: v.optional(v.array(v.id("users"))),
    invitedEmails: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { meetingId, ...updateData } = args;
    await ctx.db.patch(meetingId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});
