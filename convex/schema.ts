import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { updateCoverOffset } from "./documents";
//import { title } from "process";

export default defineSchema({
    //documentos
    documents: defineTable({
        title: v.string(),      // Título del documento 
        userId: v.string(),      // Dueño del documento 
        isArchived: v.boolean(),    // Si esta archivado el documento 
        parentDocument: v.optional(v.id("documents")),  //Los antecesores del documento o sea sus padres
        content: v.optional(v.string()), //Contenido del documento 
        coverImage: v.optional(v.string()), // Imagen de portada 
        icon: v.optional(v.string()), //icono del documento 
        isPublished: v.boolean(),    //Si esta publicado el documento
        images: v.optional(v.array(v.string())),  //imagen de portada de documento
        isPinned: v.optional(v.boolean()), //los documentos fijados
        coverOffsetY: v.optional(v.number()),
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .index("by_user_pinned", ["userId", "isPinned"]),

    //plantillas 
    templates: defineTable({
        title: v.string(),        // Nombre de la plantilla (renombrable)
        userId: v.string(),       // Dueño de la plantilla (Clerk ID)
        content: v.string(),      // Bloques de BlockNote serializados
        userImage: v.string(),    // Para mostrar quién la editó (Clerk Image)
        userName: v.string(),     // Nombre del artesano (Clerk Name)
        images: v.optional(v.array(v.string())),  //imagen de portada de documento
    })
    .index("by_user", ["userId"]),

    //papalera
    userSettings: defineTable({
    userId: v.string(),
    trashPolicy: v.string(), // "manual" | "auto" | "30" | "60" | "90"
    }).index("by_user", ["userId"]),

    //portadas (covers)
    covers: defineTable({
        title: v.string(),
        imageUrl: v.string(),
        userId: v.string(),
        userName: v.string(),
    }).index("by_user", ["userId"]),
});