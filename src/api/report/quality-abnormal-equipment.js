import request from '@/utils/request'
import qs from 'qs'

export function getHourQualityList (data) {
  return request({
    url: 'Admin/HourQualityWarnScale/getHourQualityList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateHandleInfo (data) {
  return request({
    url: 'Admin/HourQualityWarnScale/updateHandleInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
