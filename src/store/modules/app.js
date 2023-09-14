import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
    // showSlidebar: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  adConfig: null,
  operatConfig: null,
  bizLine: null, // 问卷中心 获取业务线和问卷类型
  labelData: null,
  mallConfig: null,
  btnName: '新增'
}

const mutations = {
  SET_BTNNAME: (state, res) => {
    state.btnName = res
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_CONFIG: (state, res) => {
    state.adConfig = res
  },
  SET_OPERAT: (state, res) => {
    state.operatConfig = res
  },
  SET_BIZLINE: (state, res) => {
    state.bizLine = res
  },
  SET_LABEL: (state, res) => {
    state.labelData = res
  },
  SET_MALL: (state, res) => {
    state.mallConfig = res
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
