/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-08-26 16:46:10
 * @LastEditors: ZhangYeLei
 * @LastEditTime: 2022-04-06 11:32:44
 */
module.exports = {
  version: '1.3.0.0',
  title: '统一登录平台',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
  // dsn: 'https://e5ce83c264d74547a3266007a0b7fa6e@sentry.meishubao.com/3'
}
