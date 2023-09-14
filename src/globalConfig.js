/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-10-29 20:55:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-11-06 17:33:16
 */

import router from './router'
import store from './store'

router.beforeEach(async(to, from, next) => {
  // const adConfigPath = [
  //   '/advert/put',
  //   '/advert/put/create',
  //   '/advert/ad-position',
  //   '/advert/put-log',
  //   '/advert/materiel',
  //   '/ad-center/ad-position-new',
  //   '/ad-center/ad-put'
  // ]
  // const opConfigPath = ['/advert/Operat']
  const mallConfigPath = [
    '/points-mall/mall-admin',
    '/points-mall/classified-admin',
    '/points-mall/order-admin',
    '/points-mall/create-good'
  ]
  // if (adConfigPath.includes(to.path)) {
  //   await store.dispatch('app/getAdConfig')
  // } else if (opConfigPath.includes(to.path)) {
  //   await store.dispatch('app/getOperatConfig')
  // } else if (mallConfigPath.includes(to.path)) {
  //   await store.dispatch('app/getMallConfig')
  // }
  if (mallConfigPath.includes(to.path)) {
    await store.dispatch('app/getMallConfig')
  }
  next()
})
