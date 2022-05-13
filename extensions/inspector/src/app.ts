import { createApp, Ref } from 'vue';
import ElementPlus from 'element-plus'; //引入element-plus库
import App from './App.vue';

export function create() {
  const app = createApp(App);
  app.use(ElementPlus); //全局注册element-plus
  return app;
}
