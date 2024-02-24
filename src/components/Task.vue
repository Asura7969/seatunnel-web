<template>
  <n-space vertical :size="12">
    <n-space justify="end">
      <n-button-group>
        <n-button 
          ghost 
          color="#8a2be2" style="margin: auto;"
          @click="activate(true)"
        >
          <template #icon>
            <n-icon>
              <AppstoreAddOutlined/>
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
  <!-- 新建任务 -->
  <AddTask ref="addTask" @update:show="activate"/>
</template>

<script>
import { h, defineComponent } from "vue";
import { AppstoreAddOutlined } from "@vicons/antd";
import AddTask from "./AddTask.vue"
import { runningJobs } from '../api/api'

function tagType(row) {
  if (row.jobStatus == 'CANCELING' 
    || row.jobStatus == 'CANCELED' 
    || row.jobStatus == 'FAILED') {
    return "error"
  } else if (row.jobStatus == 'RUNNING' 
    || row.jobStatus == 'DOING_SAVEPOINT' 
    || row.jobStatus == 'SAVEPOINT_DONE'
    || row.jobStatus == 'FAILING') {
    return "success"
  } else if (row.jobStatus == 'SCHEDULED' 
    || row.jobStatus == 'CREATED' 
    || row.jobStatus == 'INITIALIZING') {
    return undefined
  } else {
    return "info"
  };
}

// https://github.com/apache/seatunnel/blob/2ad7d6523667fbe0e8054adfdd198a7535fe619e/seatunnel-engine/seatunnel-engine-core/src/main/java/org/apache/seatunnel/engine/core/job/JobStatus.java#L75
function actionDesc(row) {
  if (row.jobStatus == 'SCHEDULED' 
    || row.jobStatus == 'CREATED' 
    || row.jobStatus == 'INITIALIZING') {
    return "启动"
  } else if (row.jobStatus == 'RUNNING' 
    || row.jobStatus == 'DOING_SAVEPOINT' 
    || row.jobStatus == 'SAVEPOINT_DONE'
    || row.jobStatus == 'FAILING') {
    return "停止"
  } else if (row.jobStatus == 'CANCELING' 
    || row.jobStatus == 'CANCELED' 
    || row.jobStatus == 'FAILED') {
    return '启动'
  } else {
    return "undefined"
  };
}

const createColumns = ({
  play
}) => {
  return [
    {
      title: "jobId",
      key: "jobId",
      resizable: true,
      minWidth: 200,
    },
    {
      title: "jobName",
      key: "jobName",
      resizable: true,
      minWidth: 200,
    },
    {
      title: "jobStatus",
      key: "jobStatus",
      render(row) {
        return h(
          NTag,
          {
            type: tagType(row),
            bordered: false,
            size: "small"
          },
          { default: () => row.jobStatus }
        );
      }
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
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            type: "info",
            quaternary: true,
            onClick: () => play(row)
          },
          { default: () => actionDesc(row) }
        );
      }
    }
  ];
};

const data = [
  { jobId: 1, jobName: "mysql_cdc_to_ds", jobStatus: "CANCELED", createTime: "2024-02-01" },
  { jobId: 2, jobName: "pg_cdc_to_ds", jobStatus: "RUNNING", createTime: "2023-02-01" },
  { jobId: 3, jobName: "mysql_cdc_to_ds", jobStatus: "CANCELED", createTime: "2024-02-01" },
  { jobId: 4, jobName: "mysql_cdc_to_ds", jobStatus: "RUNNING", createTime: "2024-02-01" }
];

export default defineComponent({
  components: {
    AppstoreAddOutlined,
    AddTask,
  },
  setup() {
    const message = useMessage();
    const addTask = ref(false)
    const activate = (show) => {
        const { active } = addTask.value
        addTask.value.active = show;
		}
    runningJobs().then(res => {
      // console.log(res.data)
    })
    return {
      data,
      columns: createColumns({
        play(row) {
          message.info(`Play ${row.title}`);
        }
      }),
      pagination: false,
      activate,
      addTask
    };
  }
});
</script>