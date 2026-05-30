"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TemplateCard } from "../../_components/template-card";
import { Plus } from "lucide-react";
import { TemplateModal } from "@/components/modals/templateModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes"; 

export default function TemplatesPage() {
  const customTemplates = useQuery(api.templates.get);
  const createTemplate = useMutation(api.templates.create);
  const updateTemplate = useMutation(api.templates.update);
  const removeTemplate = useMutation(api.templates.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const handleSave = async (title: string, content: string) => {
    if (editingTemplate) {
      await updateTemplate({ id: editingTemplate._id, title, content });
    } else {
      await createTemplate({ title, content });
    }
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
  };

  const { resolvedTheme } = useTheme();
  
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
                onPreview={() => handlePreview(t)} 
                onRename={() => updateTemplate({ id: t._id, title: "Nuevo título" })}
                onDelete={() => removeTemplate({ id: t._id })}
                onEdit={() => { setEditingTemplate(t); setIsModalOpen(true); }}
              />
            ))}

            {customTemplates && customTemplates.length < 20 && (
              <div className="flex items-center justify-center pt-4">
                <button
                  onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}
                  className="group flex items-center gap-x-2 h-10 px-6 mt-6 justify-center bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-200 border border-zinc-800 rounded-full transition-all duration-200 text-sm font-medium dark:bg-blue-100 dark:text-zinc-900"
                >
                  Crear plantilla 
                  <Plus className="h-4 w-4 text-zinc-200 hover:text-zinc-100 transition-colors dark:text-zinc-600 dark:hover:text-zinc-700"/>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal de creación/edición */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialTitle={editingTemplate?.title}
        initialContent={editingTemplate?.content}
      />

      {/* Modal de preview */}
      {previewTemplate && (
        <Dialog open={true} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{previewTemplate.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <BlockNoteView
                editor={BlockNoteEditor.create({
                  initialContent: JSON.parse(previewTemplate.content),
                })}
                editable={false}
                theme={resolvedTheme === "dark"
            ? {
                colors: {
                  editor: {
                    background: "#0f172a", // azul marino oscuro
                    text: "#f8fafc",
                  },
                },
              }
            : "light"}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
