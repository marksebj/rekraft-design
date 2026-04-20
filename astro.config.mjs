import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rekraft.design',
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 8003,
    host: true,
  },
});
