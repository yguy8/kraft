"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useTemplates } from "@/hooks/use-templates";

export const TemplateCommand = () => {
  const [isMounted, setIsMounted] = useState(false);

  const isOpen = useTemplates((store) => store.isOpen);
  const onClose = useTemplates((store) => store.onClose);
  const editor = useTemplates((store) => store.editor);
  const onUpdateTitle = useTemplates((store) => store.onUpdateTitle);

  //Plantillas del usuario
  const customTemplates = useQuery(api.templates.get);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSelect = (template: any) => {
    if (!editor || !template) {
      return onClose();
    }

    const newTitle = template.title.charAt(0).toUpperCase() + template.title.slice(1);
    onUpdateTitle(newTitle);

    const currentBlock = editor.getTextCursorPosition().block;

    // El contenido viene como string JSON → parsearlo
    const blocks = JSON.parse(template.content);

    editor.insertBlocks(blocks, currentBlock, "after");

    const isEmpty = Array.isArray(currentBlock.content) && currentBlock.content.length === 0;
    if (isEmpty) {
      editor.removeBlocks([currentBlock]);
    }

    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Usar plantilla..." />
      <CommandList>
        <CommandEmpty>No se encontraron plantillas.</CommandEmpty>

        {/* Grupo de plantillas del sistema
        <CommandGroup heading="Plantillas de Kraft">
          {systemTemplates?.map((t) => (
            <CommandItem key={t._id} onSelect={() => onSelect(t)}>
              <span>{t.title.charAt(0).toUpperCase() + t.title.slice(1)}</span>
            </CommandItem>
          ))}
        </CommandGroup> */}

        {/* Grupo de plantillas del usuario */}
        <CommandGroup heading="Mis plantillas">
          {customTemplates?.map((t) => (
            <CommandItem key={t._id} onSelect={() => onSelect(t)}>
              <span>{t.title.charAt(0).toUpperCase() + t.title.slice(1)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
