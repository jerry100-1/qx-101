import request from '@/utils/request'
import qs from 'qs'

// 抽奖列表
const getList = params => request({
  url: 'Admin/Turnplate/getList',
  method: 'get',
  params: params
})

// 保存抽奖
const saveRaffle = params => request({
  url: 'Admin/Turnplate/saveRaffle',
  method: 'post',
  data: qs.stringify(params)
})

// 单个抽奖详情
const raffleDeatil = params => request({
  url: 'Admin/Turnplate/raffleDeatil',
  method: 'get',
  params: params
})

// 修改抽奖
const editRaffle = params => request({
  url: 'Admin/Turnplate/editRaffle',
  method: 'post',
  data: qs.stringify(params)
})

// 删除抽奖
const delRaffle = params => request({
  url: 'Admin/Turnplate/delRaffle',
  method: 'post',
  data: qs.stringify(params)
})

// 奖项列表
const getTurnplateList = params => request({
  url: 'Admin/Turnplate/getTurnplateList',
  method: 'get',
  params: params
})

// 保存奖项
const saveTurnplate = params => request({
  url: 'Admin/Turnplate/saveTurnplate',
  method: 'post',
  data: qs.stringify(params)
})

// 单个奖项详情
const turnplateDeatil = params => request({
  url: 'Admin/Turnplate/turnplateDeatil',
  method: 'get',
  data: qs.stringify(params)
})

// 修改奖项
const editTurnplate = params => request({
  url: 'Admin/Turnplate/editTurnplate',
  method: 'post',
  data: qs.stringify(params)
})

// 删除奖项
const delTurnplate = params => request({
  url: 'Admin/Turnplate/delTurnplate',
  method: 'post',
  data: qs.stringify(params)
})

// 广告列表
const getAdList = params => request({
  url: 'Admin/Turnplate/getAdList',
  method: 'get',
  params: params
})

// 保存广告
const saveAd = params => request({
  url: 'Admin/Turnplate/saveAd',
  method: 'post',
  data: qs.stringify(params)
})

// 单个广告详情
const adDeatil = params => request({
  url: 'Admin/Turnplate/adDeatil',
  method: 'get',
  data: qs.stringify(params)
})

// 修改广告
const editAd = params => request({
  url: 'Admin/Turnplate/editAd',
  method: 'post',
  data: qs.stringify(params)
})

// 删除广告
const delAd = params => request({
  url: 'Admin/Turnplate/delAd',
  method: 'post',
  data: qs.stringify(params)
})

// 获取抽奖所有列表
const raffleAll = params => request({
  url: 'Admin/Turnplate/raffleAll',
  method: 'get',
  params: params
})

// 获取奖项所有列表
const turnplateAll = params => request({
  url: 'Admin/Turnplate/turnplateAll',
  method: 'get',
  params: params
})

// 中奖纪录
const raffleLog = params => request({
  url: 'Admin/Turnplate/raffleLog',
  method: 'get',
  params: params
})

const setExpress = params => request({
  url: 'Admin/Turnplate/setExpress',
  method: 'POST',
  data: qs.stringify(params)
})

export default {
  getList,
  saveRaffle,
  raffleDeatil,
  editRaffle,
  delRaffle,
  getTurnplateList,
  saveTurnplate,
  turnplateDeatil,
  editTurnplate,
  delTurnplate,
  getAdList,
  saveAd,
  adDeatil,
  editAd,
  delAd,
  raffleAll,
  turnplateAll,
  raffleLog,
  setExpress
}
