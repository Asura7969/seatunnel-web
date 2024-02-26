<template>
  <n-config-provider :hljs="hljs">
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
      <n-space justify="end">
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :item-count="100"
          :default-page-size="20"
          :default-page="1"
          show-size-picker
          :page-sizes="[20, 50, 100]"
          @update:page="updatePage"
          @update:page-size="updatePageSize"
        />
      </n-space>
    </n-space>
    <!-- 新建任务 -->
    <AddTask ref="addTask" @update:show="activate" @reload="reload" />
    <!-- 任务详情 -->
    <n-modal v-model:show="showDetail">
      <n-card
        style="width: 850px; height: 500px"
        :title="taskName"
        embedded
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra></template>
        <n-scrollbar x-scrollable style="max-height: 400px">
          <n-code :code="taskJson" language="json" />
        </n-scrollbar>

        <template #footer></template>
      </n-card>
    </n-modal>
  </n-config-provider>
</template>

<script>
import { h, defineComponent } from "vue";
import { AppstoreAddOutlined } from "@vicons/antd";
import AddTask from "./AddTask.vue";
import { runningJobs, getTaskList, getTaskJsonById } from "../api/api";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

function tagType(row) {
  if (
    row.status == "CANCELING" ||
    row.status == "CANCELED" ||
    row.status == "FAILED"
  ) {
    return "error";
  } else if (
    row.status == "RUNNING" ||
    row.status == "DOING_SAVEPOINT" ||
    row.status == "SAVEPOINT_DONE" ||
    row.status == "FAILING"
  ) {
    return "success";
  } else if (
    row.status == "SCHEDULED" ||
    row.status == "CREATED" ||
    row.status == "INITIALIZING"
  ) {
    return undefined;
  } else {
    return "info";
  }
}

// https://github.com/apache/seatunnel/blob/2ad7d6523667fbe0e8054adfdd198a7535fe619e/seatunnel-engine/seatunnel-engine-core/src/main/java/org/apache/seatunnel/engine/core/job/JobStatus.java#L75
function actionDesc(row) {
  if (
    row.status == "SCHEDULED" ||
    row.status == "CREATED" ||
    row.status == "INITIALIZING"
  ) {
    return "启动";
  } else if (
    row.status == "RUNNING" ||
    row.status == "DOING_SAVEPOINT" ||
    row.status == "SAVEPOINT_DONE" ||
    row.status == "FAILING"
  ) {
    return "停止";
  } else if (
    row.status == "CANCELING" ||
    row.status == "CANCELED" ||
    row.status == "FAILED"
  ) {
    return "启动";
  } else {
    return "undefined";
  }
}

const createColumns = ({ play, showModal }) => {
  return [
    {
      title: "id",
      key: "id",
      resizable: true,
      minWidth: 200,
    },
    {
      title: "name",
      key: "name",
      resizable: true,
      minWidth: 200,
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            type: "info",
            quaternary: true,
            onClick: () => showModal(row),
          },
          { default: () => row.name }
        );
      },
    },
    {
      title: "status",
      key: "status",
      render(row) {
        return h(
          NTag,
          {
            type: tagType(row),
            bordered: false,
            size: "small",
          },
          { default: () => row.status }
        );
      },
    },
    {
      title: "createTime",
      key: "createTime",
      minWidth: 200,
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return [
          h(
            NButton,
            {
              strong: true,
              size: "small",
              type: "info",
              quaternary: true,
              onClick: () => play(row),
            },
            { default: () => actionDesc(row) }
          ),
          h(NDivider, { vertical: true }),
          h(
            NButton,
            {
              strong: true,
              size: "small",
              type: "info",
              quaternary: true,
              onClick: () => play(row),
            },
            { default: () => "详情" }
          ),
        ];
      },
    },
  ];
};

export default defineComponent({
  components: {
    AppstoreAddOutlined,
    AddTask,
  },
  setup() {
    let tableHeight = window.innerHeight - 240;
    const message = useMessage();
    const addTask = ref(false);
    const activate = (show) => {
      const { active } = addTask.value;
      addTask.value.active = show;
    };
    let data = reactive([]);
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(10);

    const updatePage = (pageNum) => {
      let count = typeof pageSize.value == "undefined" ? 20 : pageSize.value;
      console.log("ref page:", pageNum);
      console.log("ref pageSize:", count);
    };

    const updatePageSize = (pageCount) => {
      let num = typeof page.value == "undefined" ? 1 : page.value;

      console.log("ref page:", num);
      console.log("pageSize:", pageCount);
    };

    const taskList = () => {
      getTaskList()
        .then((res) => {
          console.log("请求任务数据");
          res.data.list.forEach((v, i) => {
            data.push({
              id: v.id,
              name: v.name,
              status: v.status,
              createTime: v.createTime,
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const taskJson = ref(`""`);

    onMounted(() => {
      getTaskList()
        .then((res) => {
          console.log("请求任务数据");
          res.data.list.forEach((v, i) => {
            data.push({
              id: v.id,
              name: v.name,
              status: v.status,
              createTime: v.createTime,
            });
          });
          total.value = res.total;
          page.value = res.page;
          pageSize.value = res.pageSize;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const reload = () => {
      console.log("reload方法");
      taskList();
    };

    const showDetail = ref(false);
    const taskName = ref("");

    return {
      data,
      columns: createColumns({
        play(row) {
          message.info(`Play ${row.name}`);
        },
        showModal(row) {
          showDetail.value = true;
          getTaskJsonById(row)
            .then((res) => {
              taskJson.value = JSON.stringify(res.data, null, 2);
              taskName.value = row.name;
            })
            .catch((error) => {
              console.error(error);
            });
        },
      }),
      pagination: false,
      activate,
      addTask,
      reload,
      tableHeight,
      page,
      pageSize,
      total,
      updatePage,
      updatePageSize,
      showDetail,
      hljs,
      taskJson,
      taskName,
    };
  },
});
</script>

<style scoped lang="scss"></style>
