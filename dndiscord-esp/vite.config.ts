import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solid()],
	server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext'
  }
});


