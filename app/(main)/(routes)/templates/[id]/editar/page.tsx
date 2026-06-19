"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTemplates } from "@/hooks/use-templates";
import { Spinner } from "@/components/spinner";
import { toast, Toaster } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();

  const [deleted, setDeleted] = useState(false);   
  const [creating, setCreating] = useState(false); 

  const template = useQuery(
    api.templates.getById,
    deleted ? "skip" : { id: id as any } 
  );

  const updateTemplate = useMutation(api.templates.update);
  const removeTemplate = useMutation(api.templates.remove);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("[]");

  useEffect(() => {
    if (template?.title) setTitle(template.title);
    if (template?.content) setContent(template.content);
  }, [template]);

  if (template === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (template === null) {
    router.push("/templates");
    return null;
  }

  const handleCancel = async () => {
    router.push("/templates"); 
    await removeTemplate({ id: id as any }); 
    setDeleted(true); 
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Necesita tener título");
      return;
    }

    await updateTemplate({
      id: id as any,
      title: title.trim() || "Sin título",
      content: content || "[]",
    });
    router.push("/templates");
  };

  const onChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="pb-40 max-w-4xl mx-auto p-8">
      {/* Botón volver */}
      <div className="flex gap-4 justify-start">
        <button
          onClick={() => router.push("/templates")}
          className="dark:text-zinc-300 text-shadow-blue-950"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Botones Guardar / Cancelar */}
      <div className="flex gap-4 justify-end mb-4">
        <button
          onClick={handleSave}
          disabled={creating}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-zinc-600 dark:bg-blue-950 dark:hover:bg-blue-900"
        >
          Guardar
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-zinc-200"
        >
          Cancelar
        </button>
      </div>

      {/* Título editable */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva plantilla"
        className="text-2xl font-bold mb-4 w-full border-b focus:outline-none"
      />

      {/* Editor */}
      <Editor
        initialContent={template?.content || "[]"}
        onChange={onChange}
        editable={true}
      />
    </div>
  );
}
