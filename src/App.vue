<template>
  <n-space vertical size="large" style="width: 100%; height: 100%" item-style="width: 100%; height: 100%">
    <n-layout position="absolute" style="width: 100%; height: 100%">
      <n-layout-header 
          position="static"
          bordered
          style="width: 100%; height: 65px"
        >
          <n-flex>
            <n-image
            height="60"
            width="60"
              src="	https://seatunnel.apache.org/image/logo.png"
            />
            <n-gradient-text
              gradient="linear-gradient(130deg,#24c6dc,#5433ff 41.07%,#f09 76.05%)"
            >
            <h2>Seathnnel</h2>
            </n-gradient-text>
          </n-flex>
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
 </template>


<script>
// import Layout from './components/Layout.vue'
import { defineComponent, h, ref } from "vue";

import { RouterLink, useRoute } from 'vue-router'
import { routes } from './router'

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
          state: { c }
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
  },
  setup() {
    const containerRef = ref(void 0);
    const expandedKeys = []
    return {
      collapsed: ref(false),
      route: useRoute(),
      menuOptions,
      containerRef

    };
  },
  methods: {
    update(key, item) {
      console.log(11111)
      
    }
  }
});
</script>


<style scoped>
.n-image {
  display: block;
  padding-left: 20px;
}
</style>
