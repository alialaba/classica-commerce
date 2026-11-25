// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    // This forces Astro to send project styles as external files instead of inlining them
    inlineStylesheets: 'never', 
  },
});