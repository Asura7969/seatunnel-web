<template>
  <n-space vertical :size="16">
    <n-card :bordered="true" :hoverable="true" :embedded="true">
      <n-row>
        <n-col :span="12">
          <n-statistic label="集群节点" :value="activeNodeNum">
            <template #prefix>
              <n-icon>
                <md-save />
              </n-icon>
            </template>
            <template #suffix> / 3 </template>
          </n-statistic>
        </n-col>
        <n-col :span="12">
          <n-statistic label="任务数"> {{ runningJobs }} </n-statistic>
        </n-col>
      </n-row>
    </n-card>
    <n-grid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
      <n-gi span="24 s:24 m:12">
        <n-card :bordered="false" class="rd-8px shadow-sm">
          <n-card :bordered="false" class="rd-8px shadow-sm">
            <div class="h-360px overflow-hidden">
              <v-chart class="chart" :option="optionPhysicalMemory" />
            </div>
          </n-card>
        </n-card>
      </n-gi>
      <n-gi span="24 s:24 m:12">
        <n-card :bordered="false" class="rd-8px shadow-sm">
          <n-card :bordered="false" class="rd-8px shadow-sm">
            <div class="h-360px overflow-hidden">
              <v-chart class="chart" :option="optionOther" />
            </div>
          </n-card>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<script setup>
import { defineComponent, reactive, onMounted } from "vue";
import { getSysInfo } from "../api/api";
import { MdSave } from "@vicons/ionicons4";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

const yColumn = ref([]);
const physicalSeries = reactive([]);
const otherSeries = reactive([]);
const activeNodeNum = ref(0);
const runningJobs = ref(0);

onMounted(() => {
  getSysInfo()
    .then((res) => {
      // loading.value = true;
      physicalSeries.length = 0;
      otherSeries.length = 0;
      yColumn.value = res.data.yColumnName;
      activeNodeNum.value = res.data.yColumnName.length;
      runningJobs.value = res.data.runningJobs;
      physicalSeries.push({
        name: "physical.memory.use(G)",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: res.data.physicalMemoryUse,
      });
      physicalSeries.push({
        name: "physical.memory.free(G)",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: res.data.physicalMemoryFree,
      });
      otherSeries.push({
        name: "heap.memory.free(G)",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: res.data.heapMemoryFree,
      });
      otherSeries.push({
        name: "heap.memory.use(G)",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: res.data.heapMemoryUsed,
      });
      otherSeries.push({
        name: "load.system(%)",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: res.data.loadSystem,
      });
      // Object.assign(data, res.data.list);

      // loading.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
});

const optionOther = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  color: ["#A80BF3", "#0B3AF3", "#F30B9D"],
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: yColumn,
  },
  series: otherSeries,
});

const optionPhysicalMemory = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "line", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  color: ["#0BA3F3", "#0BF3BB"],
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: yColumn,
  },
  series: physicalSeries,
});
</script>

<style scoped>
.chart {
  width: 600px;
  height: 400px;
}
</style>
