import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { name } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name,
      formats: ["es", "umd"],
      fileName: (format) => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "formik",
        "semantic-ui-react",
        "semantic-ui-css",
        "semantic-ui-less",
        "@babel/runtime",
        "@ckeditor/ckeditor5-build-classic",
        "@ckeditor/ckeditor5-react",
        "axios",
        "lodash",
        "luxon",
        "yup",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled",
          "semantic-ui-react": "semantic-ui-react",
        },
      },
    },
  },
});
