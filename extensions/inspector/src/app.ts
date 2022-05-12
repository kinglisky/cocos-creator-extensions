import { createApp, Ref } from 'vue';
import ElementPlus from 'element-plus'; //引入element-plus库

import 'element-plus/dist/index.css?style-provider'; //引入element-plus样式

import App from './App.vue';

export function create(nodeId: Ref<string>) {
  const app = createApp(App);
  app.provide('nodeId', nodeId);
  app.use(ElementPlus); //全局注册element-plus
  return app;
}
