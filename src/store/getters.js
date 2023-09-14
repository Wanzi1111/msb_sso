/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-10-29 20:55:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-15 17:00:50
 */

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  adConfig: state => state.app.adConfig,
  mallConfig: state => state.app.mallConfig,
  operatConfig: state => state.app.operatConfig,
  bizLine: state => state.app.bizLine,
  labelData: state => state.app.labelData,
  btnName: state => state.app.btnName,
  loadings: state => state.loading.loadings,
  user: state => state.user,
  refreshProjectFlag: state => state.global.refreshProjectFlag,
  isAdmin: state => state.user.isAdmin,
  bindFromProject: state => state.global.bindFromProject
}
export default getters
