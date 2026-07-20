import { mutation, query } from "./_generated/server";

const kraftCovers = [
  { title: "Azul", imageUrl: "/covers/azul.jpg", userId: "system", userName: "Kraft" },
  { title: "Avión", imageUrl: "/covers/avión.jpg", userId: "system", userName: "Kraft" },
  { title: "Bosque", imageUrl: "/covers/bosque.jpg", userId: "system", userName: "Kraft" },
  { title: "Cohete", imageUrl: "/covers/cohete.jpg", userId: "system", userName: "Kraft" },
  { title: "Galaxia 1", imageUrl: "/covers/aurora.jpg", userId: "system", userName: "Kraft" },
  { title: "Galaxia 2", imageUrl: "/covers/galaxia.jpg", userId: "system", userName: "Kraft" },
  { title: "Hojas", imageUrl: "/covers/hojas.jpg", userId: "system", userName: "Kraft" },
  { title: "Montaña", imageUrl: "/covers/montaña.jpg", userId: "system", userName: "Kraft" },
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
