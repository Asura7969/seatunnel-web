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

export default defineConfig({
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
