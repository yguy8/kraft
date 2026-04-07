"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
    return(
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/public/error.png"
                height="300"
                width="300"
                alt="Error"
            />
            <h2 className="text-xl font-medium">Algo salió mal</h2>
            <Button asChild>
                <Link href="/documents">
                    Regresar
                </Link>
            </Button>
        </div>
    );
}

export default Error;