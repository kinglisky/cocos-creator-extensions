import { ref } from 'vue';
import { create } from './app';
import 'element-plus/dist/index.css';

const app = create(ref(''));
app.mount('#app');
