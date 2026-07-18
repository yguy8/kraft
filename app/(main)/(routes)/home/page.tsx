"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { FileIcon, Clock, Calendar, Pin, Trash, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react"; 
import { TrashBox } from "../../_components/trash-box";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FRASES = [
  "¿Qué ideas nuevas vas a desarrollar hoy?",
  "¿Qué te inspira ahora mismo?",
  "¿Qué ideas para proyectos tienes en mente?",
  "Es un buen momento para una nueva idea.",
  "La creatividad es inteligencia divirtiéndose.",
  "Construye algo de lo que te sientas orgulloso.",
  "¿En qué dirección se mueve tu curiosidad hoy?"
];

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [frase, setFrase] = useState("");

  const documents = useQuery(api.documents.getSearch);
  const pinDocument = useMutation(api.documents.pinDocument);
  const archive = useMutation(api.documents.archive);
  const create = useMutation(api.documents.create);
  
  
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  
  useEffect(() => {
    const randomFrase = FRASES[Math.floor(Math.random() * FRASES.length)];
    setFrase(randomFrase);
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const onCreate = () => {
      const promise = create({title: "Sin título"})
      .then((documentId) => router.push(`/documents/${documentId}`))

      toast.promise(promise, {
          loading: "Creando nueva nota...",
          success: "Nueva nota creada", 
          error: "Falló al crear una nota nueva"
      });
  };

  const handlePin = async (id: Id<"documents">, pinned: boolean) => {
    const result = await pinDocument({ id, pinned: !pinned });
    if (!result) {
      toast.error("Error al anclar nota"); 
      return;
    }
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  const handleArchive = async (id: Id<"documents">) => {
    const result = await archive({ id });
    if (!result) {
      toast.error("Error al mover a papelera");
      return;
    }
  
    toast.success("Nota borrada");
  };

  return (
    <div className="h-full bg-[#FBFBFA] dark:bg-[#1F1F1F] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-12">
        
        <header className="mb-12 space-y-2">
          <div className="flex items-center gap-x-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wider">{today}</span>
          </div>
          <h1 className="text-4xl font-medium text-neutral-900 dark:text-neutral-100">
            {getGreeting()}, {user?.firstName}.
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg min-h-[1.75rem]">
            {frase}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de recientes */}
          <div className="md:col-span-2 bg-white dark:bg-[#252525] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-x-2 mb-6">
              <Clock className="h-5 w-5 text-gray-900 dark:text-primary" />
              <h2 className="font-semibold text-neutral-700 dark:text-neutral-300">Abierto recientemente</h2>
            </div>
            
            <div className="space-y-3">
              {documents?.slice(0, 5).map((doc, index) => {
                const fillClass = 
                  index === 0
                    ? "text-gray-900 fill-gray-900 dark:text-gray-600 dark:fill-gray-600"
                    : index === 1
                    ? "text-gray-900 fill-gray-500 dark:text-gray-400 dark:fill-gray-400"
                    : "text-gray-900 opacity-50 dark:text-gray-600";

                return (
                  <div
                    key={doc._id}
                    onClick={() => router.push(`/documents/${doc._id}`)}
                    className="relative flex items-center p-3 hover:bg-neutral-50 dark:hover:bg-[#2F2F2F] rounded-xl cursor-pointer transition group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-3">
                      <FileIcon className={`h-4 w-4 ${fillClass}`} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{doc.title || "Sin título"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Última vez modificado: {format(doc._creationTime, "PP", { locale: es })} · {user?.firstName}
                      </p>
                    </div>

                    {/* Acciones en hover */}
                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 flex gap-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePin(doc._id, doc.isPinned ?? false);
                        }}
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <Pin 
                          className={`h-4 w-4 ${
                            doc.isPinned
                              ? "fill-chart-2 text-chart-2" 
                              : "text-muted-foreground hover:fill-primary/5"
                          }` }
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(doc._id);
                        }}
                        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  
                );
              })}
              {documents === undefined && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              )}
              {documents?.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No hay páginas recientes aún.</p>
              )}
              <Button 
                onClick={onCreate}
                className="w-full flex items-center gap-2 justify-center"
              >
                <PlusCircle className="h-4 w-4 mr-2"/>
                Crear nota
              </Button>
            </div>
          </div>
          {/* Sección TrashBox */}
          <div className="bg-white dark:bg-[#252525] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Papelera</h2>
            <TrashBox />
          </div>
          
        </div>
      </div>
    </div>
  );
}
