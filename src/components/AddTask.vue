<template>
    <n-modal 
        v-model:show="active"
        :style="bodyStyle"
        preset="card"
        title="新增任务"
        size="small"
        :bordered="false"
        :segmented="segmented"
    >    
        <template #header-extra>
        
        </template>
        <n-scrollbar style="height: 470px">
            <n-form
                ref="formRef"
                :model="model"
                :rules="rules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
                size="small"
                :style="{
                    maxWidth: '540px',
                    maxHeight: '600px',
                }"
            >
                <n-collapse :default-expanded-names="['1', '3']" style="height: 600px">
                    <template #header-extra>
                    </template>
                    <template #arrow>
                        <n-icon>
                            <AddSquare20Filled />
                        </n-icon>
                    </template>
                    <n-collapse-item title="Source" name="1">
                    
                        <n-form-item label="model: " path="inputValue">
                            <n-switch :rail-style="railStyle" :round="false">
                                <template #checked>
                                    batch
                                </template>
                                <template #unchecked>
                                    stream
                                </template>
                            </n-switch>
                        </n-form-item>
                        <n-form-item label="Input: " path="sourceValue">
                            <n-select
                                v-model:value="model.sourceValue"
                                placeholder="选择Source"
                                :render-label="renderLabel"
                                :options="generalOptions"
                            />
                        </n-form-item>
                        <n-form-item label="Config: " path="sourceConfig">
                            <n-input
                                v-model:value="model.sourceConfig"
                                type="textarea"
                                placeholder="source config"
                                :autosize="{
                                    minRows: 5
                                }"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="Transform" name="2">
                        <n-form-item label="Transform: " path="transformValue">
                            <n-input
                                v-model:value="model.transformValue"
                                type="textarea"
                                placeholder="transform logic"
                                :autosize="{
                                    minRows: 5
                                }"
                            />
                        </n-form-item>
                    </n-collapse-item>
                    <n-collapse-item title="Sink" name="3">
                        <n-form-item label="Output: " path="sinkValue">
                            <n-select
                                v-model:value="model.sinkValue"
                                placeholder="选择Sink"
                                :render-label="renderLabel"
                                :options="generalOptions"
                            />
                        </n-form-item>
                        <n-form-item label="Config: " path="sinkConfig">
                            <n-input
                                v-model:value="model.sinkConfig"
                                type="textarea"
                                placeholder="sink config"
                                :autosize="{
                                    minRows: 5
                                }"
                            />
                        </n-form-item>
                    </n-collapse-item>
                </n-collapse>

            </n-form>
        </n-scrollbar>


        <template #footer>
            <n-flex justify="end">
                <n-button color="#2080f0" @click="submit">
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
    </n-modal>
</template>

<script>
import { defineComponent } from 'vue'
import { AddSquare24Regular, AddSquare20Filled } from "@vicons/fluent";
import { CancelOutlined } from "@vicons/material";
import DorisIcon from '../assets/doris.svg';
import MysqlIcon from '../assets/mysql.svg';
import PostgresqlIcon from '../assets/postgresql.svg';
import StarrocksIcon from '../assets/starrocks.svg';

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
    label: '数仓Doris',
    value: '2',
    icon: renderIcon(DorisIcon)
},{
    label: 'sim',
    value: '1',
    icon: renderIcon(MysqlIcon)
},{
    label: 'mes',
    value: '3',
    icon: renderIcon(PostgresqlIcon)
},{
    label: '数仓StarRocks',
    value: '4',
    icon: renderIcon(StarrocksIcon)
}];



export default defineComponent({
    name: "AddTask",
    components: {
        AddSquare24Regular,
        CancelOutlined,
        DorisIcon,
        MysqlIcon,
        PostgresqlIcon,
        StarrocksIcon,
        AddSquare20Filled,
    },
    setup (props, {emit}) {
        const formRef = ref(null);

        const active = ref(false)
        const maskClick = (e) => {
            emit("show", false);
        };
        const submit = () => {
            // TODO: 提交任务接口
            console.log("submit");
            maskClick();
        };

        const railStyle = ({focused, checked}) => {
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

        return {
            active,
            maskClick,
            submit,
            rules:{},
            formRef,
            model: ref({
                inputValue: "",
                sourceValue: null,
                sinkValue: null,
                sourceConfig: null,
                transformValue: null,
                sinkConfig: null
            }),
            bodyStyle: {
                width: "600px",
                height: "600px",
            },
            segmented: {
                content: "soft",
                footer: "soft"
            },
            railStyle,
            generalOptions,
            renderLabel: (option) => {
                return [
                option.icon,
                option.label
                ];
            },
        }
    }
})
</script>

<style scoped lang="scss">
</style>