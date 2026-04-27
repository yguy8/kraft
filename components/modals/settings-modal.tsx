"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { ExternalLink, LayoutTemplate } from "lucide-react";

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export const SettingsModal = () => {
    const settings = useSettings();
    const router = useRouter();
    
    // Consulta para el contador de plantillas
    const templates = useQuery(api.templates.get);

    const onEdit = () => {
        settings.onClose();
        router.push("/templates");
    };

    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-lg font-medium">
                        Configuración
                    </DialogTitle>
                </DialogHeader>

                {/* Sección de Apariencia */}
                <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col gap-y-1">
                        <Label>Apariencia</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Personaliza cómo se ve Kraft en tu dispositivo.
                        </span>
                    </div>
                    <ModeToggle />
                </div>

                {/* Separador */}
                <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-4" />

                {/* Sección de Plantillas */}
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-x-3">
                        <div className="p-2 bg-orange-500/10 rounded-md">
                            <LayoutTemplate className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Label>
                                Plantillas ({templates?.length || 0} / 20)
                            </Label>
                            <span className="text-[0.8rem] text-muted-foreground">
                                Administra tus herramientas personalizadas.
                            </span>
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={onEdit}
                        className="gap-x-2"
                    >
                        Editar
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;