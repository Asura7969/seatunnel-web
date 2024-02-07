<template>
    <n-drawer 
      content-style="padding: 20px 20px;"
      v-model:show="active" 
      :width="502" 
      :placement="placement" 
      :on-mask-click="maskClick"
      :on-update="update">
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
                    maxWidth: '640px'
                }"
            >
                <n-form-item label="数据源: " path="selectValue">
                    <n-select
                        v-model:value="model.selectValue"
                        placeholder="选择数据源"
                        :render-label="renderLabel"
                        :options="generalOptions"
                    />
                </n-form-item>
                <n-form-item label="Host: " path="hostValue">
                    <n-input v-model:value="model.hostValue" placeholder="地址" />
                </n-form-item>
                <n-form-item label="User: " path="userValue">
                    <n-input v-model:value="model.userValue" placeholder="用户名" />
                </n-form-item>
                <n-form-item label="Passwd: " path="pdValue">
                    <n-input v-model:value="model.pdValue" placeholder="密码" />
                </n-form-item>
                <n-form-item label="Database: " path="dbValue">
                    <n-input v-model:value="model.dbValue" placeholder="数据库" />
                </n-form-item>
            </n-form>
            <n-flex justify="end">
                <n-button color="#2080f0" @click="submit">
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
  
<script>
import { defineComponent, ref } from "vue";
import DorisIcon from '../assets/doris.svg';
import MysqlIcon from '../assets/mysql.svg';
import PostgresqlIcon from '../assets/postgresql.svg';
import StarrocksIcon from '../assets/starrocks.svg';
import { AddSquare24Regular } from "@vicons/fluent";
import { CancelOutlined } from "@vicons/material";

const renderIcon = (icon) => {
    return h(NIcon,{
                style: {
                    verticalAlign: "-0.15em",
                    marginRight: "4px"
                }
            },{ 
                default: () => h(icon)
            }
    );
};

const generalOptions = [{
    label: 'Doris',
    value: 'Doris',
    icon: renderIcon(DorisIcon)
},{
    label: 'Mysql',
    value: 'Mysql',
    icon: renderIcon(MysqlIcon)
},{
    label: 'Postgres',
    value: 'Postgres',
    icon: renderIcon(PostgresqlIcon)
},{
    label: 'Starrocks',
    value: 'Starrocks',
    icon: renderIcon(StarrocksIcon)
}];


export default defineComponent({
    name: "AddDatasource",
    components:{
        DorisIcon,
        MysqlIcon,
        PostgresqlIcon,
        StarrocksIcon,
        AddSquare24Regular,
        CancelOutlined,
    },
    setup(props, {emit}) {
        const formRef = ref(null);

        const active = ref(false)
        const placement = ref("right");
        const maskClick = (e) => {
            emit("show", false);
        };
        const submit = () => {
            // TODO: 新增接口
            console.log("submit");
            maskClick();
        };
        const update = (s) => {
            console.log("show: " + s)
        };
        return {
            active,
            placement,
            maskClick,
            submit,
            generalOptions,
            rules:{},
            formRef,
            model: ref({
                selectValue: null,
                hostValue: null,
                userValue: null,
                pdValue: null,
                dbValue: null,
            }),
            size: ref("small"),
            renderLabel: (option) => {
                return [
                option.icon,
                option.label
                ];
            },
            update,
        };
    }
});
</script>