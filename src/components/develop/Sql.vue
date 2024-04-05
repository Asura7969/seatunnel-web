<template>
  <n-card :bordered="true" class="rd-8px shadow h-full">
    <n-space vertical>
      <n-space>
        <n-button tertiary type="success" @click="run">
          <template #icon>
            <n-icon>
              <Play16Filled />
            </n-icon>
          </template>
          运行
        </n-button>
        <n-button quaternary type="info" @click="formatSql"> 格式化 </n-button>
      </n-space>
      <n-space item-style="width: 100%">
        <Codemirror
          v-model:value="code"
          :options="cmOptions"
          border
          placeholder="test placeholder"
          :height="1000"
          @blur="onBlur"
          @inputRead="inputRead"
        />
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup>
import { Play16Filled } from "@vicons/fluent";

import Codemirror from "codemirror-editor-vue3";

// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/sql/sql.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/monokai.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/darcula.css";
import "codemirror/keymap/sublime.js";

// 引入代码自动提示插件
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/show-hint";

import { sql } from "@codemirror/lang-sql";
import * as sqlFormatter from "sql-formatter";
import { ref } from "vue";
import { useThemeStore } from "../../store/theme";

const themeStore = useThemeStore();

const cmOptions = reactive({
  mode: "text/x-sql", // Language mode
  theme: "juejin", // Theme  monokai
  tabSize: 4,
  styleActiveLine: true,
  keyMap: "sublime",
  matchBrackets: true,
  showCursorWhenSelecting: true,
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
  hintOptions: {
    completeSingle: false,
  },
  extraKeys: { tab: "autocomplete" },
  lineWrapping: true,
  foldGutter: true,
  autofocus: "true",
  indentWithTabs: "true",
});

watchEffect(() => {
  if (themeStore.isDarkTheme) {
    cmOptions.theme = "darcula";
  } else {
    cmOptions.theme = "idea";
  }
});

const code = ref(`
select * from t_user where 1=1;
`);
const extensions = ref([sql()]);
//代码格式化
const formatSql = () => {
  code.value = sqlFormatter.format(code.value);
};

const selectedContent = ref("");

const onBlur = (cm, event) => {
  selectedContent.value = cm.getSelection();
};

const inputRead = (cm, changeObj) => {
  cm.showHint();
};

const run = () => {
  console.log(selectedContent.value);
};
</script>

<style></style>
