/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // puedes agregar otras variables aquí
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
