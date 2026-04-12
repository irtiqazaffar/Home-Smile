// vite.config.js
import react from "file:///D:/Komal%20Jeet%20Singh%20Project/Home Smile/decor-and-company/admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/Komal%20Jeet%20Singh%20Project/Home Smile/decor-and-company/admin/node_modules/vite/dist/node/index.js";
import cssInjectedByJsPlugin from "file:///D:/Komal%20Jeet%20Singh%20Project/Home Smile/decor-and-company/admin/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
import { VitePWA } from "file:///D:/Komal%20Jeet%20Singh%20Project/Home Smile/decor-and-company/admin/node_modules/vite-plugin-pwa/dist/index.js";
import compression from "file:///D:/Komal%20Jeet%20Singh%20Project/Home Smile/decor-and-company/admin/node_modules/vite-plugin-compression2/dist/index.mjs";
import dns from "dns";
import path from "path";
var __vite_injected_original_dirname = "D:\\Komal Jeet Singh Project\\Home Smile\\decor-and-company\\admin";
dns.setDefaultResultOrder("verbatim");
var vite_config_default = defineConfig({
  // root: "./", // Set the root directory of your project
  // base: "/", // Set the base URL path for your application
  build: {
    outDir: "build",
    // comment this if you select vite as project when deploy
    assetsDir: "@/assets",
    // Set the directory for the static assets
    // sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      // Additional Rollup configuration options if needed
    },
    chunkSizeWarningLimit: 10 * 1024
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        // enabled: process.env.SW_DEV === "true",
        enabled: false,
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html"
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      },
      // add this to cache all the
      // // static assets in the public folder
      // includeAssets: ["**/*"],
      includeAssets: [
        "src/assets/img/logo/*.png",
        "src/assets/img/*.png",
        "src/assets/img/*.jepg",
        "src/assets/img/*.webp",
        "favicon.ico"
      ],
      manifest: {
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: ".",
        start_url: ".",
        id: ".",
        short_name: "Home Smile - Home Decor Products",
        name: "Home Smile | Home Decor Products",
        description: "Home Smile : Home Decor Products",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon"
          },
          {
            src: "/https://Home Smile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1729058653%2Fundefined%2FAsset16.png&w=1920&q=75",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/https://Home Smile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1729058653%2Fundefined%2FAsset16.png&w=1920&q=75",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "/https://Home Smile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1729058653%2Fundefined%2FAsset16.png&w=1920&q=75",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "/https://Home Smile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1729058653%2Fundefined%2FAsset16.png&w=1920&q=75",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    compression()
  ],
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:5065",
        changeOrigin: true
      }
    }
  },
  define: {
    "process.env": process.env
    // global: {}, //enable this when running on dev/local mode
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__vite_injected_original_dirname, "./src/")
    }
  },
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTest.js"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxLb21hbCBKZWV0IFNpbmdoIFByb2plY3RcXFxcRGVjb3JOQ29tcGFueVxcXFxkZWNvci1hbmQtY29tcGFueVxcXFxhZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcS29tYWwgSmVldCBTaW5naCBQcm9qZWN0XFxcXERlY29yTkNvbXBhbnlcXFxcZGVjb3ItYW5kLWNvbXBhbnlcXFxcYWRtaW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0tvbWFsJTIwSmVldCUyMFNpbmdoJTIwUHJvamVjdC9EZWNvck5Db21wYW55L2RlY29yLWFuZC1jb21wYW55L2FkbWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1jc3MtaW5qZWN0ZWQtYnktanNcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvbjJcIjtcclxuXHJcbmltcG9ydCBkbnMgZnJvbSBcImRuc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZG5zLnNldERlZmF1bHRSZXN1bHRPcmRlcihcInZlcmJhdGltXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvLyByb290OiBcIi4vXCIsIC8vIFNldCB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgeW91ciBwcm9qZWN0XHJcbiAgLy8gYmFzZTogXCIvXCIsIC8vIFNldCB0aGUgYmFzZSBVUkwgcGF0aCBmb3IgeW91ciBhcHBsaWNhdGlvblxyXG5cclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBcImJ1aWxkXCIsIC8vIGNvbW1lbnQgdGhpcyBpZiB5b3Ugc2VsZWN0IHZpdGUgYXMgcHJvamVjdCB3aGVuIGRlcGxveVxyXG4gICAgYXNzZXRzRGlyOiBcIkAvYXNzZXRzXCIsIC8vIFNldCB0aGUgZGlyZWN0b3J5IGZvciB0aGUgc3RhdGljIGFzc2V0c1xyXG4gICAgLy8gc291cmNlbWFwOiBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gQWRkaXRpb25hbCBSb2xsdXAgY29uZmlndXJhdGlvbiBvcHRpb25zIGlmIG5lZWRlZFxyXG4gICAgfSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAgKiAxMDI0LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGNzc0luamVjdGVkQnlKc1BsdWdpbigpLFxyXG5cclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgICBkZXZPcHRpb25zOiB7XHJcbiAgICAgICAgLy8gZW5hYmxlZDogcHJvY2Vzcy5lbnYuU1dfREVWID09PSBcInRydWVcIixcclxuICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAvKiB3aGVuIHVzaW5nIGdlbmVyYXRlU1cgdGhlIFBXQSBwbHVnaW4gd2lsbCBzd2l0Y2ggdG8gY2xhc3NpYyAqL1xyXG4gICAgICAgIHR5cGU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFjazogXCJpbmRleC5odG1sXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFtcIioqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnfVwiXSxcclxuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAgKiAxMDI0ICogMTAyNCxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGFkZCB0aGlzIHRvIGNhY2hlIGFsbCB0aGVcclxuICAgICAgLy8gLy8gc3RhdGljIGFzc2V0cyBpbiB0aGUgcHVibGljIGZvbGRlclxyXG4gICAgICAvLyBpbmNsdWRlQXNzZXRzOiBbXCIqKi8qXCJdLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy9sb2dvLyoucG5nXCIsXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy8qLnBuZ1wiLFxyXG4gICAgICAgIFwic3JjL2Fzc2V0cy9pbWcvKi5qZXBnXCIsXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy8qLndlYnBcIixcclxuICAgICAgICBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI0ZGRkZGRlwiLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiI0ZGRkZGRlwiLFxyXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXHJcbiAgICAgICAgc2NvcGU6IFwiLlwiLFxyXG4gICAgICAgIHN0YXJ0X3VybDogXCIuXCIsXHJcbiAgICAgICAgaWQ6IFwiLlwiLFxyXG4gICAgICAgIHNob3J0X25hbWU6IFwiRGVjb3JOQ29tcGFueSAtIEhvbWUgRGVjb3IgUHJvZHVjdHNcIixcclxuICAgICAgICBuYW1lOiBcIkRlY29yTkNvbXBhbnkgfCBIb21lIERlY29yIFByb2R1Y3RzXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246XHJcbiAgICAgICAgICBcIkRlY29yTkNvbXBhbnkgOiBIb21lIERlY29yIFByb2R1Y3RzXCIsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UveC1pY29uXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwiL2h0dHBzOi8vZGVjb3JuY29tcGFueS5jb20vX25leHQvaW1hZ2U/dXJsPWh0dHBzJTNBJTJGJTJGcmVzLmNsb3VkaW5hcnkuY29tJTJGZGpyYmRndHpyJTJGaW1hZ2UlMkZ1cGxvYWQlMkZ2MTcyOTA1ODY1MyUyRnVuZGVmaW5lZCUyRkFzc2V0MTYucG5nJnc9MTkyMCZxPTc1XCIsXHJcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgcHVycG9zZTogXCJtYXNrYWJsZVwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcIi9odHRwczovL2RlY29ybmNvbXBhbnkuY29tL19uZXh0L2ltYWdlP3VybD1odHRwcyUzQSUyRiUyRnJlcy5jbG91ZGluYXJ5LmNvbSUyRmRqcmJkZ3R6ciUyRmltYWdlJTJGdXBsb2FkJTJGdjE3MjkwNTg2NTMlMkZ1bmRlZmluZWQlMkZBc3NldDE2LnBuZyZ3PTE5MjAmcT03NVwiLFxyXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwiL2h0dHBzOi8vZGVjb3JuY29tcGFueS5jb20vX25leHQvaW1hZ2U/dXJsPWh0dHBzJTNBJTJGJTJGcmVzLmNsb3VkaW5hcnkuY29tJTJGZGpyYmRndHpyJTJGaW1hZ2UlMkZ1cGxvYWQlMkZ2MTcyOTA1ODY1MyUyRnVuZGVmaW5lZCUyRkFzc2V0MTYucG5nJnc9MTkyMCZxPTc1XCIsXHJcbiAgICAgICAgICAgIHNpemVzOiBcIjM4NHgzODRcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCIvaHR0cHM6Ly9kZWNvcm5jb21wYW55LmNvbS9fbmV4dC9pbWFnZT91cmw9aHR0cHMlM0ElMkYlMkZyZXMuY2xvdWRpbmFyeS5jb20lMkZkanJiZGd0enIlMkZpbWFnZSUyRnVwbG9hZCUyRnYxNzI5MDU4NjUzJTJGdW5kZWZpbmVkJTJGQXNzZXQxNi5wbmcmdz0xOTIwJnE9NzVcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICBjb21wcmVzc2lvbigpLFxyXG4gIF0sXHJcblxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpL1wiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTA2NVwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIFwicHJvY2Vzcy5lbnZcIjogcHJvY2Vzcy5lbnYsXHJcbiAgICAvLyBnbG9iYWw6IHt9LCAvL2VuYWJsZSB0aGlzIHdoZW4gcnVubmluZyBvbiBkZXYvbG9jYWwgbW9kZVxyXG4gIH0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9cIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIHNldHVwRmlsZXM6IFtcIi4vc3JjL3NldHVwVGVzdC5qc1wiXSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxWSxPQUFPLFdBQVc7QUFDdlosU0FBUyxvQkFBb0I7QUFDN0IsT0FBTywyQkFBMkI7QUFDbEMsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBRXhCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFQakIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBSSxzQkFBc0IsVUFBVTtBQUVwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUEsRUFJMUIsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQTtBQUFBLElBRVgsZUFBZTtBQUFBO0FBQUEsSUFFZjtBQUFBLElBQ0EsdUJBQXVCLEtBQUs7QUFBQSxFQUM5QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sc0JBQXNCO0FBQUEsSUFFdEIsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsWUFBWTtBQUFBO0FBQUEsUUFFVixTQUFTO0FBQUE7QUFBQSxRQUVULE1BQU07QUFBQSxRQUNOLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsZ0NBQWdDO0FBQUEsUUFDL0MsK0JBQStCLEtBQUssT0FBTztBQUFBLE1BQzdDO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQSxlQUFlO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxJQUFJO0FBQUEsUUFDSixZQUFZO0FBQUEsUUFDWixNQUFNO0FBQUEsUUFDTixhQUNFO0FBQUEsUUFDRixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsUUFBUTtBQUFBO0FBQUEsRUFFekI7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQTtBQUFBLE1BRUwsS0FBSyxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLG9CQUFvQjtBQUFBLEVBQ25DO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
