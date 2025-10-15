import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tüm forum konularını getir
export const getForumTopics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("forumTopics")
      .order("desc")
      .collect();
  },
});

// Kategoriye göre forum konularını getir
export const getForumTopicsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumTopics")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// Sabitlenmiş konuları getir
export const getPinnedTopics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("forumTopics")
      .withIndex("by_pinned", (q) => q.eq("isPinned", true))
      .order("desc")
      .collect();
  },
});

// Forum konusu ekle
export const addForumTopic = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
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

    return await ctx.db.insert("forumTopics", {
      ...args,
      author: user.name,
      authorId: user._id,
      replies: 0,
      views: 0,
      likes: 0,
      isPinned: false,
      isHot: false,
      lastActivity: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Forum konusunu güncelle
export const updateForumTopic = mutation({
  args: {
    topicId: v.id("forumTopics"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isPinned: v.optional(v.boolean()),
    isHot: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { topicId, ...updateData } = args;
    return await ctx.db.patch(topicId, {
      ...updateData,
      updatedAt: Date.now(),
      lastActivity: new Date().toISOString().split('T')[0],
    });
  },
});

// Forum konusunun görüntülenme sayısını artır
export const incrementTopicViews = mutation({
  args: { topicId: v.id("forumTopics") },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }

    return await ctx.db.patch(args.topicId, {
      views: topic.views + 1,
    });
  },
});

// Forum konusunu beğen
export const likeTopic = mutation({
  args: { topicId: v.id("forumTopics") },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }

    return await ctx.db.patch(args.topicId, {
      likes: topic.likes + 1,
    });
  },
});

// Forum yanıtları getir
export const getForumReplies = query({
  args: { topicId: v.id("forumTopics") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumReplies")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .order("asc")
      .collect();
  },
});

// Forum yanıtı ekle
export const addForumReply = mutation({
  args: {
    topicId: v.id("forumTopics"),
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

    if (!user) {
      throw new Error("User not found");
    }

    // Yanıt sayısını artır
    const topic = await ctx.db.get(args.topicId);
    if (topic) {
      await ctx.db.patch(args.topicId, {
        replies: topic.replies + 1,
        lastActivity: new Date().toISOString().split('T')[0],
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.insert("forumReplies", {
      ...args,
      author: user.name,
      authorId: user._id,
      likes: 0,
      createdAt: Date.now(),
    });
  },
});
