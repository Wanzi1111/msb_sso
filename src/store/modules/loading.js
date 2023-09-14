const loading = {}
const apiFile = require.context('@/api', true, /\.js$/)
apiFile.keys().reduce((modules, modulePath) => {
  for (const key in apiFile(modulePath)) {
    const str1 = apiFile(modulePath)[key].toString().split(`url: '`)[1]
    if (str1) {
      const str = str1.split(`',`)[0]
      const strArr = str.replace(/\//g, '_')
      loading[strArr] = false
    }
  }
}, {})

const state = {
  loadings: loading
}

const mutations = {
  SET_LOAD: (state, { key, status }) => {
    console.log(key, status, '请将key放入业务loading中')
    state.loadings = {
      ...state.loadings,
      [key]: status
    }
  }
}

const actions = {
  setLoad({ commit }, { key, status }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOAD', { key, status })
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
