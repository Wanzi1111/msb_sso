import { dingLogin, mobileLogin, logout } from '@/api/login/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import moment from 'moment'

const checkAdmin = (uid) => uid
  ? ['kzYIW9QiiwMedrwdoHd3LugiEiE', 'ItjtSInyR9iSUUKI4xqEcpAiEiE', '8rDIK1oYPD8X7iiviSXGyCAwiEiE', 'Rpb5B2SUUfXcgASZrYeHvwiEiE', 'FCcdAEF5LNYX7iiviSXGyCAwiEiE', 'wHUujfdEXom1qViP84LJ54QiEiE', 'kzYIW9QiiwMedrwdoHd3LugiEiE'].includes(uid)
  : false

const state = {
  token: getToken('token'),
  name: getToken('cname'),
  phone: getToken('phone'),
  avatar: getToken('avatar'),
  introduction: '',
  isAdmin: checkAdmin(getToken('unionId')) || false,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  }
}

const actions = {
  // user login
  login({ commit }, { payload, type }) {
    return new Promise((resolve, reject) => {
      const login = type === 'ding' ? dingLogin : mobileLogin
      login(payload)
        .then(res => {
          if (res.code === 200) {
            // if (!res.data.login_permission_code) {
            //   reject('抱歉，您无权限登录此平台～')
            //   return
            // }
            // - ***** - ***** - ***** -
            // 这里将登陆进来的用户，默认走了一个 admin-token 的权限
            // 现在无权限，后面有权限后，再修改这里的逻辑，这里的权限，关乎路由页面的权限
            // - ***** - ***** - ***** -
            console.log('login success', res)
            const { avatarUrl, mobile, nick, openId, unionId } = res.data
            // commit('SET_TOKEN', 'admin-token')
            setToken('token', 'admin-token')
            commit('SET_AVATAR', avatarUrl)
            commit('SET_NAME', nick)
            commit('SET_PHONE', mobile)
            commit('SET_ADMIN', checkAdmin(unionId))
            setToken('openId', openId || '')
            setToken('unionId', unionId || '')
            // setToken('releasePermissionCode', res.data.release_permission_code)
            setToken('cname', nick || '')
            setToken('mobile', mobile || '')
            setToken('avatar', avatarUrl || '')
            // setToken('expirationTime', moment().unix())
            resolve()
          }
        }).catch(error => {
          console.log('【error】', error)
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // - ***** - ***** - ***** -
      // 每当需要鉴权时，获取权限，可以在登录actions中设置
      // - ***** - ***** - ***** -

      const data = {
        roles: ['admin'], // 控制路由权限
        introduction: '',
        avatar: getToken('avatar'),
        name: getToken('cname'),
        phone: getToken('phone')
      }
      commit('SET_ROLES', data.roles)
      commit('SET_NAME', data.name)
      commit('SET_AVATAR', data.avatar)
      commit('SET_PHONE', data.phone)
      commit('SET_INTRODUCTION', data.introduction)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // - ***** - ***** - ***** -
      // 退出登录，清空token和权限，重置路由权限
      // - ***** - ***** - ***** -
      logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          commit('SET_PHONE', '')
          commit('SET_AVATAR', '')
          removeToken('token')
          removeToken('cname')
          removeToken('phone')
          removeToken('userId')
          removeToken('avatar')
          removeToken('userid')
          removeToken('sessionid')
          resetRouter()
    
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('token')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken('token', token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
