import { create } from "zustand";

type SettingsStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    trashPolicy: string; // <-- agrega esto
    setTrashPolicy: (policy: string) => void;
};

export const useSettings = create<SettingsStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
    trashPolicy: "manual", // valor inicial
    setTrashPolicy: (policy) => set({ trashPolicy: policy }),
}));


