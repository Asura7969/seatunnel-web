<template>
  <div id="container"></div>
</template>
<script setup>
import { Graph } from "@antv/x6";
import { onMounted } from "vue";

let graph;
const data = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      attrs: {
        body: {
          fill: "#2ECC71",
          stroke: "#000",
          strokeDasharray: "10,2",
        },
        label: {
          text: "Hello",
          fill: "#333",
          fontSize: 13,
        },
      },
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      attrs: {
        body: {
          fill: "#F39C12",
          stroke: "#000",
          rx: 16,
          ry: 16,
        },
        label: {
          text: "World",
          fill: "#333",
          fontSize: 18,
          fontWeight: "bold",
          fontVariant: "small-caps",
        },
      },
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
      attrs: {
        line: {
          strokeDasharray: "5 5",
        },
        // line: {
        //   style: {
        //     animation: "",
        //   },
        // },
      },
    },
  ],
};

onMounted(() => {
  graph = new Graph({
    container: document.getElementById("container"),
    width: 800,
    height: 600,
  });
  graph.fromJSON(data);
});
</script>
