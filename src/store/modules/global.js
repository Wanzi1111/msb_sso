const state = {
  refreshProjectFlag: true, // 改变即刷新list
  bindFromProject: '' // 需要系统弹窗让用户去绑定
}

const mutations = {
  update_project: (state, data) => {
    state.refreshProjectFlag = !state.refreshProjectFlag
  },
  bind_from_project: (state, data) => {
    state.bindFromProject = data
  }
}

const actions = {
  refreshProject({ state, commit }, data) {
    commit('update_project')
  },
  toBindFromProject({ state, commit }, data) {
    commit('bind_from_project', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

