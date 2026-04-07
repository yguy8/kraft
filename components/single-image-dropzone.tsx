'use client';

import { SingleImageDropzone } from '@/components/upload/single-image';
import {
  UploaderProvider,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import * as React from 'react';
import { useState } from 'react'; 

import { Spinner } from './spinner';

export function SingleImageDropzoneUsage() {
  const { edgestore } = useEdgeStore();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      try {
        setIsUploading(true); 
        const res = await edgestore.publicFiles.upload({
          file,
          signal,
          onProgressChange,
        });

        console.log(res);
        return res;
      } catch (error) {
        console.error("Error en la subida:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [edgestore],
  );

  return (
    <div className="relative inline-block"> 
      {isUploading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 rounded-lg backdrop-blur-[1px]">
          <Spinner size="lg" />
        </div>
      )}

      <UploaderProvider uploadFn={uploadFn} autoUpload>
        <SingleImageDropzone
          height={200}
          width={200}
          disabled={isUploading}
          dropzoneOptions={{
            maxSize: 1024 * 1024 * 1, // 1 MB
          }}
        />
      </UploaderProvider>
    </div>
  );
}