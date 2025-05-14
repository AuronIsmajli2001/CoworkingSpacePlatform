/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_HTTPS_API_URL: string
    readonly VITE_ENV: 'development' | 'production'
    // Add other variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }