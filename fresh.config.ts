import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { authPlugin } from "./plugins/auth.ts";

export default defineConfig({
  plugins: [authPlugin, tailwind()],
});
