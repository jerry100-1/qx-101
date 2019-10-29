import { loginByUsername } from '@/api/login'
import { fetchUserinfo, logout } from '@/api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: null,
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const authToken = getToken()
      if (!authToken) {
        return new Promise((resolve, reject) => {
          loginByUsername(userInfo).then(res => {
            const data = res.data
            if (data.Status === 200) {
              commit('SET_USER', data.Result)
              commit('SET_TOKEN', data.Result.auth)
              setToken(data.Result.auth)
            }
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      }
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.user) {
          return resolve()
        }
        fetchUserinfo().then(response => {
          const data = response.data
          if (data.Status === 200) {
            commit('SET_USER', data.Result.admin_info)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          dispatch('FedLogOut').then(() => resolve())
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        commit('DEL_ALL_VIEWS')
        commit('DEL_ALL_REPORT_FILTERS')
        commit('DEL_ALL_GZH_OPTIONS')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
