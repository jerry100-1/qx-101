import request from '@/utils/request'
import qs from 'qs'

export function getHourStatCompareAnalysisList (data) {
  return request({
    url: 'Admin/HourStatAgentScale/getCompareAnalysisList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getDayStatCompareAnalysisList (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getCompareAnalysisList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getWeekStatCompareAnalysisList (data) {
  return request({
    url: 'Admin/WeekStatAgentScale/getCompareAnalysisList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getMonthStatCompareAnalysisList (data) {
  return request({
    url: 'Admin/MonthStatAgentScale/getCompareAnalysisList',
    method: 'post',
    data: qs.stringify(data)
  })
}
