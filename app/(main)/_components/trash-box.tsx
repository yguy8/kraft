"use clent";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);
    const { edgestore } = useEdgeStore();
    const clearTrash = useMutation(api.userSettings.clearTrash);

    const [search, setSearch] = useState("");

    const filterDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: Id<"documents">) => {
        router.push(`/documents/${documentId}`);
    };


    const onRestore = (
        event: React.MouseEvent<HTMLDivElement>,
        documentId: Id<"documents">,
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restaurando nota...",
            success: "Nota restaurada",
            error: "Error al restaurar nota"
        });
    };

    const onRemove = (documentId: Id<"documents">) => {
        const promise = remove({ id: documentId })
            .then(() => {
            if (params.documentId === documentId) {
                router.push("/documents");
            }
            });

        toast.promise(promise, {
            loading: "Borrando nota...",
            success: "Nota borrada",
            error: "Error al borrar nota"
        });
    };


    if (documents === undefined){
        return(
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg"/>
            </div>
        );
    }

    const handleClearTrash = async () => {
    documents?.forEach(async (doc) => {
        const allImages = [
        ...(doc.images || []),
        doc.coverImage,
        doc.icon,
        ].filter((url): url is string => !!url);

        for (const url of allImages) {
            try {
                await edgestore.publicFiles.delete({ url });
            } catch (err) {
                toast.warning(`No se pudo borrar la imagen: ${url}`);
            }
        }
    });

    const promise = clearTrash({});
    toast.promise(promise, {
        loading: "Vaciando papelera...",
        success: "Papelera vaciada",
        error: "Error al vaciar papelera",
    });
    };


    return(
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4"/>
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filtrar página por título"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    Documentos no encontrados
                </p>
                {filterDocuments?.map((document) => (
                    <div
                    key={document._id}
                    role="button"
                    onClick={() => onClick(document._id)}
                    className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div
                            onClick={(e) => onRestore(e, document._id)}
                            role="button"
                            className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-blue-900"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground"/>
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-blue-900"
                                >
                                    <Trash className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
                        <div className="flex justify-center p-2">
                        <ConfirmModal onConfirm={handleClearTrash}>
                            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 flex items-center gap-2">
                            <Trash className="h-4 w-4" />
                            Vaciar papelera
                            </button>
                        </ConfirmModal>
                        </div>
            </div>
        </div>
    );
};