"use client";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/documents");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mt-8 pt-8 text-slate-900 dark:text-gray-200">
        Tu conocimiento,{" "}
        <span className="text-blue-800 dark:text-orange-500">conectado.</span>
      </h1>

      <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl font-medium mt-6 text-slate-600 dark:text-gray-200">
        Bienvenido a{" "}
        <span className="underline decoration-blue-500 font-bold">Kraft</span>: el espacio donde tus ideas se entrelazan y fluyen.
      </p>

      {isLoading && (
        <div className="w-full flex items-center justify-center pt-5">
          <Spinner size="lg" />
        </div>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button size="lg" className="mt-5">
            Comenzar a usar Kraft
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
