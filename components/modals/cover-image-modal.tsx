"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

  const systemCovers = useQuery(api.covers.getSystemCovers);

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

  const onSelectKraftCover = async (url: string) => {
    await update({
      id: params.documentId as Id<"documents">,
      coverImage: url,
    });
    coverImage.onClose();
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[600px] lg:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Imagen de portada
          </DialogTitle>
        </DialogHeader>

        {/* 👇 Tabs para alternar entre subir y Kraft */}
        <Tabs defaultValue="upload" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upload">Subir portada</TabsTrigger>
            <TabsTrigger value="kraft">Portadas Kraft</TabsTrigger>
          </TabsList>

          {/* Subir portada */}
          <TabsContent value="upload">
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
          </TabsContent>

          {/* Portadas Kraft */}
          <TabsContent value="kraft">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {systemCovers?.map((cover) => (
                <button
                  key={cover._id}
                  onClick={() => onSelectKraftCover(cover.imageUrl)}
                  className="rounded overflow-hidden border hover:ring-2 hover:ring-blue-500"
                >
                  <Image
                    src={cover.imageUrl}
                    alt={cover.title}
                    width={200}
                    height={120}
                    className="object-cover w-full h-[120px]"
                  />
                  <p className="text-xs text-center mt-1">{cover.title}</p>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
