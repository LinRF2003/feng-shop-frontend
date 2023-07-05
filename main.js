import App from './App'




// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


// 引入封装 uni.request 的文件
import Request from "@/utils/Request.js";
Vue.prototype.$Request = Request;

// 全局引入 uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 引入基础imgUrl
import {ImageUrl} from '@/utils/config.js';
Vue.prototype.$ImageUrl = ImageUrl;

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif