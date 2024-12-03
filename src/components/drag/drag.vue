<template>
  <VueDraggable
    id="demo"
    v-model="list"
    target=".n-data-table-tbody"
    :animation="150"
  >
    <n-data-table :key="(row) => row.key" :columns="columns" :data="list" />
  </VueDraggable>
  {{ list }}
</template>

<script setup>
import {
  watch,
  defineComponent,
  h,
  nextTick,
  ref,
  toRaw,
  isReactive,
  onBeforeUpdate,
} from "vue";
import { NInput } from "naive-ui";
import { VueDraggable } from "vue-draggable-plus";
import { GameController } from "@vicons/ionicons5";

const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref(null);
    const inputValue = ref(props.value);
    function handleOnClick() {
      isEdit.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value);
      isEdit.value = false;
    }
    return () =>
      h(
        "div",
        {
          style: "min-height: 22px",
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput, {
              ref: inputRef,
              value: inputValue.value,
              onUpdateValue: (v) => {
                inputValue.value = v;
              },
              onChange: handleChange,
              onBlur: handleChange,
            })
          : props.value
      );
  },
});

defineOptions({
  inheritAttrs: false,
});

const list = ref([
  {
    key: 1,
    name: `John Brown 1`,
    age: 1,
    address: `New York No. 1 Lake Park`,
  },
  {
    key: 2,
    name: `John Brown 2`,
    age: 2,
    address: `New York No. 2 Lake Park`,
  },
  {
    key: 3,
    name: `John Brown 3`,
    age: 3,
    address: `New York No. 3 Lake Park`,
  },
  {
    key: 4,
    name: `John Brown 4`,
    age: 4,
    address: `New York No. 4 Lake Park`,
  },
  {
    key: 5,
    name: `John Brown 5`,
    age: 5,
    address: `New York No. 5 Lake Park`,
  },
]);

console.log("init", list.value);

const updateList = (newList) => {
  list.value = newList;
  console.log(list.value);
};

onBeforeUpdate(() => {
  const al = list.value.map((row, _) => {
    let obj = toRaw(row);
    return obj;
  });
  updateList(al);
});

const getDataIndex = (key) => {
  return list.value.findIndex((item) => item.key === key);
};

const columns = [
  {
    title: "Name",
    key: "name",
    width: 150,
    render(row) {
      const index = getDataIndex(row.key);
      return h(ShowOrEdit, {
        value: row.name,
        onUpdateValue(v) {
          list.value[index].name = v;
        },
      });
    },
  },
  {
    title: "Age",
    key: "age",
    width: 100,
    render(row) {
      const index = getDataIndex(row.key);
      return h(ShowOrEdit, {
        value: row.age,
        onUpdateValue(v) {
          list.value[index].age = v;
        },
      });
    },
  },
  {
    title: "Address",
    key: "address",
    render(row) {
      const index = getDataIndex(row.key);
      return h(ShowOrEdit, {
        value: row.address,
        onUpdateValue(v) {
          list.value[index].address = v;
        },
      });
    },
  },
  {
    title: "操作",
    key: "move",
    render(row) {
      return h(
        NIcon,
        {
          style: {
            verticalAlign: "-0.15em",
            marginRight: "4px",
          },
        },
        {
          default: () => h(GameController),
        }
      );
    },
  },
];

watch(list, (newList, prevList) => {
  var n = document.getElementById("demo");
  // console.log(n);
  var newAttr = document.createAttribute("target");
  newAttr.nodeValue = ".n-data-table-tbody";
  n.setAttributeNode(newAttr);
});
</script>
