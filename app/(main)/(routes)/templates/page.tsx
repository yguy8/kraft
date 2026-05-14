"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KRAFT_TEMPLATES } from "@/lib/templates-data";
import { TemplateCard } from "../../_components/template-card";
import { Plus } from "lucide-react";

export default function TemplatesPage() {
  const customTemplates = useQuery(api.templates.get);

  return (
    <div className="h-full flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Sección Sistema */}
        <section>
          <div className="flex items-center gap-x-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Plantillas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(KRAFT_TEMPLATES).map((id) => (
              <TemplateCard 
                key={id} 
                title={id} 
                isSystem 
              />
            ))}
          </div>
        </section>

        {/* Sección Usuario */}
        <section>
          <div className="flex items-center gap-x-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Mis plantillas ({customTemplates?.length || 0} / 20)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customTemplates?.map((template) => (
              <TemplateCard 
                key={template._id}
                id={template._id}
                title={template.title}
                userImage={template.userImage}
              />
            ))}
            
            {/* Slot de creación rápida */}
            {customTemplates && customTemplates.length < 20 && (
            <div className="flex items-center justify-center pt-4">
                <button className="
                group flex items-center gap-x-2 h-10 px-6  bg-zinc-900  hover:bg-zinc-800 hover:text-white  text-zinc-200 border border-zinc-800 rounded-full transition-all duration-200 text-sm font-medium dark:bg-blue-100 dark:text-zinc-900">
                Crear plantilla 
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