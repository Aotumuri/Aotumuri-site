import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pages supplies BASE_PATH in CI; local and custom-domain builds use '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
});
