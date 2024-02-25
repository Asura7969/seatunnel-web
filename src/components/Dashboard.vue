<template>
  <n-space vertical :size="16">
    <n-card
      :bordered="true"
      :hoverable="true"
      :embedded="true"
      class="card-wrapper"
    >
      <n-row>
        <n-col :span="12">
          <n-statistic label="集群节点" :value="3">
            <template #prefix>
              <n-icon>
                <md-save />
              </n-icon>
            </template>
            <template #suffix> / 3 </template>
          </n-statistic>
        </n-col>
        <n-col :span="12">
          <n-statistic label="任务数"> 1,234,123 </n-statistic>
        </n-col>
      </n-row>
    </n-card>
  </n-space>
</template>

<script>
import { defineComponent } from "vue";
import { MdSave } from "@vicons/ionicons4";

export default defineComponent({
  components: {
    MdSave,
  },
});
</script>
