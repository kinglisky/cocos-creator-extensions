import { App, ref } from 'vue';
import { create } from './app';
// @ts-ignore
import elementPlusStyles from 'element-plus/dist/index.css?row';
// @ts-ignore
// 单文件所有样式
import allStyle from `virtual:style-provider?query=*`; 

let app: App<Element> | null = null;

const template = `<div id="app"></div>`;
const style = elementPlusStyles.replaceAll(':root', ':host');
const $ = {
  app: '#app',
};

module.exports = Editor.Panel.define({
  template,
  style,
  $,
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

    allStyle(this.$.app.parentNode).mount();
    if (!app) {
      app = create();
      app.mount(this.$.app);
    }
  },

  close() {
      console.log('close');
  },
});
