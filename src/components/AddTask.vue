<template>
    <n-drawer 
      content-style="padding: 20px 20px;"
      v-model:show="active" 
      :width="800" 
      :placement="placement" 
      :on-mask-click="maskClick">
      <n-drawer-content title="新增任务">
        <n-tabs type="segment" animated>
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
                            <template #header-extra>
                            </template>
                            <template #arrow>
                                <!-- <n-icon>
                                    <AddSquare20Filled />
                                </n-icon> -->
                            </template>
                        
                            <n-timeline-item
                                type="error"
                                title=""
                                content=""
                                time=""
                            >
                                <template #icon>
                                    <n-icon>
                                        <GroupResource />
                                    </n-icon>
                                </template>
                                <n-collapse-item title="Source" name="1">
                                    <n-grid :cols="24" :x-gap="24">
                                        <n-form-item-gi :span="12" label="model: " path="inputValue">
                                            <n-switch :rail-style="railStyle" :round="false" v-model:value="model.inputValue">
                                                <template #checked>
                                                    batch
                                                </template>
                                                <template #unchecked>
                                                    stream
                                                </template>
                                            </n-switch>
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="source: " path="sourceValue">
                                            <n-select
                                                v-model:value="model.sourceValue"
                                                placeholder="选择Source"
                                                :render-label="renderLabel"
                                                :options="generalOptions"
                                                @update:value="updateSource"
                                            />
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="table: " path="table" v-if="sourceType == 'MYSQL' || sourceType == 'PG'">
                                            <n-input v-model:value="model.sourceProp.tableName" type="text" placeholder="tableName" />
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="server-id: " path="serverId" v-if="sourceType == 'MYSQL'">
                                            <n-input v-model:value="model.sourceProp.serverId" type="text" placeholder="serverId" />
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="schema: " path="schema" v-if="sourceType == 'PG'">
                                            <n-input v-model:value="model.sourceProp.schema" type="text" placeholder="schema" />
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="slot: " path="slot" v-if="sourceType == 'PG'">
                                            <n-input v-model:value="model.sourceProp.slot" type="text" placeholder="slot name" />
                                        </n-form-item-gi>
                                        <n-form-item-gi 
                                            :span="12" 
                                            label="exactly-once: " 
                                            path="exactlyOnce" 
                                            v-if="sourceType == 'MYSQL' || sourceType == 'PG'"
                                        >
                                            <n-select v-model:value="model.sourceProp.exactlyOnce" :options="options" default-value="true" />
                                        </n-form-item-gi>
                                        <n-gi :span="24" v-if="sourceType == null">
                                            <n-form-item label="config: " path="sourceConfig">
                                                <n-input
                                                    v-model:value="model.sourceConfig"
                                                    type="textarea"
                                                    placeholder="source config"
                                                    :autosize="{
                                                        minRows: 5
                                                    }"
                                                />
                                            </n-form-item>
                                        </n-gi>
                                    </n-grid>
                                </n-collapse-item>
                            </n-timeline-item>
                            <n-timeline-item
                                type="warning"
                                title=""
                                content=""
                                time=""
                            >
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
                                                minRows: 5
                                            }"
                                        />
                                    </n-form-item>
                                </n-collapse-item>
                        
                            </n-timeline-item>
                            <n-timeline-item
                                type="success"
                                title=""
                                content=""
                                time=""
                            >
                                <template #icon>
                                    <n-icon>
                                    <InputRound />
                                    </n-icon>
                                </template>
                                <n-collapse-item title="Sink" name="3">
                                    <n-grid :cols="24" :x-gap="24">
                                        <n-gi :span="24">
                                            <n-form-item label="output: " path="sinkValue">
                                                <n-select
                                                    v-model:value="model.sinkValue"
                                                    placeholder="选择Sink"
                                                    :render-label="renderLabel"
                                                    :options="generalOptions"
                                                    @update:value="updateSink"
                                                />
                                            </n-form-item>
                                        </n-gi>
                                        <n-form-item-gi :span="12" label="table: " path="table" 
                                            v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                                        >
                                            <n-input v-model:value="model.sinkProp.tableName" type="text" placeholder="tableName" />
                                        </n-form-item-gi>
                                        <n-form-item-gi :span="12" label="label-prefix: " path="sinkLabelPrefix" 
                                            v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                                        >
                                            <n-input v-model:value="model.sinkProp.sinkLabelPrefix" type="text" placeholder="label-prefix" />
                                        </n-form-item-gi>
                                        <n-form-item-gi 
                                            :span="12" 
                                            label="enable-2pc: " 
                                            path="sinkEnable2pc" 
                                            v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                                        >
                                            <n-select v-model:value="model.sinkProp.sinkEnable2pc" :options="options" default-value="true" />
                                        </n-form-item-gi>
                                        <n-form-item-gi 
                                            :span="12" 
                                            label="enable-delete: " 
                                            path="sinkEnableDelete" 
                                            v-if="sinkType == 'DORIS' || sinkType == 'STARROCKS'"
                                        >
                                            <n-select v-model:value="model.sinkProp.sinkEnableDelete" :options="options" default-value="true" />
                                        </n-form-item-gi>
                                    </n-grid>

                                    <n-form-item label="config: " path="sinkConfig" v-if="sinkType == null">
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
                        minRows: 30
                    }"
                />
            </n-tab-pane>
        </n-tabs>
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
        
      </n-drawer-content>
    </n-drawer>

</template>

<script>
import { defineComponent } from 'vue'
import { AddSquare24Regular, AddSquare20Filled } from "@vicons/fluent";
import { CancelOutlined, InputRound } from "@vicons/material";
import { ApartmentOutlined } from "@vicons/antd";
import DorisIcon from '../assets/doris.svg';
import MysqlIcon from '../assets/mysql.svg';
import PostgresqlIcon from '../assets/postgresql.svg';
import StarrocksIcon from '../assets/starrocks.svg';
import { GroupResource } from "@vicons/carbon";

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
        GroupResource,
        ApartmentOutlined,
        InputRound,
    },
    setup (props, {emit}) {

        const initialState = {
                inputValue: false,
                sourceValue: null,
                sourceProp: {
                    exactlyOnce: 1
                },
                sinkValue: null,
                sourceConfig: null,
                transformValue: null,
                sinkConfig: null,
                sinkProp: {
                    sinkEnable2pc: 1,
                    sinkEnableDelete: 1
                },
                jsonValue: null,
            };
        const formData = ref(initialState);
        const resetForm = () => {
            // formData.value = initialState;
            // Object.assign(formData, initialState);
            // formRef.value = null;
        };
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
            type: 'DORIS',
            icon: renderIcon(DorisIcon)
        },{
            label: 'sim',
            value: '1',
            type: 'MYSQL',
            icon: renderIcon(MysqlIcon)
        },{
            label: 'mes',
            value: '3',
            type: 'PG',
            icon: renderIcon(PostgresqlIcon)
        },{
            label: '数仓StarRocks',
            value: '4',
            type: 'STARROCKS',
            icon: renderIcon(StarrocksIcon)
        }];
        const formRef = ref(null);
        const sourceType = ref(null);
        const sinkType = ref(null);
        const active = ref(false);
        const placement = ref("right");

        const maskClick = (e) => {
            active.value = false;
            resetForm();
        };
        const submit = () => {
            // TODO: 提交任务接口
            console.log("submit");
            maskClick();
        };

        const updateSource = (value, option) => {
            const selected = generalOptions.filter(o=> o.value == value)[0];
            sourceType.value = selected.type;
            // console.log("update option: " + JSON.stringify(option));
        };
        const updateSink = (value, option) => {
            const selected = generalOptions.filter(o=> o.value == value)[0];
            sinkType.value = selected.type;
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
            placement,
            maskClick,
            submit,
            rules:{},
            formRef,
            updateSource,
            updateSink,
            sourceType,
            sinkType,
            model: formData,
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
            options: [{
                label: "true",
                value: 1,
            },{
                label: "false",
                value: 0,
            }]
        }
    }
})
</script>

<style scoped lang="scss">
:deep(.n-timeline .n-timeline-item:last-child .n-timeline-item-timeline .n-timeline-item-timeline__line) {
    display: inline;
}

:deep(.n-collapse-item__header .n-collapse-item__header-main .n-collapse-item-arrow) {
    display: none;
}

</style>