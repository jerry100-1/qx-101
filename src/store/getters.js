const getters = {
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  cachedIframes: state => state.tagsView.cachedIframes,
  currentPage: state => state.tagsView.currentPage,
  token: state => state.user.token,
  user: state => state.user.user,
  menu: state => state.permission.menu,
  scrollPosition: state => state.scrollBehavior.scrollPosition,
  agentRawData: state => state.report.agentRawData,
  sceneRawData: state => state.report.sceneRawData,
  areaRawData: state => state.report.areaRawData,
  employeeRawData: state => state.report.employeeRawData,
  containerHeight: state => state.view.containerHeight,
  history: state => state.view.history,
  wxGroup: state => state.gzh.wxGroup,
  wxAccountTypes: state => state.gzh.wxAccountTypes,
  gzhData: state => state.gzh.gzhData
}
export default getters
