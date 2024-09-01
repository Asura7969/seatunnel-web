import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import { presetUno, presetAttributify, presetIcons } from "unocss";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import svgLoader from "vite-svg-loader";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from 'path';

const pathResolve = (dir) => resolve(__dirname, dir);
export default defineConfig({
  resolve: {
    // 这里的alias是路径别名，是运行阶段的替换路径，而tsconfig.json中的paths是编码阶段的提示，
    alias: {
      '@': pathResolve('src'), // path.resolve中，'./src' 等于 'src'
      '@antv/x6': '@antv/x6/lib',
      '@antv/x6-vue-shape': '@antv/x6-vue-shape/lib',
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => [""].includes(tag),
        },
      },
    }),
    UnoCSS({
      // 使用Unocss
      presets: [presetUno(), presetAttributify(), presetIcons()],
    }),
    VueSetupExtend(),
    viteMockServe({
      mockPath: "./src/mock",
      localEnabled: true,
    }),
    svgLoader(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
            "NMenu",
            "NIcon",
            "NButton",
            "NInput",
            "NDivider",
            "NTag",
          ],
        },
        // {
        //   '@vicons/ionicons5': ['CashOutline']
        // }
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
});
