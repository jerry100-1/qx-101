const scrollBehavior = {
  state: {
    scrollPosition: {}
  },
  mutations: {
    SET_SCROLL_POSITION: (state, payload) => {
      state.scrollPosition[payload.page] = payload.pos
    },
    DEL_SCROLL_POSITION: (state, page) => {
      delete state.scrollPosition[page]
    },
    DEL_OTHERS_SCROLL_POSITION: (state, page) => {
      const newScrollPosition = {}
      for (const url in state.scrollPosition) {
        if (url === page) {
          newScrollPosition[url] = state.scrollPosition[url]
          break
        }
      }
      state.scrollPosition = newScrollPosition
    },
    DEL_ALL_SCROLL_POSITION: (state) => {
      state.scrollPosition = {}
    }
  },
  actions: {
    setScrollPosition ({ commit }, payload) {
      commit('SET_SCROLL_POSITION', payload)
    },
    delScrollPosition ({ commit }, page) {
      commit('DEL_SCROLL_POSITION', page)
    }
  }
}

export default scrollBehavior
