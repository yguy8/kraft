"use client";

import { useEffect, useState } from "react";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import { useTemplates } from "@/hooks/use-templates";
import { KRAFT_TEMPLATES } from "@/lib/templates-data";

export const TemplateCommand = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    const isOpen = useTemplates((store) => store.isOpen);
    const onClose = useTemplates((store) => store.onClose);
    const editor = useTemplates((store) => store.editor);
    const onUpdateTitle = useTemplates((store) => store.onUpdateTitle);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const onSelect = (id: string) => {
        const templateData = KRAFT_TEMPLATES[id as keyof typeof KRAFT_TEMPLATES];
        
        if(!editor || !templateData){
            return onClose();
        }

        const newTitle = id.charAt(0).toUpperCase() + id.slice(1);
        onUpdateTitle(newTitle);

        const currentBlock = editor.getTextCursorPosition().block;

        editor.insertBlocks(
            templateData as any, 
            currentBlock,
            "after"
        );

        const isEmpty = Array.isArray(currentBlock.content) && currentBlock.content.length === 0;

        if(isEmpty){
            editor.removeBlocks([currentBlock]);
        }

        onClose();
    };

    if (!isMounted){
        return null;
    }

    return(
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput 
            placeholder={`Usar plantilla...`}
            />
            <CommandList>
                <CommandEmpty>No se encontráron plantillas.</CommandEmpty>
                <CommandGroup heading="Plantillas de Kraft">
                {Object.keys(KRAFT_TEMPLATES).map((id) => (
                    <CommandItem key={id} onSelect={() => onSelect(id)}>
                        <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
