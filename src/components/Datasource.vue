<template>
  <n-space vertical :size="12">
    <n-card :bordered="true" class="rd-8px shadow">
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
    </n-card>

    <n-card :bordered="true" class="rd-8px shadow">
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :bordered="true"
        :max-height="tableHeight"
        :min-height="tableHeight"
        :loading="loading"
        size="small"
        remote
      />
    </n-card>
  </n-space>
  <!-- 新增数据源 -->
  <AddDatasource ref="addSource" @update:show="activate" @reload="reload" />
</template>

<script setup>
import { h, defineComponent, onMounted, nextTick } from "vue";
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
      key: "id",
      width: 100,
      maxWidth: 100,
    },
    {
      title: "名称",
      key: "name",
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
    {
      title: "创建人",
      key: "creator",
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

const loading = ref(true);
let tableHeight = window.innerHeight - 290;
const message = useMessage();
const addSource = ref(null);
const activate = (show) => {
  addSource.value.active = show;
};

const data = reactive([]);

const reload = () => {
  loading.value = true;
  nextTick(() => {
    getDatasource()
      .then((res) => {
        loading.value = true;
        data.length = 0;
        Object.assign(data, res.data);
        loading.value = false;
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

onMounted(() => {
  getDatasource()
    .then((res) => {
      loading.value = true;
      Object.assign(data, res.data);
      loading.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
});

const columns = createColumns({
  play(row) {
    message.info(`Play ${row.title}`);
  },
});

const pagination = ref(false);
</script>
