interface ImportMetaEnv {
    readonly VITE_GOOGLE_API_SECRET: string;
    readonly VITE_GOOGLE_SEARCH_ENGINE_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }