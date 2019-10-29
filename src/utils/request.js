import axios from 'axios'
import conf from '@/config'
import store from '@/store'
import swal from 'sweetalert2'
import md5 from 'md5'

let isLogoutMessageDisplayed = false

// 创建axios实例
const service = axios.create({
  baseURL: conf.BASE_API + '/' + conf.VERSION, // api的base_url
  timeout: 0 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers['AUTH'] = store.getters.token
    }
    const time = parseInt(Date.now() / 1000)
    const hash = process.env.NODE_ENV === 'production' ? md5(conf.APPKEY + conf.VERSION + config.url + conf.APPID + conf.DEVICEID + conf.CHANNEL + time) : 'test'
    config.params = Object.assign({}, config.params, {
      deviceid: conf.DEVICEID,
      appid: conf.APPID,
      hash: hash,
      channel: conf.CHANNEL,
      time: time
    })
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    const data = response.data
    if (data && data.Status === 552) {
      swal({
        text: data.Result.ErrorMsg,
        type: 'error',
        timer: 1500,
        showConfirmButton: false
      })
      return Promise.reject(new Error(data.Result.ErrorMsg))
    } else if (data && (data.Status === 551 || data.Status === 553)) {
      if (!isLogoutMessageDisplayed) {
        isLogoutMessageDisplayed = true
        swal({
          text: data.Result.ErrorMsg, // '你已被登出，可以取消继续留在该页面，或者重新登录',
          type: 'warning',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '重新登录',
          cancelButtonText: '取消'
        }).then(res => {
          isLogoutMessageDisplayed = false
          if (res.value) {
            store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          }
        })
      }
      return Promise.reject(new Error(data.Result.ErrorMsg))
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error)// for debug
    swal({
      text: error.message,
      type: 'error',
      timer: 5000,
      showConfirmButton: false
    })
    return Promise.reject(error)
  }
)

export default service
