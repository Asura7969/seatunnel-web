<template>
    <n-drawer v-model:show="active" :width="502" :placement="placement">
        <n-drawer-content title="斯通纳">
        《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
        </n-drawer-content>
    </n-drawer>
    <h1> {{active}}</h1>
</template>
  
<script>
import { defineComponent, ref } from "vue";



export default defineComponent({
    name: "AddDatasource",
    props: {
        active: Boolean
    },
    setup(props) {

        console.log(11111);
        const { active } = toRefs(props)
        const placement = ref("right");
        const activate = (place) => {
            active.value = true;
            placement.value = place;
        };
        return {
            active,
            placement,
            activate
        };
    }
});
</script>