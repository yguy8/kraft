"use client";

import Image from "next/image";
import { 
  LayoutTemplate, 
  MoreVertical, 
  Trash, 
  Pencil, 
  Eye 
} from "lucide-react";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  id?: string;
  title: string;
  userImage?: string;
  isSystem?: boolean;
  onDelete?: () => void;
  onRename?: () => void;
  onPreview?: () => void;
}

export const TemplateCard = ({
  title,
  userImage,
  isSystem,
  onDelete,
  onRename,
  onPreview
}: TemplateCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between aspect-video rounded-xl border border-zinc-800 bg-zinc-200 dark:bg-secondary p-5 transition-all duration-300">
      
      {/* Header de la Card */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-x-3 truncate">
          <div className="p-2 text-zinc-800 dark:text-zinc-300">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <div className="flex flex-col truncate">
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-300 truncate capitalize">
              {title.replace("_", " ")}
            </h3>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-300 uppercase tracking-widest font-medium">
              {isSystem ? "De Kraft" : "Herramienta de Autor"}
            </span>
          </div>
        </div>

        {/* Acciones para plantillas de usuario */}
        {!isSystem && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-zinc-800">
              <DropdownMenuItem onClick={onRename} className="cursor-pointer gap-x-2">
                <Pencil className="h-4 w-4" /> Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-x-2 text-destructive focus:text-destructive">
                <Trash className="h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Footer de la Card */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-x-2">
          {isSystem ? (
            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <span className="text-[10px] font-bold text-zinc-400">K</span>
            </div>
          ) : (
            userImage && (
              <div className="relative h-6 w-6">
                <Image 
                  src={userImage} 
                  fill 
                  alt="Creador" 
                  className="rounded-full border border-zinc-700 object-cover"
                />
              </div>
            )
          )}
          <span className="text-xs text-zinc-500 italic">
            {isSystem ? "Kraft" : "Personalizado"}
          </span>
        </div>

        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onPreview}
          className="h-8 bg-zinc-700 hover:bg-zinc-500 text-white transition-colors"
        >
          <Eye className="h-4 w-4 mr-2" />
          Abrir
        </Button>
      </div>

      {/* Overlay de sistema (decorativo) */}
      {isSystem && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase font-bold">
          Por defecto
        </div>
      )}
    </div>
  );
};