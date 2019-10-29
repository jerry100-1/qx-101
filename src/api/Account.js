import request from '@/utils/request'
import qs from 'qs'

export default {
  // 账户列表
  saleAgentUserList (data) {
    return request({
      url: 'Admin/SaleAgent/list',
      method: 'get',
      params: data
    })
  },
  // 级别
  allGrade () {
    return request({
      url: 'Admin/SaleAgent/allGrade',
      method: 'get'
    })
  },
  // 添加账号
  addAccount (params) {
    return request({
      url: 'Admin/SaleAgent/addSale',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 账号信息
  accountInfo (data) {
    return request({
      url: 'Admin/SaleAgent/saleInfo',
      method: 'get',
      params: data
    })
  },
  // 提现记录
  saleWithdrawLog (data) {
    return request({
      url: 'Admin/SaleAgent/SaleWithdrawLog',
      method: 'get',
      params: data
    })
  },

  // 提现记录
  showConfig () {
    return request({
      url: 'Admin/SaleScaleAdmin/show',
      method: 'get'
    })
  },
  // 上传视频
  uploadVideo (formData) {
    return request.post('Admin/SaleScaleAdmin/setUpload', formData)
  },
  // 上传视频
  uploadImage (formData) {
    return request.post('Admin/File/upload', formData)
  },
  // 提现记录
  setConfig (params) {
    return request({
      url: 'Admin/SaleScaleAdmin/set',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 收益汇总统计
  earningList (params) {
    return request({
      url: 'Admin/SaleCommission/accountlist',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 广告主列表
  getAdUsers () {
    return request({
      url: 'Admin/WeightAdv/getAllCustomer',
      method: 'get'
    })
  },
  // 添加广告
  addAd (params) {
    return request({
      url: 'Admin/WeightAdv/store',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 添加广告配置
  addAdConfig (params) {
    return request({
      url: 'Admin/WeightAdv/storeWeightAdvProcess',
      method: 'post',
      data: qs.stringify(params)
    })
  },

  // 广告列表
  adList (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvList',
      method: 'get',
      params: params
    })
  },

  // 广告列表
  adH5UrlList (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvContentList',
      method: 'get',
      params: params
    })
  },
  // 广告列表
  deleteadH5UrlList (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvContentDelete',
      method: 'get',
      params: params
    })
  },

  // 广告配置列表
  adConfigList (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvProcessList',
      method: 'get',
      params: params
    })
  },

  // 广告详情
  getAdInfo (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvShow',
      method: 'get',
      params: params
    })
  },
  // 广告配置详情
  getAdConfigInfo (params) {
    return request({
      url: 'Admin/WeightAdv/weightAdvProcessShow',
      method: 'get',
      params: params
    })
  },
  // 根据类型获取广告列表
  getAdListWithType (params) {
    return request({
      url: 'Admin/WeightAdv/getWeightAdvByType',
      method: 'get',
      params: params
    })
  },
  getImgsUrlTools (params) {
    return request({
      url: 'Admin/Welcome/getAdQireImgUrl',
      method: 'get',
      params: params
    })
  },
  getStoryImgsUrlTools (params) {
    return request({
      url: 'Admin/Welcome/getAdQireHtmlImg',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 获取百度广告统计
  getBaiduAdStat (params) {
    return request({
      url: 'Admin/DayStatAdvMeipa/getPageList',
      method: 'get',
      params: params
    })
  },
  addDictionary (params) {
    return request({
      url: 'Admin/Dictionary/add',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  editDictionary (params) {
    return request({
      url: 'Admin/Dictionary/edit',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  getDictionaryList (params) {
    return request({
      url: 'Admin/Dictionary/getPageList',
      method: 'get',
      params: params
    })
  },
  getDictionaryInfo (params) {
    return request({
      url: 'Admin/Dictionary/getInfo',
      method: 'get',
      params: params
    })
  },
  // 根据数据字典名称，获取信息
  getInfoByName (data) {
    return request({
      url: 'Admin/Dictionary/getInfoByName',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
