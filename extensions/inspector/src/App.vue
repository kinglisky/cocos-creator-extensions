<template>
    <VueForm v-model="node" :ui-schema="uiSchema" :schema="schema"> </VueForm>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref } from 'vue';
import VueForm from '@lljj/vue3-form-element';
import { useNode, useNodeForm } from './hooks/node';

export default defineComponent({
    components: {
        VueForm,
    },

    setup() {
        const nodeId = inject<Ref<string>>('nodeId');
        const { node } = useNode(nodeId!);
        const { schema, uiSchema } = useNodeForm(node);
        console.log({ schema, uiSchema, node });
        return {
            node,
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
