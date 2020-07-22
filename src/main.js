import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import 'vue2-org-tree/dist/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'
import Vue2OrgTree from 'vue2-org-tree';
import VueTinymce from "@packy-tang/vue-tinymce"
import '@/styles/index.scss' // global css
import '@/styles/btn.scss' // global css
import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import {hasPermission} from './utils/hasPermission' //new add
import { Message, MessageBox } from 'element-ui'

Vue.use(ElementUI, { locale })
Vue.use(Vue2OrgTree)
Vue.use(VCharts)
Vue.use(VueTinymce)
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$Message = Message;
Vue.config.productionTip = false
Vue.prototype.hasPerm = hasPermission

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
