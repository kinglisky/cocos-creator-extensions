import { ref } from 'vue';
import { create } from './app';
import allStyle from `virtual:style-provider?query=*`;

const app = create(ref(''));
app.mount('#app');
allStyle(document.head).mount();