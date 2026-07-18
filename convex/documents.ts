import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";


export const archive = mutation({
    args: {id: v.id("documents") },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return { ok: false, message: "No autenticado" };
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument){
            return{ ok: false, message :"No encontrado"} ;
        }

        if (existingDocument.userId !== userId){
            return { ok: false, message: "Sin autorización" };
        }
        
        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

                for (const child of children){
                    await ctx.db.patch(child._id, {
                        isArchived: true,
                        isPinned: false,
                    });
                    await recursiveArchive(child._id);
                }
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
            isPinned: false,
        });

        recursiveArchive(args.id);

        return { ok: true, message: "Nota enviada a papelera", document};
    }
})

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
        pinned: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("No autenticado");
        }
        const userId = identity.subject;

        let q = ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument)
            )
            .filter((q) => 
                q.eq(q.field("isArchived"), false));
            
            if (args.pinned){
                q = q.filter((q) => q.eq(q.field("isPinned"), true));
            }else {
                q = q.filter((q) => q.or(q.eq(q.field("isPinned"), false), q.eq(q.field("isPinned"), undefined)));
            }

        return await q.order("desc").collect();
    }
})

export const create = mutation({
    args:{
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async(ctx, args ) =>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false
        });
        return document;
    }
});

export const getTrash = query({
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;


        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => 
            q.eq(q.field("isArchived"), true)
        )
        .order("desc")
        .collect();

        return documents;
    }
});

export const restore = mutation({
    args:{ id: v.id("documents") },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            return { ok: false, message: "No autenticado"};
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            return { ok: false, message: "No encontrado"};
        }

        if(existingDocument.userId !== userId){
            return { ok: false, message: "Sin autorización"};
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) => (
                q
                .eq("userId", userId)
                .eq("parentDocument", documentId)
            ))
            .collect();

            for(const child of children){
                await ctx.db.patch(child._id,{
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        }
        
        const options: Partial<Doc<"documents">> ={
            isArchived: false,
        };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);
            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    }
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity){ 
        throw new Error("No autenticado");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument){
        throw new Error("No encontrado");
    }
    if (existingDocument.userId !== userId){ 
        throw new Error("Sin autorizado");
    }

    await ctx.db.delete(args.id);
    return existingDocument;
  },
});


export const getSearch = query({
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;

        const documents = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) =>
            q.eq(q.field("isArchived"), false),
        )
        .order("desc")
        .collect()

        return documents;
    }
});

export const getById = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) =>{
        const identity = await ctx.auth.getUserIdentity();

        const document = await ctx.db.get(args.documentId);

        if(!document){
            throw new Error("No encontrado");
        }

        if(document.isPublished && !document.isArchived){
            return document;
        }

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;

        if(document.userId !== userId){
            throw new Error("Sin autorización");
        }

        return document;
    }
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Sin autorización");
        }

        const userId = identity.subject;

        const { id, ...rest} = args;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("No encontrado");
        }

        if(existingDocument.userId !== userId){
            throw new Error("Sin autorización");
        }

        const document = await ctx.db.patch(args.id, {
            ...rest
        });

        return document;
    }
});

export const removeIcon = mutation({
    args: {id: v.id("documents")},
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("No encontrado");
        }

        if(existingDocument.userId !== userId){
            throw new Error("Sin autorización");
        }

        const document = await ctx.db.patch(args.id, {
            icon: undefined
        });

        return document;
    }
});

export const removeCoverImage = mutation({
    args: { id: v.id("documents") },
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("No autenticado");
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument){
            throw new Error("No encontrado");
        }

        if(existingDocument.userId !== userId){
            throw new Error("Sin autorización");
        }

        const document = await ctx.db.patch(args.id, {
            coverImage: undefined
        });

        return document;
    }
});

// borrar toda la papelera 

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

//función para fijar notas 

export const pinDocument = mutation({
    args: { id: v.id("documents"), pinned: v.boolean() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("No autenticado");
        const userId = identity.subject;

        // Contar cuántas notas ya están fijadas
        const pinnedCount = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isPinned"), true))
            .collect();

        if (args.pinned && pinnedCount.length >= 5) {
            return { ok: false, message: "Solo puedes fijar hasta 5 notas" };
        }

        await ctx.db.patch(args.id, { isPinned: args.pinned });
        return { ok: true, message: args.pinned ? "Nota anclada" : "Nota desanclada"}
    },
});
