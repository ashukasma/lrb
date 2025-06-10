/// <reference types="vite/client" />
// add import.meta.env.VITE_API_URL url to the environment variables
interface ImportMetaEnv {
    readonly NEXT_PUBLIC_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}