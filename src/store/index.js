import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import scrollBehavior from './modules/scrollBehavior'
import tagsView from './modules/tagsView'
import user from './modules/user'
import report from './modules/report'
import view from './modules/view'
import gzh from './modules/gzh'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    permission,
    scrollBehavior,
    tagsView,
    user,
    report,
    view,
    gzh
  },
  getters
})

export default store
