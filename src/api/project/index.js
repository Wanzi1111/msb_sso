import request from '@/utils/request'

// 可跳转项目列表
export function getSubService(params) {
  return request({
    url: '/ops/api/v1/sub_service/user_services',
    method: 'get',
    params
  })
}

// 可绑定项目列表
export function getAllSubService(params) {
  return request({
    url: '/ops/api/v1/sub_service/list_all_service',
    method: 'get',
    params
  })
}

// 获取短信验证码
export function getSmsCode(data) {
  return request({
    url: '/ops/api/v1/sub_service/binding_code',
    method: 'post',
    data
  })
}

// 绑定项目
export function bindingProject(data) {
  return request({
    url: '/ops/api/v1/sub_service/binding',
    method: 'post',
    data
  })
}

// 项目解绑
export function unBindingProject(data) {
  return request({
    url: '/ops/api/v1/sub_service/unbinding',
    method: 'post',
    data
  })
}

// 项目跳转
export function gotoJump(params) {
  return request({
    url: '/ops/api/v1/token/authcode',
    method: 'get',
    params
  })
}
