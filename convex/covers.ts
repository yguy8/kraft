import { mutation, query } from "./_generated/server";

const kraftCovers = [
  { title: "", imageUrl: "/covers/arcos.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/avión.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/azul.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/bosque.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/cohete.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/difuminado.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/difuminado2.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/estrellas.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/fondoazul.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/galaxia.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/galaxia2.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/hojas.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/libros.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/libros2.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/geometría.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/manchas.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/mar.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/montaña.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/nubes.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/nubes2.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/nubes3.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/pastel.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/pintura.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/plantas.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/plantas2.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/plantas3.jpg", userId: "system", userName: "Kraft" },
  { title: "", imageUrl: "/covers/ventana.jpg", userId: "system", userName: "Kraft" },
];

export const initKraftCovers = mutation(async (ctx) => {
  const existing = await ctx.db.query("covers")
    .filter((q) => q.eq(q.field("userId"), "system"))
    .collect();

  for (const cover of kraftCovers) {
    const alreadyExists = existing.some(
      (c) => c.title === cover.title || c.imageUrl === cover.imageUrl
    );
    if (!alreadyExists) {
      await ctx.db.insert("covers", cover);
    }
  }
});

export const getSystemCovers = query(async (ctx) => {
  return await ctx.db
    .query("covers")
    .filter((q) => q.eq(q.field("userId"), "system"))
    .collect();
});
