"use client";

import Image from "next/image";
import { ImageIcon, X} from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface CoverImageProps{
    url?: string;
    preview?: boolean;
}

export const Cover = ({
    url, 
    preview,
} : CoverImageProps) => {
    const { edgestore } = useEdgeStore();
    const params = useParams();
    const coverImage = useCoverImage();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);
    
    const onRemove = async () => {
        if (url) {
            // Si la portada es de EdgeStore 
            if (url.includes("edgestore")) {
            await edgestore.publicFiles.delete({ url });
            }
        }
        // Quitar la referencia en Convex
        removeCoverImage({
            id: params.documentId as Id<"documents">,
        });
    };

    return(
        <div className={
            cn("relative w-full h-[35vh] group overflow-hidden",
                !url && "h-[12vh]",
                url && "bg-muted"
        )}>
            {!!url &&(
                <Image
                    src={url}
                    fill
                    alt="Cover"
                    className="object-cover"
                />
            )}

            {url && !preview &&(
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={() => coverImage.onReplace(url)}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2"/>
                        Cambiar portada
                    </Button>
                    <Button
                        onClick={onRemove}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <X className="h-4 w-4 mr-2"/>
                        Eliminar portada
                    </Button>
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return(
        <Skeleton className="w-full h-[12vh]"/>
    )
}
