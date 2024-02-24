<template>
  <n-config-provider :theme="theme" :theme-overrides="{ common: { fontWeightStrong: '450' } }">
      <n-layout position="absolute" style="width: 100%; height: 100%">
        <n-layout-header 
            bordered
            style="width: 100%; height: 65px"
        >
          <n-space class="logo" :size="20" align="center" style="line-height: 1">
            <n-image
              height="60"
              width="60"
              src="https://seatunnel.apache.org/image/logo.png"
            />
            <n-gradient-text
              gradient="linear-gradient(130deg,#24c6dc,#5433ff 41.07%,#f09 76.05%)"
            >
              <h3>Seathnnel</h3>
            </n-gradient-text>
          </n-space>
          <n-space class="tip" :size="20" align="center" style="line-height: 1">
            <n-popover trigger="hover">
              <template #trigger>
                <n-button :bordered="false" :render-icon="themeIcon" @click="clickTheme">
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
              :inverted="false"
              key-field="key"
              label-field="label"
              children-field="children"
            />
          </n-layout-sider>
          <n-layout-content content-style="padding: 24px;" :native-scrollbar="false">
            <n-message-provider>
              <router-view></router-view>
            </n-message-provider>
          </n-layout-content>
        </n-layout>
      </n-layout>
  </n-config-provider>
 </template>


<script>
import { FullscreenOutlined } from '@vicons/antd';
import { WeatherMoon20Filled } from '@vicons/fluent';
import { Sun } from '@vicons/tabler';
import { darkTheme } from 'naive-ui';
import screenfull from 'screenfull';
import { defineComponent, h, ref } from "vue";
import { RouterLink, useRoute } from 'vue-router';
import { routes } from './router';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const currentKey = ''

const menuOptions = routes.map((c) => {
  return {
    label: () => h(
      RouterLink,
      {
        to: {
          name: c.name,
        }
      },
      { default: () => c.name }
    ),
    key: c.name,
    icon: renderIcon(c.icon)
  }
})

export default defineComponent({
  components: {
    Sun,
    WeatherMoon20Filled,
    FullscreenOutlined,
  },
  setup() {
    const containerRef = ref(void 0);
    const theme = ref(null);
    const expandedKeys = [];

    const isDarkTheme = () => {
      return theme.value !== null && theme.value.name === 'dark';
    };

    const themeIcon = () => {
      let v_node = isDarkTheme() ? Sun : WeatherMoon20Filled;
      return h(NIcon, null, {
        default: () => h(v_node)
      });
    };

    const clickTheme = () => {
      if (isDarkTheme()) {
        theme.value = null;
      } else {
        theme.value = darkTheme;
      }
    };

    const screenFull = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle()
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
    };
  },
  methods: {
    update(key, item) {
      console.log(11111)
      
    }
  }
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
  ::v-deep(.n-layout-toggle-button){
    top: 20%
  }
}
</style>
