/*
 * @Author: ZhangYeLei
 * @Date: 2021-10-12 18:37:31
 * @LastEditTime: 2022-04-02 15:00:45
 * @LastEditors: ZhangYeLei
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './globalConfig'

import * as filters from './filters' // global filters

// import * as Sentry from '@sentry/vue'
// import { Integrations } from '@sentry/tracing'
// import { version, dsn } from './settings'

// if (process.env.VUE_APP_SENTRY_ENV === 'prod') {
//   Sentry.init({
//     Vue,
//     dsn,
//     release: `msb-admin-logistics@${version}`,
//     environment: process.env.NODE_ENV,
//     integrations: [new Integrations.BrowserTracing()],
//     tracesSampleRate: 1.0
//   })
// }

import BasicsAction from '@/components/BasicsAction'
import BasicsBlock from '@/components/BasicsBlock'
import BasicsForm from '@/components/BasicsForm'
import BasicsInfo from '@/components/BasicsInfo'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import BasicsTitle from '@/components/BasicsTitle'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.use({
  install: function(Vue) {
    Vue.component('BasicsAction', BasicsAction)
    Vue.component('BasicsBlock', BasicsBlock)
    Vue.component('BasicsForm', BasicsForm)
    Vue.component('BasicsInfo', BasicsInfo)
    Vue.component('BasicsSearch', BasicsSearch)
    Vue.component('BasicsTable', BasicsTable)
    Vue.component('BasicsTitle', BasicsTitle)
  }
})

Vue.prototype.$bus = new Vue()

import Api from '@/api'
Vue.prototype.$api = Api

import mixins from './mixins'
Vue.mixin(mixins.global)
// Vue.prototype.$mixins = mixins;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
// mockXHR()
// }

Vue.use(Element, {
  size: 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
