"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";
import { Navigation } from "./_components/navigation";

const MainLayoout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter(); 

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/"); 
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading){
        return(
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    if(!isAuthenticated){
        return null; 
    }

    return (
        <div className="h-full flex dark:bg-[#1f1f1f]">
            <Navigation/>
            <main className="flex-1 h-full overflow-y-auto">
                <SearchCommand/>
                {children}
            </main>
        </div>
    );
}

export default MainLayoout;