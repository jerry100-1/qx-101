import request from '@/utils/request'
import qs from 'qs'

export default {
  // 账户列表
  getUserList (data) {
    return request({
      url: 'Admin/PushingerNew/getList',
      method: 'get',
      params: data
    })
  },
  // 账户列表
  getWithDrawList (data) {
    return request({
      url: 'Admin/CashLog/getPageList',
      method: 'get',
      params: data
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
  // 确认打款
  withdrawPay (params) {
    return request({
      url: 'Admin/CashLog/enterprisePay',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 获取推手数据统计列表
  getDayStatList (data) {
    return request({
      url: 'Admin/DayStatPushinger/getPageList',
      method: 'get',
      params: data
    })
  },
  // 获取每日数据统计列表
  getDayStatGlobalList (data) {
    return request({
      url: 'Admin/DayStatGlobal/getPageList',
      method: 'get',
      params: data
    })
  },
  // 获取推手收益列表
  getIncomeList (data) {
    return request({
      url: 'Admin/Order/getPageList',
      method: 'get',
      params: data
    })
  }
}
