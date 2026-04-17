import { create } from "zustand";
import { BlockNoteEditor } from "@blocknote/core";

type Templates = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    toggle: () => void;
    //comunicación con el editor
    editor: BlockNoteEditor | null;
    setEditor: (editor: BlockNoteEditor | null) => void;
    // modificación del título de la página
    onUpdateTitle: ( title: string ) => void;
    setUpdateTitle: (fn: (title: string) => void) => void;
};

export const useTemplates = create<Templates>((set, get) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
    toggle: () => set({ isOpen: !get().isOpen}),

    editor: null,
    setEditor:(editor) => set({ editor }),

    onUpdateTitle: () => {},
    setUpdateTitle: (fn) => set({ onUpdateTitle: fn}),
}));

