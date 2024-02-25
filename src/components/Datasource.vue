<template>
  <n-space vertical :size="12">
    <n-space justify="end">
      <n-button-group>
        <n-button
          ghost
          color="#8a2be2"
          style="margin: auto"
          @click="activate(true)"
        >
          <template #icon>
            <n-icon>
              <AppstoreAddOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
      </n-button-group>
    </n-space>
    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :bordered="true"
      :max-height="250"
      size="small"
    />
  </n-space>
  <!-- 新增数据源 -->
  <AddDatasource ref="addSource" @update:show="activate" />
</template>

<script>
import { h, defineComponent } from "vue";
import AddDatasource from "./AddDatasource.vue";
import { AppstoreAddOutlined } from "@vicons/antd";

function tagType(row) {
  if (row.type == "mysql") {
    return "warning";
  } else if (row.type == "doris") {
    return "success";
  } else if (row.type == "starrocks") {
    return undefined;
  } else {
    return "info";
  }
}

const createColumns = ({ play }) => {
  return [
    {
      title: "序号",
      key: "no",
    },
    {
      title: "名称",
      key: "title",
      resizable: true,
    },
    {
      title: "地址",
      key: "address",
      resizable: true,
      width: 600,
      maxWidth: 1000,
    },
    {
      title: "类型",
      key: "type",
      render(row) {
        return h(
          NTag,
          {
            type: tagType(row),
            bordered: false,
          },
          { default: () => row.type }
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            type: "info",
            quaternary: true,
            onClick: () => play(row),
          },
          { default: () => "编辑" }
        );
      },
    },
  ];
};

const data = [
  { no: 1, title: "sim", address: "127.0.0.1:3306", type: "mysql" },
  { no: 2, title: "数仓Doris", address: "127.0.0.1:15433", type: "doris" },
  { no: 3, title: "mes", address: "127.0.0.1:8030", type: "postgres" },
  {
    no: 4,
    title: "数仓StarRocks",
    address: "127.0.0.1:8031",
    type: "starrocks",
  },
];

export default defineComponent({
  components: {
    AppstoreAddOutlined,
    AddDatasource,
  },
  setup() {
    const message = useMessage();
    const addSource = ref(false);
    const activate = (show) => {
      const { active } = addSource.value;
      addSource.value.active = show;
    };
    return {
      data,
      columns: createColumns({
        play(row) {
          message.info(`Play ${row.title}`);
        },
      }),
      pagination: false,
      activate,
      addSource,
    };
  },
});
</script>
