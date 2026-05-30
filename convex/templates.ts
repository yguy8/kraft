import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Crea una nueva plantilla personalizada.
 * Toma automáticamente los datos del usuario desde la identidad de Clerk.
 */
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No autenticado");
    }

    const userId = identity.subject;

    const template = await ctx.db.insert("templates", {
      title: args.title,
      content: args.content,
      userId,
      userImage: identity.pictureUrl ?? "",
      userName: identity.name ?? "Anónimo",
    });

    return template;
  },
});

/**
 * Obtiene todas las plantillas del usuario actual.
 */
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    const templates = await ctx.db
      .query("templates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return templates;
  },
});

// Obtiene todas las plantillas del sistema (Kraft).
// export const getSystemTemplates = query({
//   handler: async (ctx) => {
//     return await ctx.db
//       .query("templates")
//       .withIndex("by_user", (q) => q.eq("userId", "system"))
//       .collect();
//   },
// });

/**
 * Actualiza el título o el contenido de una plantilla existente.
 */
export const update = mutation({
  args: {
    id: v.id("templates"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No autenticado");
    }

    const userId = identity.subject;
    const existingTemplate = await ctx.db.get(args.id);

    if (!existingTemplate) {
      throw new Error("Plantilla no encontrada");
    }

    if (existingTemplate.userId !== userId) {
      throw new Error("No autorizado");
    }

    // Actualiza los datos del usuario por si cambiaron en Clerk
    const template = await ctx.db.patch(args.id, {
      title: args.title ?? existingTemplate.title,
      content: args.content ?? existingTemplate.content,
      userImage: identity.pictureUrl ?? existingTemplate.userImage,
      userName: identity.name ?? existingTemplate.userName,
    });

    return template;
  },
});

/**
 * Elimina una plantilla del taller.
 */
export const remove = mutation({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No autenticado");
    }

    const userId = identity.subject;
    const existingTemplate = await ctx.db.get(args.id);

    if (!existingTemplate) {
      throw new Error("Plantilla no encontrada");
    }

    if (existingTemplate.userId !== userId) {
      throw new Error("No autorizado");
    }

    await ctx.db.delete(args.id);

    return existingTemplate;
  },
});
