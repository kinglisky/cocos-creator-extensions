<template>
  <VueForm v-model="formData" :ui-schema="uiSchema" :schema="schema"> </VueForm>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { useNode } from "./hooks/node";

export default defineComponent({
  components: {
    VueForm,
  },

  setup() {
    const nodeId = inject<Ref<string>>("nodeId");
    const formData = reactive({});
    const schema = reactive({
      type: "object",
      required: ["userName", "age"],
      properties: {
        userName: {
          type: "string",
          title: "用户名",
          default: "Liu.Jun",
        },
        age: {
          type: "number",
          title: "年龄",
        },
        bio: {
          type: "string",
          title: "签名",
          minLength: 10,
          default: "知道的越多、就知道的越少",
        },
      },
    });
    const uiSchema = reactive({
      bio: {
        "ui:options": {
          placeholder: "请输入你的签名",
          type: "textarea",
          rows: 1,
        },
      },
    });
    // useNode(nodeId!);
    return {
      formData,
      schema,
      uiSchema,
    };
  },
});
</script>


<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
