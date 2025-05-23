import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });



export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});


// export default defineConfig({
//   base: '/wikidata-tracker/',
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });