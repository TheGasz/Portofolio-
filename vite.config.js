/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    // Property-based tests (fast-check, 100 iterations) render under jsdom,
    // which is a known-slow combination that can exceed the default 5000ms
    // per-test timeout under parallel resource contention. Raise it so the
    // full suite runs reliably.
    testTimeout: 20000,
  },
})
