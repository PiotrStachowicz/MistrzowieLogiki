/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_EMAILJS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
