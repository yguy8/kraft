import { Button } from "@/components/ui/button";
import Logo from "./logo";

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-22 text-muted-foreground">
                <Button variant="ghost" size="sm">Privacidad</Button>
                <Button variant="ghost" size="sm">Terminos y condiciones</Button>
            </div>
        </div>
    )
}

export default Footer;