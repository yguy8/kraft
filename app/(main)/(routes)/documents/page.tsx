"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({title: "Sin título"})
        .then((documentId) => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Creando nueva nota...",
            success: "Nueva nota creada", 
            error: "Falló al crear una nota nueva"
        })
    }

    return(
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/paginaVacia.png"
                height="300"
                width="400"
                alt="Página vacia"
            />

            <h2 className=" text-lg font-medium">¡Hey {user?.firstName}! Tu Kraft está listo para que lo llenes de ideas.</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Crear nota
            </Button>
        </div>
    )
}

export default DocumentsPage;