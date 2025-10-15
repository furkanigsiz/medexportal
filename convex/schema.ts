import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("employee"), v.literal("admin"), v.literal("superadmin")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  news: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    location: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  tickets: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
    reply: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_status", ["status"]),

  documents: defineTable({
    title: v.string(),
    driveFileId: v.string(),
    addedBy: v.id("users"),
    accessLevel: v.union(v.literal("employee"), v.literal("admin"), v.literal("superadmin")),
    createdAt: v.number(),
  }).index("by_added_by", ["addedBy"]).index("by_access_level", ["accessLevel"]),

  // Yeni çalışanlar için
  newJoiners: defineTable({
    name: v.string(),
    position: v.string(),
    department: v.string(),
    location: v.string(),
    joinDate: v.string(),
    profileImage: v.optional(v.string()),
    addedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_join_date", ["joinDate"]),

  // Başarı hikayeleri için
  successStories: defineTable({
    title: v.string(),
    content: v.string(),
    author: v.string(),
    publishDate: v.string(),
    featured: v.boolean(),
    addedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_publish_date", ["publishDate"]).index("by_featured", ["featured"]),

  // Departman bildirimleri için
  departmentNotifications: defineTable({
    department: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    addedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_department", ["department"]),

  // Medex perspektifi için
  medexPerspective: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publishDate: v.string(),
    addedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_publish_date", ["publishDate"]),

  // SOP (Standart Operasyon Prosedürleri) için
  sops: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    version: v.string(),
    content: v.string(),
    author: v.string(),
    downloads: v.number(),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
    addedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]).index("by_status", ["status"]),

  // Forum konuları için
  forumTopics: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    author: v.string(),
    authorId: v.id("users"),
    replies: v.number(),
    views: v.number(),
    likes: v.number(),
    isPinned: v.boolean(),
    isHot: v.boolean(),
    tags: v.array(v.string()),
    lastActivity: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]).index("by_author", ["authorId"]).index("by_pinned", ["isPinned"]),

  // Forum yanıtları için
  forumReplies: defineTable({
    topicId: v.id("forumTopics"),
    content: v.string(),
    author: v.string(),
    authorId: v.id("users"),
    likes: v.number(),
    createdAt: v.number(),
  }).index("by_topic", ["topicId"]).index("by_author", ["authorId"]),

  // Geri bildirim için
  feedback: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed")),
    author: v.string(),
    authorId: v.id("users"),
    response: v.optional(v.string()),
    respondedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_author", ["authorId"]).index("by_status", ["status"]).index("by_category", ["category"]),

  // Eğitimler için
  trainings: defineTable({
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    duration: v.string(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    instructor: v.string(),
    videoUrl: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]).index("by_difficulty", ["difficulty"]).index("by_created_by", ["createdBy"]),

  // Toplantılar için
  meetings: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    organizerId: v.id("users"),
    participants: v.array(v.id("users")),
    invitedEmails: v.optional(v.array(v.string())), // Email davetleri
    status: v.union(
      v.literal("scheduled"), 
      v.literal("ongoing"), 
      v.literal("completed"), 
      v.literal("cancelled")
    ),
    meetingId: v.string(), // Jitsi room ID (unique)
    meetingUrl: v.string(),
    recordingUrl: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.string()), // daily, weekly, monthly
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_organizer", ["organizerId"])
  .index("by_status", ["status"])
  .index("by_start_time", ["startTime"]),
});
