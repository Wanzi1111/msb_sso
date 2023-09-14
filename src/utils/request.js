import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import moment from 'moment'
import { getToken, setToken } from '@/utils/auth'
import { refreshToken } from '@/api/common'

let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组
// const verifyTime = (time) => moment().unix() >= time + 60 * 60 * 24

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // do something before request is sent
    const url = config.url
    // const expirationTime = getToken('expirationTime')
    const Authorization = getToken('Authorization')
    // if (verifyTime(~~expirationTime) && !url.includes('/user/ding_callback')) {
    //   MessageBox.confirm(
    //     '您的账户已失效，请重新登录',
    //     '账户失效',
    //     {
    //       confirmButtonText: '重新登录',
    //       showClose: false,
    //       distinguishCancelAndClose: true,
    //       closeOnPressEscape: false,
    //       closeOnClickModal: false,
    //       showCancelButton: false,
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     store.dispatch('user/resetToken').then(() => {
    //       location.reload()
    //     })
    //   })
    //   throw new Error('登录过期')
    // }

    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: true
    })

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken('token')
    }
    config.headers['openId'] = getToken('openId')
    config.headers['userid'] = getToken('userid')
    if (Authorization) {
      config.headers['Authorization'] = Authorization
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const url = response.config.url
    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: false
    })
    const res = response.data

    // console.log('response', response)
    // if the custom code is not 20000, it is judged as an error.
    // aliyuncs.com
    if (response.status === 200) {
      // 200: 正常状态码
      if (
        res.status === 0 ||
        res.code === 200 ||
        res.code === 0 ||
        response.request.responseType === 'blob'
      ) {
      // 业务代码判断response.data.status === 0为正常
        return res
      } else {
        // 业务逻辑错误
        // 登录错误提示需特殊统一处理
        // if (!url.includes('/login/dinglogin')) {
        if (res.code === 401) {
          MessageBox.confirm(
            '您的账户已失效，您可以取消以停留在此页，或重新登录',
            '账户失效',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        } else {
          Message.closeAll()
          Message({
            message: res.data || res.msg || res.message || res.errors || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
        // }
      }
    } else {
      Message.closeAll()
      Message({
        message: res.msg || res.message || res.errors || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(res)
  },
  error => {
    const url = error.config ? error.config.url : ''
    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: false
    })
    if (error.response && error.response.status === 401) {
      // 401: 用户信息失效
      // MessageBox.confirm(
      //   '您的账户已失效，您可以取消以停留在此页，或重新登录',
      //   '账户失效',
      //   {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // ).then(() => {
      //   store.dispatch('user/resetToken').then(() => {
      //     location.reload()
      //   })
      // })

      if (error.response.status === 401 && !error.config.url.includes('/v1/token_get')) {
        const { config } = error
        if (!isRefreshing) {
          isRefreshing = true
          return refreshToken().then(res => {
            const access_token = res.data
            setToken('Authorization', access_token)
            config.headers.Authorization = `${access_token}`
            // token 刷新后将数组的方法重新执行
            requests.forEach((cb) => cb(access_token))
            requests = [] // 重新请求完清空
            return service(config)
          }).catch(err => {
            console.log('抱歉，您的登录状态已失效，请重新登录！')
            return Promise.reject(err)
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          // 返回未执行 resolve 的 Promise
          return new Promise(resolve => {
            // 用函数形式将 resolve 存入，等待刷新后再执行
            requests.push(token => {
              config.headers.Authorization = `${token}`
              resolve(service(config))
            })
          })
        }
      }
    } else {
      // 500: 服务器错误
      Message.closeAll()
      if (error.message !== '请求取消') {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
