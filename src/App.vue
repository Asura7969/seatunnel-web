<template>
  <n-config-provider :theme="theme" :theme-overrides="{ common: { fontWeightStrong: '450' } }">
    <n-space vertical size="large" style="width: 100%; height: 100%" item-style="width: 100%; height: 100%">
      <n-layout position="absolute" style="width: 100%; height: 100%">
        <n-layout-header 
            position="static"
            bordered
            style="width: 100%; height: 65px"
          >
            <n-grid x-gap="12" :cols="6">
              <n-grid-item :offset="0" style="align-items: center; display: flex; height: 65px">
                <n-flex>
                  <n-image
                    height="60"
                    width="60"
                      src="	https://seatunnel.apache.org/image/logo.png"
                    />
                  <n-gradient-text
                    gradient="linear-gradient(130deg,#24c6dc,#5433ff 41.07%,#f09 76.05%)"
                  >
                    <h3>Seathnnel</h3>
                  </n-gradient-text>
                </n-flex>
              </n-grid-item>
              <n-grid-item :offset="4" style="align-items: center; display: flex;">
                <n-flex justify="end">
                  <n-button :bordered="false" :render-icon="themeIcon" @click="clickTheme" style="margin-left: 100px;">
                    主题
                  </n-button>
                </n-flex>
              </n-grid-item>
            </n-grid>
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
            <!-- key-field="key"
              label-field="label"
              children-field="children" -->
          </n-layout-sider>
          <n-layout-content content-style="padding: 24px;" :native-scrollbar="false">
            <n-message-provider>
              <router-view></router-view>
            </n-message-provider>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-space>
  </n-config-provider>
 </template>


<script>
// import Layout from './components/Layout.vue'
import { defineComponent, h, ref, toRef } from "vue";
import { darkTheme } from 'naive-ui'
import { RouterLink, useRoute } from 'vue-router'
import { routes } from './router'
import { Sun } from '@vicons/tabler'
import { WeatherMoon20Filled } from '@vicons/fluent'

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
  },
  setup() {
    const containerRef = ref(void 0);
    const theme = ref(darkTheme);
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

    return {
      collapsed: ref(false),
      route: useRoute(),
      menuOptions,
      containerRef,
      theme,
      themeIcon,
      clickTheme
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
.n-image {
  padding-left: 20px;
}

.n-layout-sider {
  ::v-deep(.n-layout-toggle-button){
    top: 10%
  }
}
</style>
