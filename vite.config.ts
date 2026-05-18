import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const adminPlugin = (countryDir: string, country: string): Plugin => ({
  name: 'civic-pulse-admin',
  apply: 'serve',
  async configureServer(server) {
    const { createAdminMiddleware } = await import('./scripts/admin-middleware.mjs');
    server.middlewares.use(createAdminMiddleware({ countryDir, country }));
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const country = (env.COUNTRY || process.env.COUNTRY || 'example').toLowerCase();
  const countryDir = path.resolve(__dirname, 'countries', country);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), adminPlugin(countryDir, country)],
    resolve: {
      alias: {
        '@core': path.resolve(__dirname, 'packages/core/src'),
        '@country': countryDir,
      },
    },
    define: {
      __COUNTRY__: JSON.stringify(country),
      __SITE_URL__: JSON.stringify(env.SITE_URL || 'http://localhost:3000'),
    },
  };
});
