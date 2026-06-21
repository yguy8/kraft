"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
//import { useTemplates } from "@/hooks/use-templates";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";

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

  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleBack = async () => {
    // Si ya hay timeout activo, cancélalo
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }

    if (!title.trim()) {
      toast.warning("Necesita tener título");
      return;
    }

    if (!content || content.trim() === "[]" || content.trim() === "") {
      toast.warning("Necesita tener contenido");
      // Espera 200ms antes de eliminar automáticamente
      const timeout = setTimeout(async () => {
        if (!title.trim() && (!content || content.trim() === "[]" || content.trim() === "")) {
          await removeTemplate({ id: id as any });
          setDeleted(true);
          toast.info("Sin contenido, se elimina automáticamente");
          router.push("/templates");
        }
      }, 200);
      setClickTimeout(timeout);
      return;
    }

    // Si tiene título y contenido, guarda
    await updateTemplate({
      id: id as any,
      title: title.trim(),
      content: content,
    });

    toast.success("Plantilla guardada correctamente");
    router.push("/templates");
  };

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
    if (!content || content.trim() === "" || content.trim() === "[]") {
      // No hay contenido, eliminar directamente
      await removeTemplate({ id: id as any });
      setDeleted(true);
      toast.info("Plantilla sin contenido, eliminada automáticamente");
      router.push("/templates");
    } else {
      // Sí hay contenido, pedir confirmación
      toast.warning("¿Seguro que quieres eliminarla?", {
        action: {
          label: "Eliminar",
          onClick: async () => {
            await removeTemplate({ id: id as any });
            setDeleted(true);
            toast.success("Plantilla eliminada");
            router.push("/templates");
          },
        },
      });
      // Si no hace clic en "Eliminar", se conserva y no pasa nada
    }
  };


  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Necesita tener título");
      return;
    }

    await updateTemplate({
      id: id as any,
      title: title.trim() || "Sin título",
      content: content || "[]",
    });

    toast.success("Plantilla guarda")
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
          onClick={handleBack}
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
