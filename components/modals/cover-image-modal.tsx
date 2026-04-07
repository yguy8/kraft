"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider, type UploadFn } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFn: UploadFn = useCallback(
    async ({ file, onProgressChange, signal }) => {
      try {
        setIsUploading(true);
        

          const res = await edgestore.publicFiles.upload({
            file,
            signal,
            onProgressChange,
            options: {
              replaceTargetUrl: coverImage.url, 
            },
          });

        await update({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });

        coverImage.onClose();
        
        return res;
      } finally {
        setIsUploading(false);
      }
    },
    [edgestore, params.documentId, update, coverImage]
  );

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Imagen de portada
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <UploaderProvider uploadFn={uploadFn} autoUpload>
            <SingleImageDropzone
              width={400}
              height={200}
              disabled={isUploading}
              value={coverImage.url} 
            />
          </UploaderProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};