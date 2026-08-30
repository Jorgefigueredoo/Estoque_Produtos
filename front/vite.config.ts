import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // O CORS da API libera exatamente http://127.0.0.1:5500,
    // então o dev server sobe nesse mesmo host/porta.
    host: "127.0.0.1",
    port: 5500,
    strictPort: true,
  },
});
