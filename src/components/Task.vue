<template>
  <n-config-provider :hljs="hljs">
    <n-space vertical :size="12">
      <n-space justify="end">
        <n-button ghost color="#900C3F" style="margin: auto" @click="reload">
          <template #icon>
            <n-icon>
              <ReloadOutlined />
            </n-icon>
          </template>
          刷新
        </n-button>
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
        <n-button
          ghost
          color="#339BFF"
          style="margin: auto"
          @click="editTask()"
        >
          <template #icon>
            <n-icon>
              <EditTwotone />
            </n-icon>
          </template>
          编辑
        </n-button>
      </n-space>
      <n-data-table
        v-if="tableShow"
        remote
        v-model:checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="selectRow"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :bordered="true"
        :max-height="tableHeight"
        :min-height="tableHeight"
        :loading="loading"
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
import { h, defineComponent, ref, reactive, onMounted, nextTick } from "vue";
import { AppstoreAddOutlined, EditTwotone, ReloadOutlined } from "@vicons/antd";
import AddTask from "./AddTask.vue";
import { getTaskList, getTaskJsonById, deployTask, stopTask } from "../api/api";
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
    row.status == "UNKNOWABLE" ||
    row.status == "FINISHED"
  ) {
    return "部署";
  } else if (
    row.status == "RUNNING" ||
    row.status == "DOING_SAVEPOINT" ||
    row.status == "FAILING" ||
    row.status == "CANCELING" ||
    row.status == "INITIALIZING"
  ) {
    return "停止";
  } else if (
    row.status == "CANCELED" ||
    row.status == "FAILED" ||
    row.status == "SAVEPOINT_DONE"
  ) {
    return "部署";
  } else {
    return "undefined";
  }
}

const createColumns = ({ deployOrStop, showModal }) => {
  return [
    {
      type: "selection",
      multiple: false,
      // disabled(row) {
      //   return row.status === "RUNNING";
      // },
    },
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
              loading: row.loading,
              onClick: () => deployOrStop(row),
            },
            { default: () => actionDesc(row) }
          ),
          // h(NDivider, { vertical: true }),
          // h(
          //   NButton,
          //   {
          //     strong: true,
          //     size: "small",
          //     type: "info",
          //     quaternary: true,
          //     onClick: () => play(row),
          //   },
          //   { default: () => "详情" }
          // ),
        ];
      },
    },
  ];
};

export default defineComponent({
  components: {
    AppstoreAddOutlined,
    EditTwotone,
    AddTask,
    ReloadOutlined,
  },
  setup() {
    const loading = ref(true);
    const tableShow = ref(true);
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

    const taskJson = ref(`""`);

    onMounted(() => {
      getTaskList(1, 20)
        .then((res) => {
          loading.value = true;
          res.data.list.forEach((v, i) => {
            data.push({
              id: v.id,
              name: v.name,
              status: v.status,
              createTime: v.createTime,
              key: v.id,
              loading: false,
            });
          });
          total.value = res.total;
          page.value = res.page;
          pageSize.value = res.pageSize;
          loading.value = false;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const reload = () => {
      loading.value = true;
      nextTick(() => {
        getTaskList(page.value, pageSize.value)
          .then((res) => {
            if (res.code == 200) {
              data.length = 0;
              res.data.list.forEach((v, i) => {
                data.push({
                  id: v.id,
                  name: v.name,
                  status: v.status,
                  createTime: v.createTime,
                  key: v.id,
                  loading: false,
                });
              });
            }
            loading.value = false;
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };

    const showDetail = ref(false);
    const taskName = ref("");
    const checkedRowKeysRef = ref([]);

    const selectRow = (keys, rows) => {
      checkedRowKeysRef.value = [rows[0].id];
    };

    const editTask = () => {
      if (checkedRowKeysRef.value.length === 0) {
        message.warning("请选择任务");
      } else {
        console.log("开始编辑", checkedRowKeysRef.value[0]);
        activate(true);
        addTask.value.queryTaskId(checkedRowKeysRef.value[0]);
      }
    };

    return {
      tableShow,
      checkedRowKeys: checkedRowKeysRef,
      selectRow,
      editTask,
      data,
      columns: createColumns({
        deployOrStop(row) {
          row.loading = true;
          if (row.status == "RUNNING") {
            stopTask(row.id)
              .then((res) => {
                if (res.code == 200) {
                  message.success("停止成功");
                } else {
                  message.warning("停止失败");
                  console.log(res);
                }
                row.loading = false;
                row.status = "FINISHED";
              })
              .catch((error) => {
                console.error(error);
                message.error("停止失败");
              });
          } else {
            deployTask(row.id)
              .then((res) => {
                if (res.code == 200) {
                  message.success("部署成功");
                } else {
                  message.error("部署失败");
                  console.log(res);
                }
                row.loading = false;
                row.status = "RUNNING";
              })
              .catch((error) => {
                console.error(error);
                message.error("部署失败");
              });
          }
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
      showDetail,
      hljs,
      taskJson,
      taskName,
      loading,
      updatePage(pageNum) {
        let count = typeof pageSize.value == "undefined" ? 20 : pageSize.value;
        loading.value = true;
        getTaskList(pageNum, count)
          .then((res) => {
            data.length = 0;
            console.log(res);
            res.data.list.forEach((v, i) => {
              data.push({
                id: v.id,
                name: v.name,
                status: v.status,
                createTime: v.createTime,
                key: v.id,
                loading: false,
              });
            });
            loading.value = false;
          })
          .catch((error) => {
            console.error(error);
          });
      },
    };
  },
});
</script>

<style scoped lang="scss"></style>
