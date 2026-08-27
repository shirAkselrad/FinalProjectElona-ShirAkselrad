import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,

    proxy: {
      "/register": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/login": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/shop": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/employee": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/manager": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/forgotPassword": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/recoveryPage": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },

      "/resetPassword": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
