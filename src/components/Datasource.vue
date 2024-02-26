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
      :max-height="tableHeight"
      :min-height="tableHeight"
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
import { getDatasource } from "../api/api";

function tagType(row) {
  if (row.type == "MYSQL") {
    return "warning";
  } else if (row.type == "DORIS") {
    return "success";
  } else if (row.type == "STARROCKS") {
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
      width: 100,
      maxWidth: 100,
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
      width: 300,
      maxWidth: 600,
    },
    {
      title: "数据库",
      key: "database",
      resizable: true,
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
    // {
    //   title: "操作",
    //   key: "actions",
    //   render(row) {
    //     return h(
    //       NButton,
    //       {
    //         strong: true,
    //         size: "small",
    //         type: "info",
    //         quaternary: true,
    //         onClick: () => play(row),
    //       },
    //       { default: () => "编辑" }
    //     );
    //   },
    // },
  ];
};

export default defineComponent({
  components: {
    AppstoreAddOutlined,
    AddDatasource,
  },
  setup() {
    let tableHeight = window.innerHeight - 240;
    const message = useMessage();
    const addSource = ref(false);
    const activate = (show) => {
      const { active } = addSource.value;
      addSource.value.active = show;
    };

    const data = reactive([]);

    onBeforeMount(() => {
      getDatasource()
        .then((res) => {
          res.data.forEach((v, i) => {
            data.push({
              no: v.id,
              title: v.name,
              address: v.address,
              type: v.type,
              database: v.database,
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

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
      tableHeight,
    };
  },
});
</script>
