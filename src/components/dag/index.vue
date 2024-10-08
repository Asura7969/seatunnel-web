<template>
  <div id="container" style="height: 100%; width: 100%;"</div>
</template>
<script setup>
import { Graph, Node, Path, Cell } from "@antv/x6";
import {  onMounted,  } from "vue";
import DataNode from "./Node.vue";
import { register } from "@antv/x6-vue-shape";
import { Selection } from '@antv/x6-plugin-selection'

import { $Bus } from '@/global.js';
// interface NodeStatus {
//   id: string
//   status: 'default' | 'success' | 'failed' | 'running'
//   label?: string
// }

function NodeStatus(id, status, label) {
  this.id = id;
  this.status = status;
  if (label !== undefined) {
    this.label = label;
  }
}


register({
  shape: "dag-node",
  inherit: "vue-shape",
  width: 180,
    height: 36,
  component: {
    template: `<DataNode />`,
    components: {
      DataNode,
    },
  },
  ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
    },
});
Graph.registerEdge(
  "dag-edge",
  {
    inherit: "edge",
    attrs: {
      line: {
        stroke: '#9ca3af',
        strokeDasharray: 3,
        targetMarker: 'classic',
        style: {
          animation: 'running-line 30s infinite linear',
        },
      },
    },
  },
  true
);

Graph.registerConnector(
  "algo-connector",
  (s, e) => {
    const offset = 4;
    const deltaY = Math.abs(e.y - s.y);
    const control = Math.floor((deltaY / 3) * 2);

    const v1 = { x: s.x, y: s.y + offset + control };
    const v2 = { x: e.x, y: e.y - offset - control };

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
       L ${e.x} ${e.y}
      `
    );
  },
  true
);

const nodeStatusList = [
  [
    {
      id: "1",
      status: "running",
    },
    {
      id: "2",
      status: "default",
    },
    {
      id: "3",
      status: "default",
    },
    {
      id: "4",
      status: "default",
    },
  ],
  [
    {
      id: "1",
      status: "success",
    },
    {
      id: "2",
      status: "running",
    },
    {
      id: "3",
      status: "default",
    },
    {
      id: "4",
      status: "default",
    },
  ],
  [
    {
      id: "1",
      status: "success",
    },
    {
      id: "2",
      status: "success",
    },
    {
      id: "3",
      status: "running",
    },
    {
      id: "4",
      status: "running",
    },
  ],
  [
    {
      id: "1",
      status: "success",
    },
    {
      id: "2",
      status: "success",
    },
    {
      id: "3",
      status: "success",
    },
    {
      id: "4",
      status: "failed",
    },
  ],
];

const data = [
  {
    id: "1",
    shape: "dag-node",
    x: 290,
    y: 110,
    data: {
      label: "读数据",
      status: "success",
    },
    ports: [
      {
        id: "1-1",
        group: "bottom",
      },
    ],
  },
  {
    id: "2",
    shape: "dag-node",
    x: 290,
    y: 225,
    data: {
      label: "逻辑回归",
      status: "success",
    },
    ports: [
      {
        id: "2-1",
        group: "top",
      },
      {
        id: "2-2",
        group: "bottom",
      },
      {
        id: "2-3",
        group: "bottom",
      },
    ],
  },
  {
    id: "3",
    shape: "dag-node",
    x: 170,
    y: 350,
    data: {
      label: "模型预测",
      status: "success",
    },
    ports: [
      {
        id: "3-1",
        group: "top",
      },
      {
        id: "3-2",
        group: "bottom",
      },
    ],
  },
  {
    id: "4",
    shape: "dag-node",
    x: 450,
    y: 350,
    data: {
      label: "读取参数",
      status: "success",
    },
    ports: [
      {
        id: "4-1",
        group: "top",
      },
      {
        id: "4-2",
        group: "bottom",
      },
    ],
  },
  {
    id: "5",
    shape: "dag-edge",
    source: {
      cell: "1",
      port: "1-1",
    },
    target: {
      cell: "2",
      port: "2-1",
    },
    zIndex: 0,
  },
  {
    id: "6",
    shape: "dag-edge",
    source: {
      cell: "2",
      port: "2-2",
    },
    target: {
      cell: "3",
      port: "3-1",
    },
    zIndex: 0,
  },
  {
    id: "7",
    shape: "dag-edge",
    source: {
      cell: "2",
      port: "2-3",
    },
    target: {
      cell: "4",
      port: "4-1",
    },
    zIndex: 0,
  },
];

onMounted(() => {
  let graph = new Graph({
    container: document.getElementById("container"),
    panning: {
      enabled: true,
      eventTypes: ["leftMouseDown", "mouseWheel"],
    },
    mousewheel: {
      enabled: true,
      modifiers: "ctrl",
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#fff",
            stroke: "#31d0c6",
            strokeWidth: 4,
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: "algo-connector",
      connectionPoint: "anchor",
      anchor: "center",
      validateMagnet({ magnet }) {
        return magnet.getAttribute("port-group") !== "top";
      },
      createEdge() {
        return graph.createEdge({
          shape: "dag-edge",
          attrs: {
            line: {
              strokeDasharray: "5 5",
            },
          },
          zIndex: -1,
        });
      },
    },
  })
  // 挂载插件
  .use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: 'shift',
      rubberband: true,
    }),
  );

  graph.on("edge:connected", ({ edge }) => {
    edge.attr({
      line: {
        strokeDasharray: "",
      },
    });
  });

  graph.on("node:change:data", ({ node }) => {
    const edges = graph.getIncomingEdges(node);
    // const { status } = node.getData() as NodeStatus
    const { status } = node.getData();
    edges?.forEach((edge) => {
      if (status === "running") {
        edge.attr("line/strokeDasharray", 5);
        edge.attr("line/style/animation", "running-line 30s infinite linear");
      } else {
        edge.attr("line/strokeDasharray", "");
        edge.attr("line/style/animation", "");
      }
    });
  });

  // 初始化节点/边 data: : Cell.Metadata[]
  const init = (data) => {
    const cells = [];
    data.forEach((item) => {
      if (item.shape === "dag-node") {
        cells.push(graph.createNode(item));
      } else {
        cells.push(graph.createEdge(item));
      }
    });
    graph.resetCells(cells);
  };

  // 显示节点状态 statusList: NodeStatus[][]
  const showNodeStatus = (statusList) => {
    const status = statusList.shift();
    status?.forEach((item) => {
      const { id, status } = item;
      const node = graph.getCellById(id);
      // const data = node.getData() as NodeStatus
      const data = node.getData();
      // const edges = graph.getIncomingEdges(node);
      // edges?.forEach((edge) => {
      //   if (status === "running") {
      //     edge.attr("line/strokeDasharray", 5);
      //     edge.attr("line/style/animation", "running-line 30s infinite linear");
      //   } else {
      //     edge.attr("line/strokeDasharray", "");
      //     edge.attr("line/style/animation", "");
      //   }
      // });
      node.setData({
        ...data,
        status: status,
      });
    });
    setTimeout(() => {
      showNodeStatus(statusList);
    }, 3000);
  };

  init(data);
  // showNodeStatus(nodeStatusList);
  graph.centerContent();


});

</script>
<style scoped>
</style>
