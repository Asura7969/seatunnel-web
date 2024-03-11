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
        <n-form-item label="Name: " path="name">
          <n-input v-model:value="model.name" placeholder="名称" />
        </n-form-item>
        <n-form-item label="Type: " path="type">
          <n-select
            v-model:value="model.type"
            placeholder="选择数据源"
            :render-label="renderLabel"
            :options="generalOptions"
          />
        </n-form-item>
        <n-form-item label="Host: " path="address">
          <n-input v-model:value="model.address" placeholder="地址" />
        </n-form-item>
        <n-form-item
          :label="model.type == 'STARROCKS' ? 'Query Port' : 'Port'"
          path="port"
        >
          <n-input-number
            v-model:value="model.port"
            clearable
            :placeholder="model.type == 'STARROCKS' ? 'Query端口' : '端口'"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item
          :label="model.type == 'STARROCKS' ? 'Http Port' : 'Port'"
          v-if="model.type == 'STARROCKS'"
          path="httpPortValue"
        >
          <n-input-number
            v-model:value="model.other.httpPortValue"
            clearable
            :placeholder="model.type == 'STARROCKS' ? 'Http端口' : '端口'"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="User: " path="user">
          <n-input v-model:value="model.user" placeholder="用户名" />
        </n-form-item>
        <n-form-item label="Passwd: " path="passwd">
          <n-input v-model:value="model.passwd" placeholder="密码" />
        </n-form-item>
        <n-form-item label="Database: " path="database">
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
  formRef.value?.validate((errors) => {
    if (!errors) {
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
            message.error(res.msg);
          }
          loading.value = false;
        })
        .catch((error) => {
          console.error(error);
          loading.value = false;
        });

      emit("reload");
    } else {
      message.error(errors[0][0].message);
    }
  });
};
const update = (s) => {
  console.log("show: " + s);
};

const renderLabel = (option) => {
  return [option.icon, option.label];
};
const size = ref("small");
const model = formData;
const rules = {
  name: [
    {
      required: true,
      message: "需要名称",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "需要指定类型",
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "需要host",
      trigger: "blur",
    },
  ],
  port: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error("需要端口");
        } else if (!/^\d*$/.test(value)) {
          return new Error("年龄应该为整数");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  user: [
    {
      required: true,
      message: "需要用户名",
      trigger: "blur",
    },
  ],
  passwd: [
    {
      required: true,
      message: "需要密码",
      trigger: "blur",
    },
  ],
  database: [
    {
      required: true,
      message: "需要指定数据库",
      trigger: "blur",
    },
  ],
};

defineExpose({ active });
</script>
