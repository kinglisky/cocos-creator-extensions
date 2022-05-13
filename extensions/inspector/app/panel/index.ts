import { App, ref } from 'vue';
import { create } from './app';
// @ts-ignore
import elementPlusCssContent from 'element-plus/dist/index.css?row';
// @ts-ignore
import elementPlusStyleProvider from 'element-plus/dist/index.css?style-provider';
// @ts-ignore
// 单文件所有样式
import sfcStyleProvider from `virtual:style-provider?query=*`;

let app: App<Element> | null = null;

const style = elementPlusCssContent.replaceAll(':root', ':host');

module.exports = Editor.Panel.define({
  template: `<div id="app"></div>`,
  style,
  $: {
    app: '#app',
  },
  methods: {},
  listeners: {
    show() {
      console.log('show');
    },
    hide() {
      console.log('hide');
    },
  },

  update() {
    console.log('update');
  },

  async ready() {
    console.log('ready');
    if (!this.$.app) return;
    elementPlusStyleProvider(document.head).mount();
    sfcStyleProvider(this.$.app.parentNode).mount();
    if (!app) {
      app = create();
      app.mount(this.$.app);
    }
  },

  close() {
      console.log('close');
  },
});
