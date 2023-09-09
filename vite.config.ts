import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { readFileSync } from 'fs'
import * as dotenv from 'dotenv'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  VantResolver,
  PrimeVueResolver
} from 'unplugin-vue-components/resolvers'
import VitePluginOss from '@xiangnanscu/vite-plugin-alioss'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import dotenvExpand from 'dotenv-expand'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

const { parsed: exposedEnvs } = dotenvExpand.expand({
  ...dotenv.config({
    override: false,
    path: '.env'
  }),
  ignoreProcessEnv: true
})

const envKeys = Object.fromEntries(
  Object.entries(exposedEnvs).map(([k, v]) => [
    `process.env.${k}`,
    `"${v.replaceAll(/"/g, '\\"')}"`
  ])
)
const env = process.env
const VITE_PROXY_PREFIX = process.env.VITE_PROXY_PREFIX || '/toXodel'
const VITE_PROXY_PREFIX_REGEX = new RegExp('^' + VITE_PROXY_PREFIX)
const VITE_APP_NAME = process.env.VITE_APP_NAME
const baseUrl = '/' // env.NODE_ENV == 'production' ? `https:${env.ALIOSS_URL}${VITE_APP_NAME}/` : '/'

const plugins = [
  Components({
    dts: './src/unplugin/components.d.ts',
    dirs: ['./src/components', './src/localComponents'],
    extensions: ['vue'],
    directoryAsNamespace: true,
    resolvers: [
      AntDesignVueResolver(),
      VantResolver(),
      // https://primevue.org/theming/#builtinthemes
      PrimeVueResolver({ importTheme: 'bootstrap4-light-blue', importIcons: true })
    ]
  }),
  VueRouter({
    routesFolder: ['./src/views'],
    extensions: ['.vue'],
    exclude: [],
    dts: './src/unplugin/typed-router.d.ts',
    getRouteName: (arg) => arg.value.rawSegment, // AsFileName
    routeBlockLang: 'json5',
    importMode: process.env.NODE_ENV === 'production' ? 'sync' : 'async'
  }),
  vue(),
  vueJsx({}),
  AutoImport({
    dts: './src/unplugin/auto-imports.d.ts',
    eslintrc: {
      enabled: true,
      filepath: './src/unplugin/.eslintrc-auto-import.json',
      globalsPropValue: true
    },
    imports: [
      'vue',
      'pinia',
      VueRouterAutoImports,
      { 'vue-router/auto': ['useLink'] },
      '@vueuse/core'
    ],
    vueTemplate: true,
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/ // .vue
    ],
    dirs: [
      './src/components', // only root modules
      './src/composables', // only root modules
      './src/globals',
      './src/store/**' // all nested modules
    ]
  }),
  // https://docs.sheetjs.com/docs/demos/static/vitejs
  {
    // this plugin handles ?b64 tags
    name: 'vite-b64-plugin',
    transform(code, id) {
      if (!id.match(/\?b64$/)) return
      // console.log(id, code);
      const path = id.replace(/\?b64/, '')
      const data = readFileSync(path, 'base64')
      return `export default '${data}'`
    }
  },
  {
    // https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
    name: 'vite-office-plugin',
    transform(code, id) {
      if (!id.match(/\.(xlsx|docx|zip)$/)) return
      const path = id
      const data = readFileSync(path, 'base64')
      return `export default Uint8Array.from(atob('${data}'), (c) => c.charCodeAt(0))`
    }
  }
  // ViteRequireContext()
]

export default defineConfig({
  build: {
    // minify: true
  },
  assetsInclude: ['**/*.xlsx', '**/*.docx'],
  base: baseUrl,
  define: envKeys,
  plugins,
  optimizeDeps: {
    include: ['vue']
  },
  resolve: {
    alias: {
      '@/': fileURLToPath(new URL('./src', import.meta.url)) + '/',
      stream: 'stream-browserify'
      // vm: "vm-browserify",
      // Buffer: "buffer/",
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: Number(env.VITE_APP_PORT) || 5173,
    strictPort: false
    // proxy: {
    //   [VITE_PROXY_PREFIX]: {
    //     target: `http://${env.NGINX_server_name}:${env.NGINX_listen}`,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(VITE_PROXY_PREFIX_REGEX, '')
    //   }
    // }
  }
})
