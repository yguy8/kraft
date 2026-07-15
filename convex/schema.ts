import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
//import { title } from "process";

export default defineSchema({
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
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]), 

    templates: defineTable({
        title: v.string(),        // Nombre de la plantilla (renombrable)
        userId: v.string(),       // Dueño de la plantilla (Clerk ID)
        content: v.string(),      // Bloques de BlockNote serializados
        userImage: v.string(),    // Para mostrar quién la editó (Clerk Image)
        userName: v.string(),     // Nombre del artesano (Clerk Name)
        images: v.optional(v.array(v.string())),  //imagen de portada de documento
    })
    .index("by_user", ["userId"])
});