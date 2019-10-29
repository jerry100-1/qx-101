import '@babel/polyfill'
import 'reset-css'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import filters from '@/utils'
import config from '@/config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })

Vue.component('font-awesome-icon', FontAwesomeIcon)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$config = config

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
