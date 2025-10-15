/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as departmentNotifications from "../departmentNotifications.js";
import type * as documents from "../documents.js";
import type * as events from "../events.js";
import type * as feedback from "../feedback.js";
import type * as forum from "../forum.js";
import type * as medexPerspective from "../medexPerspective.js";
import type * as meetings from "../meetings.js";
import type * as messages from "../messages.js";
import type * as newJoiners from "../newJoiners.js";
import type * as news from "../news.js";
import type * as sops from "../sops.js";
import type * as successStories from "../successStories.js";
import type * as tickets from "../tickets.js";
import type * as trainings from "../trainings.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  departmentNotifications: typeof departmentNotifications;
  documents: typeof documents;
  events: typeof events;
  feedback: typeof feedback;
  forum: typeof forum;
  medexPerspective: typeof medexPerspective;
  meetings: typeof meetings;
  messages: typeof messages;
  newJoiners: typeof newJoiners;
  news: typeof news;
  sops: typeof sops;
  successStories: typeof successStories;
  tickets: typeof tickets;
  trainings: typeof trainings;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
