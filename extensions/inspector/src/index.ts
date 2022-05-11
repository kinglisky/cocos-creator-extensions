import { create } from './app';

const template = `<div id="app"></div>`;
const style = ``;
const $ = {
  app: '#app',
};

module.exports = Editor.Panel.define({
  template,
  style,
  $,
  ready() {
    if (this.$.app) {
      const app = create();
      app.mount(this.$.app);
    }
  },
  close() {},
});
