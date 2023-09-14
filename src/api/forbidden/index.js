import request from '@/utils/request'

// 获取禁用用户列表
export function getForbiddenUserList(params) {
  return request({
    url: '/ops/api/v1/forbidden/get_user_list_by_keyword',
    method: 'get',
    params
  })
}

// 获取禁用用户信息
export function getUserInfosByUid(params) {
  return request({
    url: '/ops/api/v1/forbidden/get_user_infos_by_uid',
    method: 'get',
    params
  })
}

// 禁用用户
export function forbiddenUsers(data) {
  return request({
    url: '/ops/api/v1/forbidden/forbidden_users',
    method: 'post',
    data
  })
}

// 接解禁用户
export function openUsers(data) {
  return request({
    url: '/ops/api/v1/forbidden/open_users',
    method: 'post',
    data
  })
}
