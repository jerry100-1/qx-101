import request from '@/utils/request'

// 获取48小时主动推送列表
export function getWechatNoticeList (data) {
  return request({
    url: 'Admin/WechatNotice/getList',
    method: 'get',
    params: data
  })
}

// 开启推送消息规则
export function editWechatNoticeOn (data) {
  return request({
    url: 'Admin/WechatNotice/editOn',
    method: 'get',
    params: data
  })
}

// 禁用推送消息规则
export function editWechatNoticeOff (data) {
  return request({
    url: 'Admin/WechatNotice/editOff',
    method: 'get',
    params: data
  })
}

// 新增推送规则
export function addWechatNotice (formData) {
  return request.post('Admin/WechatNotice/add', formData)
}

// 修改推送规则
export function editWechatNotice (formData) {
  return request.post('Admin/WechatNotice/edit', formData)
}

// 查询推送消息
export function getWechatNoticeById (data) {
  return request({
    url: 'Admin/WechatNotice/update',
    method: 'get',
    params: data
  })
}

// 删除推送消息
export function deleteWechatNotice (data) {
  return request({
    url: 'Admin/WechatNotice/wechatNoticeAdvDelete',
    method: 'get',
    params: data
  })
}

// 获取公众号数据
export function getAppidAndName () {
  return request({
    url: 'Admin/WeChatAdv/getAppidAndName',
    method: 'get'
  })
}
