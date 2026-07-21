"use client";

import Image from "next/image";
import { ImageIcon, X, ArrowUp, ArrowDown} from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState } from "react";

interface CoverImageProps{
    url?: string;
    preview?: boolean;
    offsetY?: number;
}

export const Cover = ({
    url, 
    preview,
    offsetY, 
} : CoverImageProps) => {
    const { edgestore } = useEdgeStore();
    const params = useParams();
    const coverImage = useCoverImage();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);
    const updateCoverOffset = useMutation(api.documents.updateCoverOffset);
   //const [isRepositioning, setIsRepositioning] = useState(false);
    const [localOffset, setLocalOffset] = useState(offsetY || 0);

    const imageHeight = 300; //px
    const containerHeight = 500; //px
    const maxOffset = imageHeight - containerHeight;

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
                <motion.div
                    style={{ y: localOffset}}
                    className="absolute inset-0"
                >
                <Image
                    src={url}
                    fill
                    alt="Cover"
                    className="object-cover"
                />
                </motion.div>
            )}

            {url && !preview &&(
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={() => {
                        const newOffset = Math.max(localOffset - 10, -maxOffset);
                        setLocalOffset(newOffset);
                        updateCoverOffset({
                            id: params.documentId as Id<"documents">,
                            offsetY: newOffset,
                        });
                        }}
                        size="icon"
                        variant="outline"
                        className="p-1 rounded-full bg-white shadow"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>

                    <Button
                        onClick={() => {
                        const newOffset = Math.min(localOffset + 10, 0);
                        setLocalOffset(newOffset);
                        updateCoverOffset({
                            id: params.documentId as Id<"documents">,
                            offsetY: newOffset,
                        });
                        }}
                        size="icon"
                        variant="outline"
                        className="p-1 rounded-full bg-white shadow"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>

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
