import { getAllAgent, getAllScene, getAllArea, getAllEmployee } from '@/api/report/common'

const report = {
  state: {
    agentRawData: [],
    sceneRawData: [],
    areaRawData: [],
    employeeRawData: []
  },
  mutations: {
    SET_AGENT: (state, data) => {
      state.agentRawData = data
    },
    SET_SCENE: (state, data) => {
      state.sceneRawData = data
    },
    SET_AREA: (state, data) => {
      state.areaRawData = data
    },
    SET_EMPLOYEE: (state, data) => {
      state.employeeRawData = data
    },
    DEL_ALL_REPORT_FILTERS: (state) => {
      state.agentRawData = []
      state.sceneRawData = []
      state.areaRawData = []
      state.employeeRawData = []
    }
  },
  actions: {
    getAllAgent ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.agentRawData.length > 0) {
          return resolve()
        }
        getAllAgent().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_AGENT', data.Result)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllScene ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.sceneRawData.length > 0) {
          return resolve()
        }
        getAllScene().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_SCENE', Object.values(data.Result).sort((a, b) => a.ParentId - b.ParentId || a.SceneId - b.SceneId))
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllArea ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.areaRawData.length > 0) {
          return resolve()
        }
        getAllArea().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_AREA', Object.values(data.Result).sort((a, b) => a.Level - b.Level || a.Id - b.Id))
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllEmployee ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.employeeRawData.length > 0) {
          return resolve()
        }
        getAllEmployee().then(res => {
          const data = res.data
          if (data.Status === 200) {
            commit('SET_EMPLOYEE', data.Result.List || data.Result)
            resolve()
          } else {
            reject(new Error(data.Result.ErrorMsg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAllReportFilters ({ dispatch, commit }) {
      return Promise.all([
        dispatch('getAllAgent'),
        dispatch('getAllScene'),
        dispatch('getAllArea'),
        dispatch('getAllEmployee')
      ])
    }
  }
}

export default report
