/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_MODE?: 'github-pr';
  readonly VITE_GITHUB_REPOSITORY?: string;
  readonly VITE_GITHUB_BRANCH_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
