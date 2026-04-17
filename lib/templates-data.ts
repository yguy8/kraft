import { PartialBlock } from "@blocknote/core";

export const KRAFT_TEMPLATES: Record<string, PartialBlock[]> = {
  diario: [
    { 
      type: "heading", 
      props: { level: 2 }, 
      content: "📔 Reflexión del Día" 
    },
    { 
      type: "paragraph", 
      content: "Enfoque principal de hoy: " 
    },
    { 
      type: "checkListItem", 
      content: "Tarea crítica de Kraft" 
    },
    { 
      type: "paragraph" 
    },
  ],
  proyecto: [
    { 
      type: "heading", 
      props: { level: 2 }, 
      content: "🏗️ Nuevo Proyecto" 
    },
    { 
      type: "paragraph", 
      content: "Estado: 🟡 En proceso de diseño" 
    },
    { 
        type: "bulletListItem", content: "Requerimientos" 
    },
    { 
      type: "paragraph" 
    },
  ],
  // aquí van las demás platillas y modicar las otras, peor bueno para demo esta bien así aunque no estaría mal una mejor estructura
};