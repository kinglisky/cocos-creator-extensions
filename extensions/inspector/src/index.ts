import { App, ref } from 'vue';
import { create } from './app';
// 所有样式
import allStyle from `virtual:style-provider?query=*`;

let app: App<Element> | null = null;

const template = `<div id="app"></div>`;
const style = ``;
const $ = {
  app: '#app',
};

const nodeId = ref('');

function updateSelectedNodeId(type: string, id: string) {
  nodeId.value = id;
}

module.exports = Editor.Panel.define({
  template,
  style,
  $,
  methods: {},
  listeners: {
    show(...args) {
      console.log('show', args);
    },
    hide(...args) {
      console.log('hide', args);
    },
  },

  update(...args) {
    console.log('update', args);
  },

  async ready(...args) {
    console.log('ready', args);
    if (this.$.app) {
      allStyle(this.$.app.parentNode).mount();
      if (!app) {
        app = create(nodeId);
        app.mount(this.$.app);
        Editor.Message.addBroadcastListener(
          'selection:select',
          updateSelectedNodeId
        );
        if (!nodeId.value) {
          const nodeIds = await Editor.Selection.getSelected('node');
          if (nodeIds.length) {
            updateSelectedNodeId('node', nodeIds[0]);
          }
        }
      }
    }
    
  },

  close() {
    Editor.Message.removeBroadcastListener(
      'selection:select',
      updateSelectedNodeId
    );
  },
});
