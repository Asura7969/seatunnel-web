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
            <n-form-item label="作业类型: " path="inputValue">
                <n-input v-model:value="model.inputValue" placeholder="batch or stream" />
            </n-form-item>
        </n-form>
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
import { AddSquare24Regular } from "@vicons/fluent";
import { CancelOutlined } from "@vicons/material";

export default defineComponent({
    name: "AddTask",
    components: {
        AddSquare24Regular,
        CancelOutlined,
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

        return {
            active,
            maskClick,
            submit,
            rules:{},
            formRef,
            model: ref({
                inputValue: ""
            }),
            size: ref("small"),
            bodyStyle: {
                width: "600px",
                height: "800px",
            },
            segmented: {
                content: "soft",
                footer: "soft"
            },
        }
    }
})
</script>

<style scoped>
.custom-card {
    width: "600px"
}
</style>