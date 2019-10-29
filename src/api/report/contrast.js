import request from '@/utils/request'
import qs from 'qs'

export function getIndexCompareList (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getIndexCompareList',
    method: 'post',
    data: qs.stringify(data)
  })
}
