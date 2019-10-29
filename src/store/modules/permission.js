import { fetchMenu } from '@/api/index'

const permission = {
  state: {
    menu: null
  },
  mutations: {
    SET_MENU: (state, menu) => {
      state.menu = menu
    }
  },
  actions: {
    GetMenu ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        if (state.menu) {
          return resolve()
        }
        fetchMenu().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_MENU', data.Result)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
