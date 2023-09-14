/*
 * @Author: yelei
 * @Date: 2021-01-18 11:22:46
 * @LastEditors: yelei
 * @LastEditTime: 2021-01-23 15:50:21
 * @Description: 起本地服务时默认为org对象，其它环境的代理对象会根据 package.json中的--mode后台的变量，打包构建时自行识别~
 */

module.exports = {
  dev: {
    '/ops': {
      target: 'https://resso-dev.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/ops': ''
      }
    }
  },
  test: {
    '/ops': {
      target: 'https://resso-test.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/ops': ''
      }
    }
  },
  product: {
    '/ops': {
      target: 'https://resso.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/ops': ''
      }
    }
  }
}
