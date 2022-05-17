import { createApp } from 'vue';
import ElementPlus from 'element-plus'; //引入element-plus库
import App from './App.vue';
// @ts-ignore
import elementPlusStyleProvider from 'element-plus/dist/index.css?style-provider';
// @ts-ignore
// 单文件所有样式
import allStyleProvider from `virtual:style-provider?query=*`;

export function create(root: HTMLElement, isMountShadowRoot: boolean = true) {
  if (isMountShadowRoot) {
    elementPlusStyleProvider(document.head).mount();
    allStyleProvider(root.parentNode).mount();
  } else {
    allStyleProvider(document.head).mount();

  }
    const app = createApp(App);
    app.use(ElementPlus); //全局注册element-plus
    app.mount(root);
    return app;
}
