import { AuthConfig } from "convex/server";

export default {
    providers:[
        {
            domain: "https://growing-herring-77.clerk.accounts.dev", 
            applicationID: "convex",
        },
    ]
}   satisfies AuthConfig;