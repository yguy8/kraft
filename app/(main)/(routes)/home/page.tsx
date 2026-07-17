"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { FileIcon, Clock, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react"; 

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
          <div className="md:col-span-2 bg-white dark:bg-[#252525] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-x-2 mb-6">
              <Clock className="h-5 w-5 text-blue-900  dark:text-primary" />
              <h2 className="font-semibold text-neutral-700 dark:text-neutral-300">Abierto recientemente</h2>
            </div>
            
            <div className="space-y-3">
              {documents?.slice(0, 5).map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => router.push(`/documents/${doc._id}`)}
                  className="flex items-center p-3 hover:bg-neutral-50 dark:hover:bg-[#2F2F2F] rounded-xl cursor-pointer transition group"
                >
                  <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <FileIcon className="h-4 w-4 text-blue-900 dark:text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{doc.title || "Sin título"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Documento</p>
                  </div>
                </div>
              ))}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}