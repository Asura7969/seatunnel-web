<template>
  <n-card :bordered="true" class="rd-8px shadow h-full">
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 24px;">
        <n-tree
          block-line
          :default-expanded-keys="defaultExpandedKeys"
          :default-expand-all="true"
          :data="data"
          :node-props="nodeProps"
          :on-update:expanded-keys="updatePrefixWithExpaned"
          :render-label="nodelabel"
          show-irrelevant-nodes
        />
        <n-dropdown
          trigger="manual"
          placement="bottom-start"
          :show="showDropdown"
          :options="optionsRef"
          :x="xRef"
          :y="yRef"
          @select="handleSelect"
          @clickoutside="handleClickoutside"
        />
      </n-layout-sider>
      <n-layout>
        <!-- <n-layout-header>颐和园路</n-layout-header> -->
        <n-layout-content content-style="padding: 24px;">
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
              <n-button quaternary type="info" @click="formatSql">
                格式化
              </n-button>
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
        </n-layout-content>
        <!-- <n-layout-footer>成府路</n-layout-footer> -->
      </n-layout>
    </n-layout>
  </n-card>
</template>

<script setup>
import { defineComponent, h, onMounted } from "vue";
import { useMessage, NIcon } from "naive-ui";
import { getFileTree } from "../../api/api";
import {
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline,
} from "@vicons/ionicons5";
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

const key = ref();
const inputRef = ref();
const nodelabel = ({ option }) => {
  //  console.log(option.key)
  return h(
    "div",
    { class: "node" },
    option.isedit == true
      ? h(NInput, {
          autofocus: true,
          ref: inputRef,
          size: "small",
          value: option.label,
          onUpdateValue: (v) => {
            option.label = v;
          },
          onChange: () => {
            option.isedit = false;
          },
          onBlur: () => {
            option.isedit = false;
          },
        })
      : option.label
  );
};

// const nodesuffix = ({ option }) => {
//   if (
//     !option.children &&
//     option.key == key.value
//   ) {
//     return h(
//       NButton,
//       {
//         text: true,
//         type: 'info',
//         color: '#00EAFF',
//         size: 'tiny',
//         onClick: e => {
//           deltree(option.id), e.stopPropagation()//自定义节点删除函数
//         }
//       },
//       { default: () => '删除' }
//     )
//   } else if (option.children) {
//     return h(
//       NButton,
//       {
//         type: 'info',
//         color: '#007293',
//         bordered: true,
//         round: true,
//         size: 'tiny',
//         textcolor: '#CFFBFF',
//         onClick: e => addnode(e, option.key)//自定义新增节点函数
//       },
//       { default: () => '+新增' }
//     )
//   }
// }

function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() + S4() + "" + S4() + "" + S4() + "" + S4() + "" + S4() + S4() + S4()
  );
}

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

const message = useMessage();
const updatePrefixWithExpaned = (_keys, _option, meta) => {
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline),
        });
      break;
    case "collapse":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder),
        });
      break;
  }
};
const defaultExpandedKeys = ref([]);
const showDropdown = ref(false);
const optionsRef = ref([]);
const xRef = ref(0);
const yRef = ref(0);
const operationNodeRef = ref();

const nodeProps = ({ option }) => {
  return {
    onClick() {
      if (!option.children && !option.disabled) {
        message.info("[Click] " + option.label);
      }
    },
    ondblclick() {
      //双击事件
      option.isedit = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    },
    onContextmenu(e) {
      if (option.type === "d") {
        optionsRef.value = [
          {
            label: "删除",
            key: "delete",
            id: option.id,
          },
          {
            label: "新建文件夹",
            key: "newD",
            id: option.id,
          },
          {
            label: "新建文件",
            key: "newF",
            id: option.id,
          },
        ];
      } else if (option.type === "f") {
        optionsRef.value = [
          {
            label: "删除",
            key: "delete",
            id: option.id,
          },
        ];
      }
      // optionsRef.value = [option];
      showDropdown.value = true;
      // console.log(e);
      operationNodeRef.value = option;
      xRef.value = e.clientX;
      yRef.value = e.clientY;
      console.log(e.clientX, e.clientY);
      e.preventDefault();
    },
  };
};

const handleClickoutside = () => {
  showDropdown.value = false;
};

const addFilePrefix = (nodeArray) => {
  nodeArray.forEach((node) => {
    if (node.type === "d") {
      node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder),
        });
    } else {
      node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FileTrayFullOutline),
        });
    }
    if (node.children) {
      addFilePrefix(node.children);
      // node.children.forEach((n) => addFilePrefix(n));
    }
  });
};

var data = ref();
onMounted(() => {
  getFileTree()
    .then((res) => {
      const dataArray = res.data;
      addFilePrefix(dataArray);
      data.value = dataArray;
      console.log(data.value, "初始化树节点");
    })
    .catch((error) => {
      console.error(error);
    });
});

const CURRENT = "CURRENT";
const PARENT = "PARENT";

const handleSelect = (key, option) => {
  showDropdown.value = false;
  if (key === "newF") {
    addNode(option.key, "F");
  } else if (key === "newD") {
    addNode(option.key, "D");
  } else if (key === "delete") {
    // deleteNode(option.id);
    console.log(operationNodeRef.value);
  }
  // console.log(data, option.key);
};

// TODO: parentNode 可能为空, 为null的话则为根目录

const findNode = (arr, id, parentNode, returnNode) => {
  for (const v of arr) {
    // console.log(i, v);
    if (v.key === id) {
      if (returnNode === CURRENT) {
        return v;
      } else {
        return parentNode;
      }
    } else if (v.children) {
      return findNode(v.children, id, v, returnNode);
    }
  }
};

const addNode = (id, type) => {
  // const srcData = toRaw(data);
  const srcData = data.value;
  const node = findNode(srcData, id, null, CURRENT);
  if (type === "F") {
    console.log("新建文件");
    // 创建文件
    node.children.push({
      label: "new_create_file.txt",
      key: uuid(),
      type: "f",
      prefix: () =>
        h(NIcon, null, {
          default: () => h(FileTrayFullOutline),
        }),
    });
  } else {
    console.log("新建文件夹");
    // 创建文件夹
    node.children.push({
      key: uuid(),
      label: "新建文件夹",
      type: "d",
      prefix: () =>
        h(NIcon, null, {
          default: () => h(Folder),
        }),
    });
  }

  data = ref(srcData);
  console.log(data);
};

const deleteNode = (id) => {
  const srcData = data.value;
  const node = findNode(srcData, id, null, PARENT);
  node.children = node.children.filter((n) => n.key !== key);
  // let deleteNode = data.pop();
  // console.log(deleteNode);
  // data.forEach((node) => {
  //   if (node.id === id) {
  //   } else {
  //     deleteNode(tmpData.children, id);
  //   }
  // });
  data = ref(srcData);
  console.log(data);
};

// console.log(data);

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
