<template>
  <n-drawer
    content-style="padding: 20px 20px;"
    v-model:show="active"
    :width="502"
    :placement="placement"
    :on-mask-click="maskClick"
    :on-update="update"
  >
    <n-drawer-content title="数据源">
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :size="size"
        :style="{
          maxWidth: '640px',
        }"
      >
        <n-form-item label="Name: " path="nameValue">
          <n-input v-model:value="model.name" placeholder="名称" />
        </n-form-item>
        <n-form-item label="Type: " path="selectValue">
          <n-select
            v-model:value="model.type"
            placeholder="选择数据源"
            :render-label="renderLabel"
            :options="generalOptions"
          />
        </n-form-item>
        <n-form-item label="Host: " path="hostValue">
          <n-input v-model:value="model.address" placeholder="地址" />
        </n-form-item>
        <n-form-item
          :label="model.type == 'Starrocks' ? 'Query Port' : 'Port'"
          path="portValue"
        >
          <n-input-number
            v-model:value="model.port"
            clearable
            :placeholder="model.type == 'Starrocks' ? 'Query端口' : '端口'"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item
          :label="model.type == 'Starrocks' ? 'Http Port' : 'Port'"
          v-if="model.type == 'Starrocks'"
          path="portValue"
        >
          <n-input-number
            v-model:value="model.other.httpPortValue"
            clearable
            :placeholder="model.type == 'Starrocks' ? 'Http端口' : '端口'"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="User: " path="userValue">
          <n-input v-model:value="model.user" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="Passwd: " path="pdValue">
          <n-input v-model:value="model.passwd" placeholder="密码" />
        </n-form-item>
        <n-form-item label="Database: " path="dbValue">
          <n-input v-model:value="model.database" placeholder="数据库" />
        </n-form-item>
      </n-form>
      <n-flex justify="end">
        <n-button color="#2080f0" @click="submit" :loading="loading">
          <template #icon>
            <n-icon>
              <AddSquare24Regular />
            </n-icon>
          </template>
          新增
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
    </n-drawer-content>
  </n-drawer>
</template>

<script name="AddDatasource" setup>
import { ref } from "vue";
import DorisIcon from "../assets/doris.svg";
import MysqlIcon from "../assets/mysql.svg";
import PostgresqlIcon from "../assets/postgresql.svg";
import StarrocksIcon from "../assets/starrocks.svg";
import { AddSquare24Regular } from "@vicons/fluent";
import { CancelOutlined } from "@vicons/material";
import { renderIcon } from "../api/common";
import { addDatasource } from "../api/api";

const emit = defineEmits(["reload"]);
const generalOptions = [
  {
    label: "Doris",
    value: "DORIS",
    icon: renderIcon(DorisIcon),
  },
  {
    label: "Mysql",
    value: "MYSQL",
    icon: renderIcon(MysqlIcon),
  },
  {
    label: "Postgres",
    value: "PG",
    icon: renderIcon(PostgresqlIcon),
  },
  {
    label: "Starrocks",
    value: "STARROCKS",
    icon: renderIcon(StarrocksIcon),
  },
];

const message = useMessage();
const loading = ref(false);
const formRef = ref(null);
const formInitValue = {
  name: null,
  type: null,
  address: null,
  port: null,
  user: null,
  passwd: null,
  database: null,
  other: {
    httpPortValue: null,
  },
};
const formData = ref({ ...formInitValue });
const active = ref(false);
const placement = ref("right");
const maskClick = (e) => {
  active.value = false;
};

const resetForm = () => {
  formData.value = formInitValue;
  formData.value.other.httpPortValue = null;
};
const submit = () => {
  loading.value = true;
  const fdata = JSON.stringify(formData.value, null, 2);
  console.log(fdata);
  addDatasource(fdata)
    .then((res) => {
      console.log(res);

      if (res.code == 200) {
        maskClick();
        resetForm();
        message.success("提交成功");
      } else {
        message.error("提交失败");
      }
      loading.value = false;
    })
    .catch((error) => {
      console.error(error);
      loading.value = false;
    });

  emit("reload");
};
const update = (s) => {
  console.log("show: " + s);
};

const renderLabel = (option) => {
  return [option.icon, option.label];
};
const size = ref("small");
const model = formData;
const rules = {};

defineExpose({ active });
</script>
