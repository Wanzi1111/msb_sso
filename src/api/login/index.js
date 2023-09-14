import request from '@/utils/request'

/**
 * 手机号登录
 * @param data
 * @returns {AxiosPromise}
 */
export function mobileLogin(data) {
  return request({
    url: '/ops/api/v1/user/mobile_login',
    method: 'post',
    data
  })
}

// 获取短信验证码
export function sendSms(params) {
  return request({
    url: '/ops/api/v1/user/send_sms',
    method: 'post',
    params
  })
}

export function dingLogin(params) {
  return request({
    url: '/ops/api/v1/user/ding_callback',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/ops/api/v1/user/loginout',
    method: 'get'
  })
}

// https://release-test.meishubao.com
