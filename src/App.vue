<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="{ common: { fontWeightStrong: '450' } }"
  >
    <n-layout position="absolute" style="width: 100%; height: 100%">
      <n-layout-header bordered style="width: 100%; height: 65px">
        <n-space class="logo" :size="20" align="center" style="line-height: 1">
          <n-image
            height="60"
            width="60"
            src="https://seatunnel.apache.org/image/logo.png"
          />
          <n-gradient-text
            gradient="linear-gradient(130deg,#24c6dc,#5433ff 41.07%,#f09 76.05%)"
          >
            <h2>SeaTunnel</h2>
          </n-gradient-text>
        </n-space>
        <n-space :size="20" align="center" style="line-height: 1">
          <n-menu
            v-model:value="headActiveKey"
            mode="horizontal"
            :options="headMenuOptions"
            responsive
          />
        </n-space>
        <n-space class="tip" :size="20" align="center" style="line-height: 1">
          <n-popover trigger="hover">
            <template #trigger>
              <n-button
                :bordered="false"
                :render-icon="themeIcon"
                @click="clickTheme"
              >
              </n-button>
            </template>
            <span>主题</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="20" @click="screenFull">
                <FullscreenOutlined />
              </n-icon>
            </template>
            <span>全屏</span>
          </n-popover>
        </n-space>
      </n-layout-header>

      <n-layout has-sider style="width: 100%; height: calc(100vh - 65px)">
        <n-layout-sider
          collapse-mode="width"
          :collapsed-width="60"
          show-trigger="arrow-circle"
          content-style="padding: 0px;"
          bordered
          @collapse="collapsed = true"
          @expand="collapsed = false"
          :collapsed="collapsed"
          :native-scrollbar="false"
        >
          <n-menu
            value=""
            :collapsed="collapsed"
            :collapsed-width="60"
            :collapsed-icon-size="22"
            :options="menuOptions"
            key-field="key"
            label-field="label"
            children-field="children"
          />
        </n-layout-sider>
        <n-layout-content :content-style="bgStyle" :native-scrollbar="false">
          <n-message-provider>
            <router-view></router-view>
          </n-message-provider>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script>
import { FullscreenOutlined } from "@vicons/antd";
import { WeatherMoon20Filled } from "@vicons/fluent";
import { Sun } from "@vicons/tabler";
import { darkTheme, lightTheme } from "naive-ui";
import screenfull from "screenfull";
import { defineComponent, h, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { routes } from "./router";
import { useThemeStore } from "./store/theme";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const headMenuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "dashboard",
          },
        },
        { default: () => "数据集成" }
      ),
    key: "integration",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "develop",
          },
        },
        { default: () => "数据开发" }
      ),
    key: "development",
  },
  {
    label: "服务",
    key: "service",
  },
];

export default defineComponent({
  components: {
    Sun,
    WeatherMoon20Filled,
    FullscreenOutlined,
  },
  setup() {
    const containerRef = ref(void 0);
    const expandedKeys = [];
    const headActiveKey = ref("integration");
    const themeStore = useThemeStore();
    const theme = ref(lightTheme);

    // height: 100%; padding: 24px; background-color: #F6F5F5;
    const bgStyle = ref(null);

    const themeIcon = () => {
      let v_node = themeStore.isDarkTheme ? Sun : WeatherMoon20Filled;
      return h(NIcon, null, {
        default: () => h(v_node),
      });
    };

    const menuOptions = ref(
      routes.map((c) => {
        return {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: c.name,
                },
              },
              { default: () => c.name }
            ),
          key: c.name,
          icon: renderIcon(c.icon),
        };
      })
    );

    function selectedMenu(key) {
      menuOptions.value = routes
        .filter((c) => c.lable == key)
        .map((c) => {
          return {
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    name: c.name,
                  },
                },
                { default: () => c.name }
              ),
            key: c.name,
            icon: renderIcon(c.icon),
          };
        });
    }

    watchEffect(() => {
      if (themeStore.isDarkTheme) {
        bgStyle.value = "height: 100%; padding: 15px;";
        theme.value = darkTheme;
      } else {
        bgStyle.value =
          "height: 100%; padding: 15px; background-color: #F6F5F5;";
        theme.value = lightTheme;
      }
      if (headActiveKey.value) {
        selectedMenu(headActiveKey.value);
      }
    });

    onMounted(() => {
      bgStyle.value = "height: 100%; padding: 15px; background-color: #F6F5F5;";
    });

    const clickTheme = () => {
      if (themeStore.isDarkTheme) {
        themeStore.update("light");
      } else {
        themeStore.update("dark");
      }
    };

    const screenFull = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle();
      }
    };

    return {
      collapsed: ref(false),
      route: useRoute(),
      menuOptions,
      containerRef,
      theme,
      themeIcon,
      clickTheme,
      screenFull,
      bgStyle,
      headActiveKey,
      headMenuOptions,
    };
  },
  methods: {
    update(key, item) {
      console.log(11111);
    },
  },
});
</script>

<style scoped lang="scss">
.n-layout-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 9px 18px;
}

.logo {
  margin-right: auto;
}

.tip {
  margin-left: auto;
}

.n-layout-sider {
  ::v-deep(.n-layout-toggle-button) {
    top: 20%;
  }
}
.n-scrollbar-container .n-scrollbar-content {
  background-color: rgb(227, 242, 249);
}
</style>
