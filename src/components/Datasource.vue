<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
  />
</template>

<script>
import { h, defineComponent } from "vue";

function tagType(row) {
  if (row.type == 'mysql') {
    return "warning"
  } else if (row.type == 'doris') {
    return "success"
  } else {
    return "info"
  };
}

const createColumns = ({
  play
}) => {
  return [
    {
      title: "序号",
      key: "no"
    },
    {
      title: "名称",
      key: "title"
    },
    {
      title: "类型",
      key: "type",
      render(row) {
        return h(
          NTag,
          {
            type: tagType(row),
            bordered: false
          },
          { default: () => row.type }
        );
      }
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            type: "info",
            quaternary: true,
            onClick: () => play(row)
          },
          { default: () => "编辑" }
        );
      }
    }
  ];
};

const data = [
  { no: 1, title: "sim", type: "mysql" },
  { no: 2, title: "数仓", type: "doris" },
  { no: 3, title: "mes", type: "postgres" }
];

export default defineComponent({
  setup() {
    const message = useMessage();
    return {
      data,
      columns: createColumns({
        play(row) {
          message.info(`Play ${row.title}`);
        }
      }),
      pagination: false
    };
  }
});
</script>