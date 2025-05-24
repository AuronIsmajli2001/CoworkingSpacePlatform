/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_FRONTEND_URL: string
  readonly VITE_RESERVATIONS_API: string
  // add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}