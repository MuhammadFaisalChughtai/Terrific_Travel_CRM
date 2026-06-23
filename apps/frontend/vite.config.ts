import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const rootEnv = loadEnv(mode, resolve(__dirname, "../.."), "");

  // Backend URL for the Vite dev-server proxy
  const backendUrl =
    process.env.VITE_BACKEND_URL ||
    rootEnv.VITE_BACKEND_URL ||
    env.VITE_BACKEND_URL ||
    "http://localhost:3000";

  const currency =
    process.env.CURRENCY || rootEnv.CURRENCY || env.VITE_CURRENCY || "USD";
  const currencySymbol =
    process.env.CURRENCY_SYMBOL ||
    rootEnv.CURRENCY_SYMBOL ||
    env.VITE_CURRENCY_SYMBOL ||
    "";

  // Public MinIO URL:
  //   Dev:  http://localhost:9000      (set MINIO_PUBLIC_URL in .env)
  //   Prod: https://cdn.terrifictravel.co.uk  (set in .env.production)
  const minioPublicUrl =
    process.env.MINIO_PUBLIC_URL ||
    rootEnv.MINIO_PUBLIC_URL ||
    env.VITE_MINIO_URL ||
    "http://localhost:9000";

  return {
    plugins: [react()],
    define: {
      "process.env.VITE_CURRENCY": JSON.stringify(currency),
      "process.env.VITE_CURRENCY_SYMBOL": JSON.stringify(currencySymbol),
      // Available in frontend as: import.meta.env.VITE_MINIO_URL
      "import.meta.env.VITE_MINIO_URL": JSON.stringify(minioPublicUrl),
    },
    server: {
      port: 5173,
      host: true,
      allowedHosts: ["crm.terrifictravel.co.uk"],
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
