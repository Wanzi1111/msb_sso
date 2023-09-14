const apiFile = require.context('./', true, /\.js$/)
let apiList = {}
const repeatNames = []

for (const modulePath in apiFile.keys()) {
  const api = apiFile(apiFile.keys()[modulePath])
  for (const i in api) {
    if (api[i]) {
      const fcName = api[i].toString().match(/function\s*([^(]*)\(/)[1]
      if (fcName in apiList) {
        repeatNames.push(fcName)
        break
      }
    }
  }
  apiList = {
    ...apiList,
    ...api
  }
}

// apiFile.keys().reduce((modules, modulePath) => {
//   const api = apiFile(modulePath)
//   for (const i in api) {
//     if (api[i]) {
//       const fcName = api[i].toString().match(/function\s*([^(]*)\(/)[1]
//       if (fcName in apiList) {
//         repeatNames.push(fcName)
//         return
//       }
//     }
//   }
//   apiList = {
//     ...apiList,
//     ...api
//   }
// }, {})

if (repeatNames.length) {
  throw new Error(`Api名称重复设置，请重命名${repeatNames.join('、')} Api`)
}

export default apiList
