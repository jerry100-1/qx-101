const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: [],
    cachedIframes: [],
    currentPage: '/'
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      state.currentPage = view.path
      let viewExist = false
      for (let i = 0; i < state.visitedViews.length; i++) {
        const v = state.visitedViews[i]
        if (v.path === view.path) {
          state.visitedViews[i] = {
            name: view.name,
            path: view.path,
            fullPath: view.fullPath,
            params: view.params,
            query: view.query,
            title: (view.meta && view.meta.title) || 'no-name'
          }
          viewExist = true
          break
        }
      }
      if (!viewExist) {
        state.visitedViews.push({
          name: view.name,
          path: view.path,
          fullPath: view.fullPath,
          params: view.params,
          query: view.query,
          title: (view.meta && view.meta.title) || 'no-name'
        })
      }
      if (!view.meta.noCache && view.name && !state.cachedViews.includes(view.name)) {
        state.cachedViews.push(view.name)
      }
    },
    ADD_VISITED_IFRAMES: (state, view) => {
      state.currentPage = view.path
      let viewExist = false
      for (let i = 0; i < state.visitedViews.length; i++) {
        const v = state.visitedViews[i]
        if (v.path === view.path) {
          state.visitedViews[i] = {
            name: view.name,
            path: view.path,
            fullPath: view.fullPath
          }
          viewExist = true
          break
        }
      }
      if (!viewExist) {
        state.visitedViews.push({
          name: view.name,
          path: view.path,
          fullPath: view.fullPath
        })
      }
      state.cachedIframes.findIndex(item => item.name === view.name) === -1 && state.cachedIframes.push(view)
    },
    LIMIT_VIEWS: (state) => {
      while (state.visitedViews.length > 10) {
        const removedView = state.visitedViews.shift()
        if (removedView.path.indexOf('.php') > -1) {
          const index = state.cachedIframes.findIndex(item => item.name === removedView.name)
          index > -1 && state.cachedIframes.splice(index, 1)
        } else {
          const index = state.cachedViews.findIndex(item => item === removedView.name)
          index > -1 && state.cachedViews.splice(index, 1)
        }
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      const index = state.cachedViews.findIndex(item => item === view.name)
      index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_VISITED_IFRAMES: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      const index = state.cachedIframes.findIndex(item => item.name === view.name)
      index > -1 && state.cachedIframes.splice(index, 1)
    },
    DEL_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.findIndex(item => item === view.name)
      index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_CACHED_IFRAMES: (state, view) => {
      const index = state.cachedIframes.findIndex(item => item.name === view.name)
      index > -1 && state.cachedIframes.splice(index, 1)
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      if (view.path.indexOf('.php') > -1) {
        const index = state.cachedIframes.findIndex(item => item.name === view.name)
        index > -1 && (state.cachedIframes = state.cachedIframes.slice(index, index + 1))
      } else {
        const index = state.cachedViews.findIndex(item => item === view.name)
        index > -1 && (state.cachedViews = state.cachedViews.slice(index, index + 1))
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
      state.cachedIframes = []
      state.currentPage = '/'
    }
  },
  actions: {
    addVisitedViews ({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
      commit('LIMIT_VIEWS')
    },
    addVisitedIframes ({ commit }, view) {
      commit('ADD_VISITED_IFRAMES', view)
      commit('LIMIT_VIEWS')
    },
    delVisitedViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        commit('DEL_SCROLL_POSITION', view.path)
        resolve([...state.visitedViews])
      })
    },
    delVisitedIframes ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_IFRAMES', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedViews ({ commit }, view) {
      commit('DEL_CACHED_VIEWS', view)
      commit('DEL_SCROLL_POSITION', view.path)
    },
    delCachedIframes ({ commit }, view) {
      commit('DEL_CACHED_IFRAMES', view)
    },
    delOthersViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        commit('DEL_OTHERS_SCROLL_POSITION', view.path)
        resolve([...state.visitedViews])
      })
    },
    delAllViews ({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        commit('DEL_ALL_SCROLL_POSITION')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
