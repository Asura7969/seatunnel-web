<template>
  <n-drawer
    content-style="padding: 20px 20px;"
    v-model:show="active"
    :width="800"
    :placement="placement"
    :on-mask-click="maskClick"
  >
    <n-drawer-content title="新增任务">
      <n-tabs
        type="segment"
        animated
        :default-value="choose"
        @update:value="updateChoose"
      >
        <n-tab-pane name="template" tab="模板">
          <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
            size="small"
          >
            <n-timeline size="large" :icon-size="20">
              <n-collapse :default-expanded-names="['1', '3']">
                <template #header-extra> </template>
                <template #arrow></template>

                <n-timeline-item type="error" title="" content="" time="">
                  <template #icon>
                    <n-icon>
                      <GroupResource />
                    </n-icon>
                  </template>
                  <n-collapse-item title="Source" name="1">
                    <n-grid :cols="24" :x-gap="24">
                      <n-form-item-gi
                        :span="24"
                        label="job name: "
                        path="jobName"
                      >
                        <n-input
                          v-model:value="model.jobName"
                          type="text"
                          placeholder="jobName"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="model: " path="jobType">
                        <n-select
                          v-model:value="model.jobType"
                          :options="jobOptions"
                          default-value="STREAMING"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="ckpInterval: "
                        path="ckpInterval"
                      >
                        <n-input-number
                          v-model:value="model.envProp.ckpInterval"
                          step="1000"
                          clearable
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="source: "
                        path="sourceId"
                      >
                        <n-select
                          v-model:value="model.sourceId"
                          placeholder="选择Source"
                          :render-label="renderLabel"
                          :options="generalOptions"
                          @update:value="updateSource"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="enable-2pc: "
                        path="startup mode"
                        v-if="sourceType == 'MYSQL' || sourceType == 'PG'"
                      >
                        <n-select
                          v-model:value="model.sourceProp.startupMode"
                          :options="startupModeOptions"
                          default-value="INITIAL"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="table: "
                        path="table"
                        v-if="sourceType == 'MYSQL' || sourceType == 'PG'"
                      >
                        <n-input
                          v-model:value="model.sourceProp.tableName"
                          type="text"
                          placeholder="tableName"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="server-id: "
                        path="serverId"
                        v-if="sourceType == 'MYSQL'"
                      >
                        <n-input-number
                          v-model:value="model.sourceProp.serverId"
                          min="6500"
                          max="2148492146"
                          clearable
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="schema: "
                        path="schema"
                        v-if="sourceType == 'PG'"
                      >
                        <n-input
                          v-model:value="model.sourceProp.schema"
                          type="text"
                          placeholder="schema"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="slot: "
                        path="slot"
                        v-if="sourceType == 'PG'"
                      >
                        <n-input
                          v-model:value="model.sourceProp.slot"
                          type="text"
                          placeholder="slot name"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="exactly-once: "
                        path="exactlyOnce"
                        v-if="sourceType == 'MYSQL' || sourceType == 'PG'"
                      >
                        <n-select
                          v-model:value="model.sourceProp.exactlyOnce"
                          :options="options"
                          default-value="true"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="primary keys: "
                        path="primaryKeys"
                        v-if="sourceType == 'PG'"
                      >
                        <n-input
                          v-model:value="model.sourceProp.primaryKeys"
                          type="text"
                          placeholder="主键"
                        />
                      </n-form-item-gi>
                    </n-grid>
                  </n-collapse-item>
                </n-timeline-item>
                <n-timeline-item type="warning" title="" content="" time="">
                  <template #icon>
                    <n-icon>
                      <ApartmentOutlined />
                    </n-icon>
                  </template>
                  <n-collapse-item title="Transform" name="2">
                    <n-form-item label="logic: " path="transformValue">
                      <n-input
                        v-model:value="model.transformValue"
                        type="textarea"
                        placeholder="transform logic"
                        :autosize="{
                          minRows: 5,
                        }"
                      />
                    </n-form-item>
                  </n-collapse-item>
                </n-timeline-item>
                <n-timeline-item type="success" title="" content="" time="">
                  <template #icon>
                    <n-icon>
                      <InputRound />
                    </n-icon>
                  </template>
                  <n-collapse-item title="Sink" name="3">
                    <n-grid :cols="24" :x-gap="24">
                      <n-gi :span="24">
                        <n-form-item label="output: " path="sinkId">
                          <n-select
                            v-model:value="model.sinkId"
                            placeholder="选择Sink"
                            :render-label="renderLabel"
                            :options="generalOptions"
                            @update:value="updateSink"
                          />
                        </n-form-item>
                      </n-gi>
                      <n-form-item-gi
                        :span="12"
                        label="table: "
                        path="table"
                        v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                      >
                        <n-input
                          v-model:value="model.sinkProp.tableName"
                          type="text"
                          placeholder="tableName"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="label-prefix: "
                        path="sinkLabelPrefix"
                        v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                      >
                        <n-input
                          v-model:value="model.sinkProp.sinkLabelPrefix"
                          type="text"
                          placeholder="label-prefix"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="enable-2pc: "
                        path="sinkEnable2pc"
                        v-if="sinkType == 'DORIS'"
                      >
                        <n-select
                          v-model:value="model.sinkProp.sinkEnable2pc"
                          :options="options"
                          default-value="true"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="enable-delete: "
                        path="sinkEnableDelete"
                        v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                      >
                        <n-select
                          v-model:value="model.sinkProp.sinkEnableDelete"
                          :options="options"
                          default-value="true"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="max-retries: "
                        path="maxRetries"
                        v-if="sinkType == 'STARROCKS'"
                      >
                        <n-input-number
                          v-model:value="model.sinkProp.maxRetries"
                          clearable
                          placeholder="max retries"
                          default-value="3"
                          style="width: 100%"
                        />
                      </n-form-item-gi>
                      <n-form-item-gi
                        :span="12"
                        label="replication-num: "
                        path="replicationNum"
                        v-if="sinkType == 'STARROCKS'"
                      >
                        <n-input-number
                          v-model:value="model.sinkProp.replicationNum"
                          clearable
                          placeholder="replication num"
                          default-value="1"
                          style="width: 100%"
                        />
                      </n-form-item-gi>
                    </n-grid>
                  </n-collapse-item>
                </n-timeline-item>
              </n-collapse>
            </n-timeline>
          </n-form>
          <pre> {{ JSON.stringify(model, null, 2) }} </pre>
        </n-tab-pane>
        <n-tab-pane name="constum" tab="自定义">
          <n-input
            v-model:value="model.jsonValue"
            type="textarea"
            placeholder="json"
            :autosize="{
              minRows: 30,
            }"
          />
        </n-tab-pane>
      </n-tabs>
      <template #footer>
        <n-flex justify="end">
          <n-button color="#2080f0" @click="submit" :loading="loading">
            <template #icon>
              <n-icon>
                <AddSquare24Regular />
              </n-icon>
            </template>
            提交
          </n-button>
          <n-button color="#abb4bf" @click="maskClick">
            <template #icon>
              <n-icon>
                <CancelOutlined />
              </n-icon>
            </template>
            取消
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script name="AddTask" setup>
import { ref } from "vue";
import { AddSquare24Regular, AddSquare20Filled } from "@vicons/fluent";
import { CancelOutlined, InputRound } from "@vicons/material";
import { ApartmentOutlined } from "@vicons/antd";
import { GroupResource } from "@vicons/carbon";
import { getTaskDetailById, upsertTask, getDatasource } from "../api/api";
import { chooseIcon } from "../api/common";

const emit = defineEmits(["reload"]);
const loading = ref(false);
const choose = ref("template");
const message = useMessage();
const sourceType = ref(null);
const sinkType = ref(null);
const formInitValue = {
  jobId: null,
  jobType: "STREAMING",
  jobName: null,
  envProp: {
    ckpInterval: 5000,
  },
  sourceId: null,
  sourceProp: {
    exactlyOnce: "true",
    startupMode: "INITIAL",
  },
  sinkId: null,
  transformValue: null,
  sinkProp: {
    sinkEnable2pc: "true",
    sinkEnableDelete: "true",
    maxRetries: 3,
    replicationNum: 3,
  },
  jsonValue: null,
};
const formData = ref({ ...formInitValue });
const resetForm = () => {
  formData.value = formInitValue;
  formData.value.envProp = {
    ckpInterval: 5000,
  };
  formData.value.sourceProp = {
    exactlyOnce: "true",
    startupMode: "INITIAL",
  };
  formData.value.sinkProp = {
    sinkEnable2pc: "true",
    sinkEnableDelete: "true",
    maxRetries: 3,
    replicationNum: 3,
  };
  sourceType.value = null;
  sinkType.value = null;
};

// 表单回显
const queryTaskId = (taskId) => {
  getTaskDetailById(taskId)
    .then((result) => {
      console.log(result.data);
      formData.value = result.data;
      updateSource(result.data.sourceId, null);
      updateSink(result.data.sinkId, null);
    })
    .catch((error) => {
      console.error(error);
    });
};

const generalOptions = ref([]);

onBeforeMount(() => {
  getDatasource()
    .then((res) => {
      console.log(res);
      res.data.forEach((v, i) => {
        generalOptions.value.push({
          label: v.name,
          value: v.id,
          type: v.type,
          icon: chooseIcon(v.type),
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

const formRef = ref(null);
const active = ref(false);
const placement = ref("right");

const maskClick = (e) => {
  active.value = false;
  resetForm();
};

const submit = () => {
  // TODO: 提交任务接口
  loading.value = true;
  console.log(choose.value);
  if (choose.value == "template") {
    formData.value.jsonValue = null;
  } else {
    let tmpJsonValue = formData.value.jsonValue;
    resetForm();
    formData.value.jsonValue = tmpJsonValue;
  }
  const fdata = JSON.stringify(formData.value, null, 2);

  upsertTask(fdata)
    .then((res) => {
      console.log(res);

      if (res.code == 200) {
        maskClick();
        message.success("提交成功");
      } else {
        message.error(res.msg);
      }
      loading.value = false;
    })
    .catch((error) => {
      console.error(error);
      loading.value = false;
    });
  emit("reload");
};

const updateChoose = (value, option) => {
  choose.value = value;
};

const updateSource = (value, option) => {
  const selected = generalOptions.value.filter((o) => o.value == value)[0];
  sourceType.value = selected.type;
  // console.log("update option: " + JSON.stringify(option));
};
const updateSink = (value, option) => {
  const selected = generalOptions.value.filter((o) => o.value == value)[0];
  sinkType.value = selected.type;
};
const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#9900e6";
    if (focused) {
      style.boxShadow = "0 0 0 2px #9900e640";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

const bodyStyle = {
  width: "600px",
  height: "600px",
};
const segmented = {
  content: "soft",
  footer: "soft",
};
const model = formData;
const rules = {};

const renderLabel = (option) => {
  return [option.icon, option.label];
};
const startupModeOptions = [
  {
    label: "initial",
    value: "INITIAL",
  },
  {
    label: "earliest",
    value: "EARLIEST",
  },
  {
    label: "latest ",
    value: "LATEST",
  },
];
const options = [
  {
    label: "true",
    value: "true",
  },
  {
    label: "false",
    value: "false",
  },
];
const jobOptions = [
  {
    label: "BATCH",
    value: "BATCH",
  },
  {
    label: "STREAMING",
    value: "STREAMING",
  },
];

defineExpose({ active, queryTaskId });
</script>

<style scoped lang="scss">
:deep(
    .n-timeline
      .n-timeline-item:last-child
      .n-timeline-item-timeline
      .n-timeline-item-timeline__line
  ) {
  display: inline;
}

:deep(
    .n-collapse-item__header
      .n-collapse-item__header-main
      .n-collapse-item-arrow
  ) {
  display: none;
}
</style>
