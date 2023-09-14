import request from '@/utils/request'

// 获取用户sso日志
export function getSsoLog(params) {
  return request({
    url: '/ops/api/v1/userlog/getSsoLog',
    method: 'get',
    params
  })
}

// 获取用户子系统sso日志
export function getSubSystemLog(params) {
  return request({
    url: '/ops/api/v1/userlog/getSubSystemLog',
    method: 'get',
    params
  })
}

// export function dingLogin(params) {
//   return request({
//     url: '/ops/api/v1/user/ding_callback',
//     method: 'get',
//     params
//   })
// }
