const mixinFile = require.context('./', true, /\.js$/)
let mixinList = {}
mixinFile.keys().reduce((modules, modulePath) => {
  if (modulePath !== './index.js') {
    const mixin = mixinFile(modulePath)
    mixinList = {
      ...mixinList,
      [modulePath.slice(2, -3)]: mixin.default
    }
  }
}, {})

export default mixinList
