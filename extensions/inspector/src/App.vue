<template>
  <VueForm
    v-model="data"
    :ui-schema="uiSchema"
    :schema="schema"
    :formFooter="formFooter"
  >
  </VueForm>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue';
import VueForm from '@lljj/vue3-form-element';
import { useNode, useNodeForm } from './hooks/node';

export default defineComponent({
  components: {
    VueForm,
  },

  setup() {
    const { node, clearNodeEffects } = useNode();
    const { data, schema, uiSchema } = useNodeForm(node);
    const formFooter = { show: false };
    onBeforeUnmount(() => clearNodeEffects());
    return {
      data,
      schema,
      uiSchema,
      formFooter,
    };
  },
});
</script>

<style style-provider>
#app {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
