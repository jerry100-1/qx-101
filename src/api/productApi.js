import request from '@/utils/request'
import qs from 'qs'

export default {
  // 订单列表
  getOrderList (data) {
    return request({
      url: 'Admin/Fortune/orderList',
      method: 'get',
      params: data
    })
  },
  // 订单分类
  getOrderTypeList (data) {
    return request({
      url: 'Admin/Fortune/fetchOrderTypeList',
      method: 'get',
      params: data
    })
  },
  // 订单详情  id
  getOrderDetail (id) {
    return request({
      url: 'Admin/Fortune/getOrderInfo',
      method: 'get',
      params: { id: id }
    })
  },
  // 订单退款
  orderRefund (id) {
    return request({
      url: 'Admin/Fortune/orderRefund',
      method: 'post',
      data: qs.stringify({ id: id })
    })
  },
  // 用户列表
  getUserList (data) {
    return request({
      url: 'Admin/Fortune/getProductUserList',
      method: 'get',
      params: data
    })
  },
  // 获取banner列表
  fetchBannerList (data) {
    return request({
      url: 'Admin/Fortune/fetchBannerList',
      method: 'get',
      params: data
    })
  },
  // 新增banner
  postBanner (data) {
    return request({
      url: 'Admin/Fortune/postBanner',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 修改banner
  editBanner (data) {
    return request({
      url: 'Admin/Fortune/editBanner',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取虚拟数据列表
  virtualOrderList (data) {
    return request({
      url: 'Admin/Fortune/virtualOrderList',
      method: 'get',
      params: data
    })
  },
  // 新增虚拟数据
  postVirtualOrder (data) {
    return request({
      url: 'Admin/Fortune/postVirtualOrder',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 修改虚拟数据
  editVirtualOrder (data) {
    return request({
      url: 'Admin/Fortune/editVirtualOrder',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取产品列表
  getProductList (data) {
    return request({
      url: 'Admin/Fortune/fetchProductList',
      method: 'get',
      params: data
    })
  },
  // 修改产品
  editProduct (data) {
    return request({
      url: 'Admin/Fortune/editProduct',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 产品分类
  getProductType () {
    return request({
      url: 'Admin/Fortune/fetchProductType',
      method: 'get'
    })
  },
  // 产品详情
  getProductInfo (data) {
    return request({
      url: 'Admin/Fortune/getProductInfo',
      method: 'get',
      params: data
    })
  },
  // 获取大师数据列表
  getMasterList (data) {
    return request({
      url: 'Admin/Master/getList',
      method: 'get',
      params: data
    })
  },
  // 修改大师状态
  editMasterStatus (data) {
    return request({
      url: 'Admin/Master/changeStatus',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 获取分享配置列表
  getShareConfigList (data) {
    return request({
      url: 'Admin/Fortune/getShareConfig',
      method: 'get',
      params: data
    })
  },
  // 新增分享配置
  addShareConfig (data) {
    return request({
      url: 'Admin/Fortune/postShareConfig',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 修改分享配置
  editShareConfig (data) {
    return request({
      url: 'Admin/Fortune/updateShareConfig',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
