import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

export const Logo = () => {
    return(
        <div className="md:flex items-center gap-x-2">
            <Image 
                src="/kraftLogoWeb.png"
                alt="Kraft Logo"
                width="60"
                height="60"
                className="dark:hidden"
            />
            <Image 
                src="/kraftLogoWebDarkVer.PNG"
                alt="Kraft Logo"
                width="60"
                height="60"
                className="hidden dark:block"
            />
        </div>
    )
}

export default Logo;