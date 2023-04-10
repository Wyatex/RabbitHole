import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import {
  VantResolver,
  VueUseComponentsResolver,
} from 'unplugin-vue-components/resolvers'
import unocss from 'unocss/vite'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      dts: './typings/auto-imports.d.ts',
      imports: ['vue', 'pinia', 'vue-router', 'vue-i18n', '@vueuse/core'],
      resolvers: [],
    }),
    Components({
      dts: './typings/components.d.ts',
      extensions: ['vue'],
      include: [/\.vue$/],
      dirs: ['src/components/'],
      resolvers: [
        VantResolver(),
        NaiveUiResolver(),
        IconsResolver(),
        VueUseComponentsResolver(),
      ],
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    unocss(),
  ],
})
