import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => [''].includes(tag),
        }
      }
    }),
    svgLoader(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            'NMenu',
            'NIcon',
            'NButton',
            'NTag'
          ]
        },
        // {
        //   '@vicons/ionicons5': ['CashOutline']
        // }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
})
