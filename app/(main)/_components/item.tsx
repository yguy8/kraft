"use client";

import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash, Pin } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    isTemplate?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
    pinned?: boolean;
};

export const Item = ({
    id,
    label, 
    onClick, 
    icon: Icon, 
    active, 
    documentIcon, 
    isSearch, 
    isTemplate,
    level = 0, 
    onExpand, 
    expanded, 
    pinned
}: ItemProps) => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);
    const pinDocument = useMutation(api.documents.pinDocument);

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if(!id) return;
        const promise = archive({ id })
        .then(() => router.push("/documents"));

        toast.promise(promise, {
            loading: "Borrando...",
            success: pinned ? "Nota borrada y desanclada": "Nota borrada",
            error: "Error al borrar nota."
        });
    };

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        onExpand?.();
    };

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (!id) return;
        const promise = create({title: "Sin título", parentDocument: id})
        .then((documentId) => {
            if(!expanded){
                onExpand?.();
            }
                router.push(`/documents/${documentId}`);
        });

        toast.promise(promise, {
            loading: "Creando una nueva nota...",
            success: "Nueva nota creada",
            error: "Error al crear nueva nota"
        });
    };

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return(
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${(level * 12) + 12}px` :"12px" 

            }}
            className={cn(
                "group min-h-27px text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
                pinned? "bg-gray-200 text-primary dark:bg-blue-950" : "text-muted-foreground hover:bg-primary/5"
            )}
        >
            {!!id && (
                <div 
                role="button"
                className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-blue-900"
                onClick={handleExpand}
                >
                    <ChevronIcon 
                    className="h-5 w-5 shrink-0 text-muted-foreground"
                    />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-18px">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-18px mr-2 text-muted-foreground
            "/>
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-10px font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">CTRL</span>K
                </kbd>
            )}

            {isTemplate && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-10px font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">/</span>
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                        onClick={(e) => e.stopPropagation()}
                        asChild>

                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-blue-900"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        className="w-60 h-20"
                        align="start"
                        side="right"
                        forceMount
                        >   
                        
                        {pinned ? (
                            <DropdownMenuItem asChild>
                                <ConfirmModal
                                title={pinned ? "Nota anclada" : "¿Estás seguro?"}
                                description={
                                    pinned
                                    ? "Esta nota está anclada. ¿Seguro que quieres borrarla?"
                                    : "Esta acción no se puede deshacer"
                                }
                                onConfirm={() => {
                                    if (!id) return;
                                    const promise = archive({ id }).then(() => router.push("/documents"));

                                    toast.promise(promise, {
                                        loading: "Borrando...",
                                        success: "Nota borrada y desanclada",
                                        error: "Error al borrar nota.",
                                    });
                                }}
                                >
                                <div className="flex items-center text-sm m-2">
                                <Trash className="h-4 w-4 mr-4 text-muted-foreground" />
                                    Borrar
                                </div>
                                </ConfirmModal>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem 
                                onClick={onArchive}
                            >
                                <Trash className="h-4 w-4 mr-2"/>
                                Borrar
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                            Última vez editado por: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div 
                        role="button"
                        onClick={(e) =>{
                            e.stopPropagation();
                            if (!id) return;
                            const newPinnedState = !pinned;

                            const run = async () => {
                                const result = await pinDocument({ id, pinned: newPinnedState });

                                if (!result.ok) {
                                    toast.error(result.message);
                                    return;
                                }

                                toast.success(result.message);
                                };
                                
                            run();
                        }}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-blue-900"
                    >
                        <Pin 
                            className={`h-4 w-4 ${
                                pinned ? "fill-chart-2 text-chart-2" : "text-muted-foreground hover:fill-primary/5"
                            }`}
                        />
                    </div>
                    <div 
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground dark:hover:bg-blue-900"/>
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: {level?: number}){
    return(
        <div 
        style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
        }}    
        className="flex gapx-2 py-3px"
        >
            <Skeleton className="h-4 w-4"/>
            <Skeleton className="h-4 w-30%"/>
        </div>
    )
}