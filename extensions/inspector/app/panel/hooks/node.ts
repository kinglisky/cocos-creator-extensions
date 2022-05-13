import {
  computed,
  reactive,
  toRaw,
  UnwrapNestedRefs,
  ComputedRef,
  WritableComputedRef,
} from 'vue';
import isEqual from 'lodash/isEqual';
import { ICCEditorNode } from './type';

export type ICCEditorNodeRef = UnwrapNestedRefs<ICCEditorNode>;
export type ICCEditorNodeProps = keyof ICCEditorNode;
export type INodeFormData = WritableComputedRef<
  Record<ICCEditorNodeProps, any>
>;
export const EDITOR_NODE_PROPS: ICCEditorNodeProps[] = [
  'name',
  'active',
  'locked',
  'position',
  'rotation',
  'scale',
  'layer',
];

function getNodeById(id: string): Promise<ICCEditorNode> {
  return Editor.Message.request('scene', 'query-node', id);
}

export function useNode(): {
  node: ICCEditorNodeRef;
  clearNodeEffects: () => void;
} {
  const node = reactive({}) as ICCEditorNodeRef;
  const updateNode = async (id: string) => {
    const res = await getNodeById(id);
    Object.assign(node, res);
  };
  const onNodeChange = (_: string, id: string) => updateNode(id);
  Editor.Message.addBroadcastListener('selection:select', onNodeChange);
  Editor.Message.addBroadcastListener('scene:change-node', updateNode);
  const clearNodeEffects = () => {
    Editor.Message.removeBroadcastListener('selection:select', onNodeChange);
    Editor.Message.removeBroadcastListener('scene:change-node', updateNode);
  };
  const ids = Editor.Selection.getSelected('node');
  if (ids.length) {
    updateNode(ids[0]);
  }
  return { node, clearNodeEffects };
}

function generateNodeFormData(node: ICCEditorNode) {
  return EDITOR_NODE_PROPS.reduce((obj, prop) => {
    if (node[prop]) {
      obj[prop] = node[prop].value;
    }
    return obj;
  }, {} as Record<ICCEditorNodeProps, any>);
}

function recursiveProperties(target: Record<string, any>): Record<string, any> {
  return Object.entries(target).reduce((obj, [key, value]) => {
    const type = typeof value;
    const isObj = type === 'object';
    const isNumber = type === 'number';
    if (isObj) {
      obj[key] = recursiveProperties(value);
      return obj;
    }
    if (isNumber) {
      obj[key] = {
        title: key,
        type,
        minimum: -100,
        maximum: 100,
        'ui:options': {
          widget: 'el-slider',
        },
      };
      return obj;
    }
    obj[key] = {
      title: key,
      type,
    };
    return obj;
  }, {} as Record<string, any>);
}

function generateNodeFormScheam(node: ICCEditorNodeRef) {
  const schema: Record<string, any> = {
    title: '节点编辑器面板',
    type: 'object',
  };
  const properties: Record<string, any> = {};
  EDITOR_NODE_PROPS.forEach((key) => {
    const item = node[key];
    if (item) {
      const enumList = 'enumList' in item ? item.enumList : null;
      const type = typeof item.value;
      const isNumber = type === 'number';
      const obj: Record<string, any> = {
        title: item.displayName,
        type: isNumber ? 'integer' : type,
        default: item.default,
      };
      if (type === 'object') {
        obj.properties = recursiveProperties(item.default);
      }
      if (enumList) {
        const value: any[] = [];
        const names: string[] = [];
        enumList.forEach((it) => {
          value.push(it.value);
          names.push(it.name);
        });
        obj.enum = value;
        obj.enumNames = names;
      }
      properties[key] = obj;
    }
  });
  schema.properties = properties;
  return schema;
}

export function useUpdateNodeProps(node: ICCEditorNodeRef) {
  let updatePromise: Promise<any> = Promise.resolve();
  return async function updateNodeProps(
    nv: Record<ICCEditorNodeProps, any>,
    ov: Record<ICCEditorNodeProps, any>
  ) {
    await updatePromise;
    const updateProps: ICCEditorNodeProps[] = Object.keys(nv).filter(
      // @ts-ignore
      (key: ICCEditorNodeProps) => {
        return !isEqual(nv[key], ov[key]);
      }
    );
    const updateTasks = updateProps.map((prop) => {
      const params = {
        uuid: node.uuid.value,
        path: prop,
        dump: {
          type: node[prop].type,
          value: toRaw(nv[prop]),
        },
      };
      return Editor.Message.request('scene', 'set-property', params)
        .then((res) => {
          console.log(`update ${prop} success`, res);
        })
        .catch((error) => {
          console.log(`update ${prop} error`, error);
        });
    });
    updatePromise = Promise.all(updateTasks);
  };
}

export function useNodeForm(node: ICCEditorNodeRef): {
  data: INodeFormData;
  schema: ComputedRef<Record<string, any>>;
  uiSchema: UnwrapNestedRefs<Record<string, any>>;
} {
  const updateNodeProps = useUpdateNodeProps(node);
  const data = computed({
    get: () => generateNodeFormData(node),
    set: (nv) => {
      updateNodeProps(nv, data.value);
    },
  });
  const schema = computed(() => generateNodeFormScheam(node));
  const uiSchema = reactive({});
  console.log('useNodeForm', { data, schema, uiSchema, node });
  return { data, schema, uiSchema };
}
