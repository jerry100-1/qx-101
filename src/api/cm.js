import request from '@/utils/request'
import qs from 'qs'

// 城市经理统计
export function getCityManagerStat (data) {
  return request({
    url: 'Admin/Agent/getCityManagerStat',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 城市经理列表
export function getCityManagerList (data) {
  return request({
    url: 'Admin/Agent/getCityManagerList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 商务BD列表
export function getBusinessList (data) {
  return request({
    url: 'Admin/Employee/getBusinessList',
    method: 'post',
    data: qs.stringify(data)
  })
}
