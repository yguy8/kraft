"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TemplateCard } from "../../_components/template-card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TemplatesPage() {
  const customTemplates = useQuery(api.templates.get);
  const removeTemplate = useMutation(api.templates.remove);
  const updateTemplate = useMutation(api.templates.update);
  const createTemplate = useMutation(api.templates.create);
  const router = useRouter();
  const [creating, setCreating] = useState(false);

const handleCreate = async () => {
  if (creating) return; 
  setCreating(true);

  try {
    const newId = await createTemplate({
      title: "",
      content: JSON.stringify([]),
    });

    toast.success("Plantilla creada")
    await router.push(`/templates/${newId}/editar`);
  } catch (err) {
    toast.error("Error al crear plantilla")
  }finally {
    setCreating(false);
  }
};


  return (
    <div className="h-full flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wider mb-4">
            Mis plantillas ({customTemplates?.length || 0} / 20)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates?.map((t) => (
              <TemplateCard 
                key={t._id}
                id={t._id}
                title={t.title}
                userImage={t.userImage}
                userName={t.userName}
                onRename={() => updateTemplate({ id: t._id, title: "Nuevo título", content: t.content })}
                onDelete={() => removeTemplate({ id: t._id })}
              />
            ))}

            {customTemplates && customTemplates.length < 20 && (
              <div className="flex items-center justify-center pt-4">
                  <button 
                  onClick={handleCreate}
                  disabled={creating}
                  className="group flex items-center gap-x-2 h-10 px-6 mt-6 justify-center bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-200 border border-zinc-800 rounded-full transition-all duration-200 text-sm font-medium dark:bg-blue-100 dark:text-zinc-900">
                    {creating ? "Creando..." : "Crear plantilla"} 
                    <Plus className="h-4 w-4 text-zinc-200 hover:text-zinc-100 transition-colors dark:text-zinc-600 dark:hover:text-zinc-700"/>
                  </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
