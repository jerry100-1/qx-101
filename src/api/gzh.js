import request from '@/utils/request'
import qs from 'qs'

// 获取账号类型集合
export function getWXAccountTypes () {
  return request({
    url: 'Admin/WXAccount/getTypes',
    method: 'get'
  })
}

// 获取公众号列表数据（分页）
export function getWXAccountList (data) {
  return request({
    url: 'Admin/WXAccount/getList',
    method: 'get',
    params: data
  })
}

// 获取公众号列表数据（全部）
export function getAllWXAccountList () {
  return request({
    url: 'Admin/WXAccount/getAll',
    method: 'get'
  })
}

// 获取公众号详情数据
export function getWXAccountInfo (data) {
  return request({
    url: 'Admin/WXAccount/getInfo',
    method: 'get',
    params: data
  })
}

// 添加，更新公众号信息
export function setWXAccountData (data) {
  return request({
    url: 'Admin/WXAccount/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取微信分组所有正常数据
export function getAllWXGroup () {
  return request({
    url: 'Admin/WXGroup/getAll',
    method: 'get'
  })
}

// 获取公众号分组列表数据
export function getWXGroupList (data) {
  return request({
    url: 'Admin/WXGroup/getList',
    method: 'get',
    params: data
  })
}

// 添加，更新公众号分组信息
export function setWXGroupData (data) {
  return request({
    url: 'Admin/WXGroup/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取公众号单条图文数据统计列表数据
export function getWXArticleDataList (data) {
  return request({
    url: 'Admin/WXArticleData/getList',
    method: 'get',
    params: data
  })
}

// 添加，更新单条图文数据统计信息
export function setWXArticleData (data) {
  return request({
    url: 'Admin/WXArticleData/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取公众号全部图文数据统计列表数据
export function getWXTotalArticleDataList (data) {
  return request({
    url: 'Admin/WXTotalArticleData/getList',
    method: 'get',
    params: data
  })
}

// 添加，更新全部图文数据统计信息
export function setWXTotalArticleData (data) {
  return request({
    url: 'Admin/WXTotalArticleData/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取收益项目列表数据（分页）
export function getWXIncomeProjectList (data) {
  return request({
    url: 'Admin/WXIncomeProject/getList',
    method: 'get',
    params: data
  })
}

// 获取收益项目列表数据（全部）
export function getAllWXIncomeProjectList () {
  return request({
    url: 'Admin/WXIncomeProject/getAll',
    method: 'get'
  })
}

// 添加，更新收益项目信息
export function setWXIncomeProjectData (data) {
  return request({
    url: 'Admin/WXIncomeProject/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取公众号各收益项列表数据
export function getWXIncomeDataList (data) {
  return request({
    url: 'Admin/WXIncomeData/getList',
    method: 'get',
    params: data
  })
}

// 添加，更新公众号收益项数据
export function setWXIncomeData (data) {
  return request({
    url: 'Admin/WXIncomeData/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取公众号粉丝数据列表
export function getWXFansDataList (data) {
  return request({
    url: 'Admin/WXFansData/getList',
    method: 'get',
    params: data
  })
}

// 添加，更新公众号粉丝数据
export function setWXFansData (data) {
  return request({
    url: 'Admin/WXFansData/setData',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 公众号单条图文数据统计列表数据
export function getWXArticleDataStat (data) {
  return request({
    url: 'Admin/WXArticleDataStat/getList',
    method: 'get',
    params: data
  })
}

// 公众号单条图文数据统计列表数据
export function getWXTotalArticleData (data) {
  return request({
    url: 'Admin/WXTotalArticleDataStat/getList',
    method: 'get',
    params: data
  })
}

// 获取渠道收益分析列表
export function getWXIncomeStatList (data) {
  return request({
    url: 'Admin/WXIncomeData/getStatList',
    method: 'get',
    params: data
  })
}

// 付费导粉率统计
export function getStatFeesFansIncomeTotalList (data) {
  return request({
    url: 'Admin/WXDayStatFeesFansIncome/getStatTotalList',
    method: 'get',
    params: data
  })
}

// 付费导粉统计
export function getStatFeesFansIncomeList (data) {
  return request({
    url: 'Admin/WXDayStatFeesFansIncome/getStatList',
    method: 'get',
    params: data
  })
}

// 获取所有广告（微信）数据
export function getAllAdvs () {
  return request({
    url: 'Admin/WXDayStatFeesFansIncome/getAllAdvs',
    method: 'get'
  })
}

// 获取所有广告主
export function getAllCustomer () {
  return request({
    url: 'Admin/WXDayStatFeesFansIncome/getAllCustomer',
    method: 'get'
  })
}

// 公众号全部图文数据统计列表数据
export function getWXDayStatDataList (data) {
  return request({
    url: 'Admin/WXDayStatData/getList',
    method: 'get',
    params: data
  })
}
