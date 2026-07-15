import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setTrashPolicy = mutation({
  args: { policy: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { trashPolicy: args.policy });
    } else {
      await ctx.db.insert("userSettings", { userId, trashPolicy: args.policy });
    }
  },
});

export const clearTrash = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");
    const userId = identity.subject;

    const trashedDocs = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    for (const doc of trashedDocs) {
      await ctx.db.delete(doc._id);
    }

    return { success: true, count: trashedDocs.length };
  },
});
