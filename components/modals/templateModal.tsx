"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockNoteEditor } from "@blocknote/core"; 
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes"; 
import { useEdgeStore } from "@/lib/edgestore";
import { useTemplates } from "@/hooks/use-templates";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string; // JSON serializado de BlockNote
}

export const TemplateModal = ({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  initialContent = ""
}: TemplateModalProps) => {
  const [title, setTitle] = useState(initialTitle);
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const setEditor = useTemplates((s) => s.setEditor);

  // editor una sola vez
  const [editor] = useState(() =>
    BlockNoteEditor.create({
      initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    })
  );

  const prevDocRef = useRef(editor.document);

  const handleChange = async () => {
    const newDoc = editor.document;

    const prevImages = prevDocRef.current
      .flatMap(block => block.type === "image" ? [block.props?.url] : [])
      .filter(Boolean);
    const newImages = newDoc
      .flatMap(block => block.type === "image" ? [block.props?.url] : [])
      .filter(Boolean);

    const deletedImages = prevImages.filter(src => !newImages.includes(src));

    for (const src of deletedImages) {
      await edgestore.publicFiles.delete({ url: src });
    }

    prevDocRef.current = newDoc;
  };

  // Reinicio del título cuando cambian props
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialTitle ? "Editar plantilla" : "Nueva plantilla"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            className="w-full border rounded p-2"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Editor BlockNote */}
          <BlockNoteView 
            editor={editor}
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
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => {
              const content = JSON.stringify(editor.document); // Guardado como JSON
              onSave(title, content);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
