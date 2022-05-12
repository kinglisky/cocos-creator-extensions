import { ref, watchEffect, Ref } from 'vue';

type ICCEditorNode = Record<string, any>;

export interface IUseNodeReturn {
  node: Ref<ICCEditorNode>;
}

export async function getNodeById(id: string): Promise<ICCEditorNode> {
  const node = await Editor.Message.request('scene', 'query-node', id);
  return node;
}

export function useNode(nodeId: Ref<string>): IUseNodeReturn {
  const node: Ref<ICCEditorNode> = ref({});
  watchEffect(async () => {
    const res = await getNodeById(nodeId.value);
    node.value = res;
    console.log('node change', nodeId.value);
    console.log(JSON.stringify(res));
  });

  return { node };
}
