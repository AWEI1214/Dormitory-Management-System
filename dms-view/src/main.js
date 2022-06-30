import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import router from './router'
import App from './App';
import 'ant-design-vue/dist/antd.css';


const app = createApp(App);

app.use(router).use(Antd).mount('#app');