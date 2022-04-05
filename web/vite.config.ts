import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import windiCSS from 'vite-plugin-windicss'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin as svgIconsPlugin } from 'vite-plugin-svg-icons'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import components from 'unplugin-vue-components/vite'
import {NaiveUiResolver, VantResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig(async ({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const apiUrl = env.VITE_API_URL
  const proxy = {}
  proxy[apiUrl] = {
    target: env.VITE_PROXY,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${apiUrl}`), ''),
  }

  return {
    plugins: [
      vue(),
      // eslintPlugin({
      //   include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'],
      // }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: mode === 'development',
      }),
      svgIconsPlugin({
        iconDirs: [resolve(__dirname, 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      windiCSS(),
      vueSetupExtend(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            appTitle: env.VITE_APP_TITLE,
          },
        },
      }),
      styleImport({
        resolves: [VantResolve()],
      }),
      components({
        resolvers: [NaiveUiResolver(), VantResolver()],
      }),
      viteCompression(),
    ],
    base: env.VITE_BASE_URL, // 设置打包路径
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '/#/': resolve(__dirname, 'types/'),
      },
    },
    server: {
      host: true,
      port: 8080,
      proxy,
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: "import { h } from 'vue';",
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
      },
    },
  }
})
