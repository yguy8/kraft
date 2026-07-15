"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { ExternalLink, LayoutTemplate } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

    const setTrashPolicy = useMutation(api.userSettings.setTrashPolicy);
    
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
                        <div className="p-2 bg-gray-300 dark:bg-blue-900 rounded-md">
                            <LayoutTemplate className="h-5 w-5 text-blue-900 dark:text-gray-300" />
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
                {/* Separador */}
                <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-4" />
                {/* Sección de Borrado de papelera */}
                <div className="flex flex-col gap-y-2 py-2">
                <Label>Borrado de papelera</Label>
                <span className="text-[0.8rem] text-muted-foreground">
                    Elige cada cuánto se vacía automáticamente.
                </span>
                <RadioGroup
                    value={settings.trashPolicy || "manual"}
                    onValueChange={(value) => {
                        setTrashPolicy({ policy: value });
                        settings.setTrashPolicy(value);
                    }}
                    className="flex flex-row gap-x-6 mt-2"
                    >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="30" className="hidden peer" />
                        <Label
                        htmlFor="30"
                        className="cursor-pointer px-2 py-1 rounded border 
                                    peer-data-[state=checked]:border-blue-600 
                                    peer-data-[state=checked]:text-blue-600"
                        >
                        30 días
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem value="60" id="60" className="hidden peer" />
                        <Label
                        htmlFor="60"
                        className="cursor-pointer px-2 py-1 rounded border 
                                    peer-data-[state=checked]:border-blue-600 
                                    peer-data-[state=checked]:text-blue-600"
                        >
                        60 días
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem value="90" id="90" className="hidden peer" />
                        <Label
                        htmlFor="90"
                        className="cursor-pointer px-2 py-1 rounded border 
                                    peer-data-[state=checked]:border-blue-600 
                                    peer-data-[state=checked]:text-blue-600"
                        >
                        90 días
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem value="manual" id="manual" className="hidden peer" />
                        <Label
                        htmlFor="manual"
                        className="cursor-pointer px-2 py-1 rounded border 
                                    peer-data-[state=checked]:border-blue-600 
                                    peer-data-[state=checked]:text-blue-600"
                        >
                        De manera manual
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem value="auto" id="auto" className="hidden peer" />
                        <Label
                        htmlFor="auto"
                        className="cursor-pointer px-2 py-1 rounded border 
                                    peer-data-[state=checked]:border-blue-600 
                                    peer-data-[state=checked]:text-blue-600"
                        >
                        Al cerrar sesión
                        </Label>
                    </div>
                    </RadioGroup>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;