import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入axios数据请请求
import axios from 'axios'
import VueAxios from 'vue-axios'

// 引入element-ui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.use(VueAxios, axios)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
