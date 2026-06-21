"use client";

import Image from "next/image";
import { LayoutTemplate, MoreVertical, Trash, Pencil, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

interface TemplateCardProps {
  id?: Id<"templates">;
  title: string;
  userImage?: string;
  userName?: string;
  isSystem?: boolean;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
  onPreview?: () => void;
  onEdit?: () => void; 
}

export const TemplateCard = ({
  id,
  title,
  userImage,
  onDelete,
  onRename,
  onPreview,
  onEdit
}: TemplateCardProps) => {
  const { user } = useUser();
  const firstName = user?.firstName;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  return (
    <div className="group relative flex flex-col justify-between aspect-video rounded-xl border border-zinc-800 bg-zinc-200 dark:bg-secondary p-5 transition-all duration-300">
      
      {/* Header de la Card */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-x-3 truncate">
          <div className="p-2 text-zinc-800 dark:text-zinc-300">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <div className="flex flex-col truncate">
            {isEditing ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  if (onRename) onRename(newTitle);
                }}
                autoFocus //coloca el cursor 
                className="font-semibold text-zinc-800 dark:text-zinc-300 truncate capitalize bg-transparent border-b focus:outline-none"
              />
            ) : (
              <h3
                className="font-semibold text-zinc-800 dark:text-zinc-300 truncate capitalize cursor-pointer"
                onClick={() => setIsEditing(true)} // activa la edición al hacer click en el título
              >
                {title.replace("_", " ")}
              </h3>
            )}
            <span className="text-[10px] text-zinc-500 dark:text-zinc-300 uppercase tracking-widest font-medium">
              {firstName}
            </span>
          </div>
        </div>

        {/* Acciones para plantillas de usuario */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-zinc-300 border-zinc-800 dark:bg-secondary">
              <DropdownMenuItem
                onClick={() => {
                  const newTitle = prompt("Nuevo título:", title);
                  if (newTitle && onRename) {
                    onRename(newTitle);
                  }
                }}
                className="cursor-pointer gap-x-2"
              >
                <Pencil className="h-4 w-4" /> Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-x-2 text-destructive focus:text-destructive">
                <Trash className="h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {/* Footer de la Card */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-x-2">
          {userImage && (
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
          <span className="text-xs text-zinc-500 italic dark:text-zinc-100">
            {firstName}  
          </span>
        </div>

        <div className="flex flex-col xl:flex-row justify-center md:justify-end sm:flex-row sm:gap-2">
          <Link href={`/templates/${String(id)}`}>
            <Button 
            variant="secondary" 
            size="sm" 
            onClick={onPreview}
            className="h-8 bg-zinc-700 hover:bg-zinc-500 text-white transition-colors my-2 md:mx-3"
          >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
          </Link>
          <Link href={`/templates/${String(id)}/editar`}>
            <Button 
            variant="secondary" 
            size="sm" 
            onClick={onEdit}
            className="h-8 bg-zinc-700 hover:bg-zinc-500 text-white transition-colors my-2 md:mx-3"
          >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
