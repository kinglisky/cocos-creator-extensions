import { computed, reactive, watchEffect, Ref, UnwrapNestedRefs, ComputedRef } from 'vue';
import { ICCEditorNode } from './type';

export type ICCEditorNodeRef = UnwrapNestedRefs<ICCEditorNode>;
export interface IUseNodeReturn {
    node: ICCEditorNodeRef;
}

export async function getNodeById(id: string): Promise<ICCEditorNode> {
    const node = await Editor.Message.request('scene', 'query-node', id);
    return node;
}

export function useNode(nodeId: Ref<string>): IUseNodeReturn {
    const node = reactive({}) as ICCEditorNodeRef;
    watchEffect(async () => {
        const res = await getNodeById(nodeId.value);
        Object.assign(node, res);
        console.log(node);
    });

    return { node };
}

export function generateNodeFormScheam(node: ICCEditorNodeRef) {
    const keys: Array<keyof ICCEditorNode> = [
        'active',
        'layer',
        'locked',
        'name',
        'position',
        'rotation',
        'scale',
    ];
    const schema: Record<string, any> = {
        title: '节点编辑器面板',
        type: 'object',
    };
    const properties: Record<string, any> = {};
    keys.forEach((key) => {
        const item = node[key];
        if (item) {
            const enumList = 'enumList' in item ? item.enumList : null;
            const type = enumList ? 'string' : typeof item.value;
            properties[key] = {
                title: item.displayName,
                type: type,
                default: item.default,
            };
        }
    });
    schema.properties = properties;
    return schema;
}

export function useNodeForm(node: ICCEditorNodeRef): {
    schema: ComputedRef<Record<string, any>>;
    uiSchema: UnwrapNestedRefs<Record<string, any>>;
} {
    const schema = computed(() => {
        const res = generateNodeFormScheam(node);
        console.log('node chagne', res);
        return res;
    });
    const uiSchema = reactive({});
    return { schema, uiSchema };
}
