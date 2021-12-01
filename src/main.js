import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入axios数据请请求
import axios from 'axios'
import VueAxios from 'vue-axios'

// 将时间戳转日期格式的过滤器
Vue.filter('dateFormat', (dataStr) => {
  var time = new Date(dataStr);

  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str;
    }
    return str
  }
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s);
})


// 引入element-ui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入富文本框
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)

Vue.use(ElementUI);

Vue.use(VueAxios, axios)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
