import request from '@/utils/request'
import qs from 'qs'

// 根据参数，获取粉丝导流统计
export function getDiversionStat (data) {
  return request({
    url: 'Admin/Follow/getDiversionStat',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据参数，获取公众号导流统计
export function getWeChatList (data) {
  return request({
    url: 'Admin/Follow/getWeChatList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 广告统计分页列表
export function getWeightAdvClickTotalList (data) {
  return request({
    url: 'Admin/WeightAdv/weightAdvClickTotalList',
    method: 'get',
    params: data
  })
}

// 添加/修改h5后退链接url
export function setUrl (data) {
  return request({
    url: 'Admin/UserWeight/setUrl',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 查询h5后退链接列表
export function getUrlList (data) {
  return request({
    url: 'Admin/UserWeight/urlList',
    method: 'get',
    params: data
  })
}

// 添加/修改h5跳转链接url
export function setJumpUrl (data) {
  return request({
    url: 'Admin/UserWeight/setJumpUrl',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 查询h5跳转链接列表
export function getUrlJumpList (data) {
  return request({
    url: 'Admin/UserWeight/urlJumpList',
    method: 'get',
    params: data
  })
}

// 根据ID清除每日导粉的限制
export function updateDayFollowTimeById (data) {
    return request({
        url: 'Admin/WeChatAdv/updateDayFollowTimeById',
        method: 'get',
        params: data
    })
}

// 根据参数，获取粉丝来源统计
export function getSourceStat (data) {
  return request({
    url: 'Admin/Follow/getWechatFollowSource',
    method: 'post',
    data: qs.stringify(data)
  })
}
