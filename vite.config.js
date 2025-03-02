import tailwindcss from '@tailwindcss/vite';
import vue from "@vitejs/plugin-vue";
import "dotenv/config";
import { defineConfig } from "vite";
import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ["page"].includes(tag)
                }
            },
            babel: {
                plugins: ['optionalChainingAssign']
            }
        }),
        babel({
            babelConfig: {
                babelrc: false,
                configFile: false,
                plugins: ['@babel/plugin-transform-optional-chaining']
            }
        }),
        tailwindcss()
    ],
    server: {
        port: 3000,
        host: true
    }
});
