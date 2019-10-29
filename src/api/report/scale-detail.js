import request from '@/utils/request'
import qs from 'qs'

// 根据参数，获取设备详细信息
export function getInfoByScaleNo (data) {
  return request({
    url: 'Admin/Scale/getInfoByScaleNo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据设备ID，获取微信广告（导粉广告）
export function getWeChatAdvListByScaleNo (data) {
  return request({
    url: 'Admin/WeChatAdv/getListByScaleNo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据设备ID，获取微信广告（屏幕广告）
export function getAdvListByScaleNo (data) {
  return request({
    url: 'Admin/Adv/getListByScaleNo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据设备ID，获取归属变更日志
export function getChangeLogListByScaleNo (data) {
  return request({
    url: 'Admin/ChangeLog/getListByScaleNo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据设备ID，获取离线日志
export function getOnlineLogListByScaleNo (data) {
  return request({
    url: 'Admin/OnlineLog/getListByScaleNo',
    method: 'post',
    data: qs.stringify(data)
  })
}
