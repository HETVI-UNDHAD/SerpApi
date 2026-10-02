import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyLogoPlugin() {
  const sync = () => {
    try {
      const src = path.resolve('../logo.png');
      if (fs.existsSync(src)) {
        const destDir = path.resolve('public/assets');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(src, path.join(destDir, 'travelosai-logo.png'));
        fs.copyFileSync(src, path.resolve('public/travelosai-logo.png'));
        fs.copyFileSync(src, path.resolve('public/logo.png'));
        
        const srcAssets = path.resolve('src/assets');
        if (!fs.existsSync(srcAssets)) fs.mkdirSync(srcAssets, { recursive: true });
        fs.copyFileSync(src, path.join(srcAssets, 'travelosai-logo.png'));
      }
    } catch (err) {
      console.error('Logo sync error:', err);
    }
  };

  return {
    name: 'copy-logo-plugin',
    buildStart() {
      sync();
    },
    configureServer(server) {
      sync();
    }
  };
}

export default defineConfig({
  plugins: [react(), copyLogoPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:5000'
    }
  }
});
