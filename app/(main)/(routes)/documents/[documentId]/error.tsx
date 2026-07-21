"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-medium">Documento no encontrado</h2>
      <Button asChild>
        <Link href="/documents">Regresar a documentos</Link>
      </Button>
    </div>
  );
}
