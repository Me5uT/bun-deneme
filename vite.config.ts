import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "src"), // 'src' klasörünüzdeki 'app' dizinine yönlendirir
    },
  },
  server: {
    port: 9000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 8080 portundaki backend'e yönlendirme
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
