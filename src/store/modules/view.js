const view = {
  state: {
    containerHeight: 0,
    history: new Map()
  },
  mutations: {
    SET_CONTAINER_HEIGHT: (state, height) => {
      state.containerHeight = height
    },
    RECORD_HISTORY: (state, payload) => {
      if (state.history.has(payload.window)) {
        const historyArr = state.history.get(payload.window)
        historyArr.push(payload.url)
        if (historyArr.length > 2) {
          historyArr.shift()
        }
      } else {
        state.history.set(payload.window, [payload.url])
      }
    }
  },
  actions: {
    setContainerHeight ({ commit }, height) {
      commit('SET_CONTAINER_HEIGHT', height)
    },
    recordHistory ({ commit }, payload) {
      commit('RECORD_HISTORY', payload)
    }
  }
}

export default view
