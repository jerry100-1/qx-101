import { getAllWXGroup, getWXAccountTypes, getAllWXAccountList } from '@/api/gzh'

const gzh = {
  state: {
    wxGroup: [],
    wxAccountTypes: {},
    gzhData: []
  },
  mutations: {
    SET_WX_GROUP: (state, data) => {
      state.wxGroup = data
    },
    SET_WX_ACCOUNT_TYPES: (state, data) => {
      state.wxAccountTypes = data
    },
    SET_GZH_DATA: (state, data) => {
      state.gzhData = data
    },
    DEL_ALL_GZH_OPTIONS: (state) => {
      state.wxGroup = []
      state.wxAccountTypes = {}
      state.gzhData = []
    }
  },
  actions: {
    getAllWXGroup ({ dispatch, commit, state }, isForceUpdate = false) {
      return new Promise((resolve, reject) => {
        if (!isForceUpdate && state.wxGroup.length > 0) {
          return resolve()
        }
        getAllWXGroup().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_WX_GROUP', data.Result)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getWXAccountTypes ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.wxAccountTypes && Object.keys(state.wxAccountTypes).length > 0) {
          return resolve()
        }
        getWXAccountTypes().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_WX_ACCOUNT_TYPES', data.Result.List)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllWXAccountList ({ dispatch, commit, state }, isForceUpdate = false) {
      return new Promise((resolve, reject) => {
        if (!isForceUpdate && state.gzhData.length > 0) {
          return resolve()
        }
        getAllWXAccountList().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_GZH_DATA', data.Result)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllGzhOptions ({ dispatch, commit }, payload) {
      return Promise.all([
        dispatch('getAllWXGroup', payload && payload.isForceUpdateGroup),
        dispatch('getWXAccountTypes'),
        dispatch('getAllWXAccountList', payload && payload.isForceUpdateGzh)
      ])
    }
  }
}

export default gzh
