import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App.vue'
import store from './store'
import router from './router/routers'

import './assets/icons'
import './router/index'
import 'echarts-gl'
import vueCron from 'vue-cron'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

const socket = io('ws://localhost:9999', {
  transports: ['websocket']
});

Vue.use(VueSocketIOExt, socket)
Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(Element, {
  size: Cookies.get('size') || 'small'
})
Vue.use(vueCron)

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
