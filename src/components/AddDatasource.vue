<template>
    <n-drawer v-model:show="active" :width="502" :placement="placement" :on-mask-click="maskClick">
        <n-drawer-content title="斯通纳">
        《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
        </n-drawer-content>
    </n-drawer>
</template>
  
<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "AddDatasource",
    props: {
        active: Boolean,
        default: false
    },
    setup(props, {emit}) {
        const { active } = toRefs(props)
        const placement = ref("right");
        const maskClick = (e) => {
            emit("show", false);
        };
        return {
            active,
            placement,
            maskClick
        };
    }
});
</script>