"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes"; 
import Link from "next/link";
import { Spinner } from "@/components/spinner";

export default function TemplatePage() {
  const { id } = useParams();
  const template = useQuery(api.templates.getById, { id: id as any });
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  

  if (template === undefined) return <div className="h-full flex items-center justify-center">
                                      <Spinner size="lg"/>
                                    </div>;
  if (template === null) return <p>No encontrada</p>;

  // Si no hay contenido o está vacío, mostrar mensaje en vez de BlockNote
  if (!template.content || template.content === "[]") {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Esta plantilla aún no tiene contenido.
        </p>
        <Link href={`/templates/${String(id)}/editar`}>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Añadir contenido
          </button>
        </Link>
      </div>
    );
  }

  let initialContent: any = [];
  try {
    const parsed = JSON.parse(template.content);
    initialContent = Array.isArray(parsed) ? parsed : [];
  } catch {
    initialContent = [];
  }

  const dashboardTemplate = () =>{
    router.push("/templates");
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
       <div className="flex gap-4 justify-start mb-4">
              <button
                onClick={dashboardTemplate}
                className="dark:text-zinc-300 text-shadow-blue-950"
              >
                <ArrowLeft className="h-6 w-6"/>
              </button>
        </div>
      <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
      <BlockNoteView
        editor={BlockNoteEditor.create({ initialContent })}
        editable={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
