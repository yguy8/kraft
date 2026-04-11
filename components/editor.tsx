"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes"; 
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import { useRef } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({
  onChange,
  initialContent,
  editable = true
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent 
      ? (JSON.parse(initialContent) as PartialBlock[]) 
      : undefined,
    uploadFile: handleUpload,
  });

  const prevDocRef = useRef(editor.document);

  const handleChange = () => {
    const newDoc = editor.document;

    const prevImages = prevDocRef.current
      .flatMap(block => block.type === "image" ? [block.props?.url] : []);
    const newImages = newDoc
      .flatMap(block => block.type === "image" ? [block.props?.url] : []);

    const deletedImages = prevImages.filter(src => !newImages.includes(src));

    deletedImages.forEach(async (src) => {
      if (src) {
        await edgestore.publicFiles.delete({ url: src });
      }
    });

    prevDocRef.current = newDoc;
    onChange(JSON.stringify(newDoc, null, 2));
  };

  return (
    <div className="w-full max-w-5xl mx-auto md:px-10 group">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleChange}
      />
    </div>
  );
};

export default Editor;
