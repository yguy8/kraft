import { PartialBlock } from "@blocknote/core";

export const KRAFT_TEMPLATES: Record<string, PartialBlock[]> = {
  diario: [
    { type: "paragraph", content: "📅 Fecha: " + new Date().toISOString().split('T')[0]},
    { type: "heading", props: { level: 3 }, content: "🌱 Reflexión" },
    { type: "bulletListItem", content: "¿Cómo me sentí hoy?" },
    { type: "paragraph", content: " " },
    { type: "bulletListItem", content: "¿Qué me emocionó hoy?" },
    { type: "paragraph", content: " " },
    { type: "bulletListItem", content: "¿Qué aprendí hoy?" },
    { type: "paragraph", content: " " },
    { type: "divider" },
    { type: "heading", props: { level: 3 }, content: "🙏 Gratitud" },
    { type: "bulletListItem", content: "¿Qué agradezco hoy?" },
    { type: "paragraph", content: " " },
    { type: "divider" },
    { type: "heading", props: { level: 3 }, content: "🏆 Logros" },
    { type: "paragraph", content: "Un pequeño logro del día:" },
    { type: "paragraph", content: " " },
    { type: "divider" },
    { type: "heading", props: { level: 3 }, content: "🔮 Mañana" },
    { type: "paragraph", content: "¿Qué quiero mejorar mañana?" },
    { type: "paragraph", content: " " },
    { type: "quote", content: "Palabra o frase que resume mi día:" },
    { type: "paragraph", content: " " },
    { type: "divider" },
  ],
  Seguimiento: [
  { type: "heading", props: { level: 1 }, content: "📈 MATRIZ DE RENDIMIENTO" },
  { type: "paragraph", content: "Ciclo semanal de control de hábitos y sistemas." },
  { type: "divider" },

  {
    type: "table",
    content: {
      type: "tableContent",
      rows: [
        { cells: [["DÍA"], ["L"], ["M"], ["X"], ["J"], ["V"], ["S"], ["D"]] },
        { cells: [["Tarea"], [""], [""], [""], [""], [""], [""], [""]] },
        { cells: [["Tarea"], [""], [""], [""], [""], [""], [""], [""]] },
        { cells: [["Tarea"], [""], [""], [""], [""], [""], [""], [""]] },
        { cells: [["Tarea"], [""], [""], [""], [""], [""], [""], [""]] },
      ]
    }
  },

  { type: "divider" },

  { type: "heading", props: { level: 2 }, content: "📊 Análisis de Consistencia" },
  { type: "paragraph", content: "Registra el porcentaje de éxito semanal abajo." },
  { type: "paragraph", content: "✅ Total de hábitos cumplidos: ",  },
  { type: "paragraph", content: "📉 Porcentaje de consistencia: " },
  { type: "paragraph", content: "📝 Notas de la semana: " },
  { type: "divider" },
],

  proyecto: [
    { type: "paragraph", content: "PROYECTO: [Nombre] | VERSIÓN: v0.x | PRIORIDAD: [Alta/Media]" },
    { type: "heading", props: { level: 2 }, content: "🌧Lluvia de ideas" },
    { type: "paragraph", content: " " },
    { type: "divider" },
    { type: "heading", props: { level: 2 }, content: "Notas 📝" },
    { type: "paragraph", content: "Color de ..." },
    { type: "heading", props: { level: 2 }, content: "A revisar 📋" },
    { type: "checkListItem", content: "Funcionamiento ..." },
    { type: "checkListItem", content: "Revisar ..." },
    { type: "heading", props: { level: 2 }, content: "Mejoras 📈" },
    { type: "bulletListItem", content: "Implementar ..." },
    { type: "bulletListItem", content: "Quitar ..." },
  ],

  metas: [
    { type: "heading", props: { level: 1 }, content: "¿Qué quiero lograr?" },
    { type: "paragraph", content: "ESPECÍFICO, MEDIBLE, ALCANZABLE, RELEVANTE, TIEMPO" },
    { type: "checkListItem", content: "Hacer deporte todos los días 2 horas" },
    { type: "checkListItem", content: " " },
    { type: "checkListItem", content: " " },
    { type: "checkListItem", content: " " },
    { type: "checkListItem", content: " " },
    { type: "checkListItem", content: " " },
    
  ],

  bitacora: [
    { type: "heading", props: { level: 1 }, content: "¿Qué descubrí, viví u aprendí?" },
    { type: "paragraph", content: "" },
    { type: "paragraph", content: "---" },
    { type: "heading", props: { level: 2 }, content: "" },
  ],
};