const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  loginUserInfo: state => state.user.loginUserInfo,
  btnPermission: state => state.user.btnPermission,
  addRouters: state => state.permission.addRouters,
  permission_routes: state => state.permission.routers,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
