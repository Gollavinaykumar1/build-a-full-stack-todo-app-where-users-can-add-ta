import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/build-a-full-stack-todo-app-where-users-can-add-ta/",
  build: { outDir: "dist", assetsDir: "assets" },
  server: { port: 3000 },
});
