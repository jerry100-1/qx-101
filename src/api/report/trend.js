import request from '@/utils/request'
import qs from 'qs'

export function getHourStatList (data) {
  return request({
    url: 'Admin/HourStatAgentScale/getStaticList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getDayStatList (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getStaticList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getWeekStatList (data) {
  return request({
    url: 'Admin/WeekStatAgentScale/getStaticList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getMonthStatList (data) {
  return request({
    url: 'Admin/MonthStatAgentScale/getStaticList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getHourStatSummary (data) {
  return request({
    url: 'Admin/HourStatAgentScale/getStaticTotal',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getDayStatSummary (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getStaticTotal',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getWeekStatSummary (data) {
  return request({
    url: 'Admin/WeekStatAgentScale/getStaticTotal',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getMonthStatSummary (data) {
  return request({
    url: 'Admin/MonthStatAgentScale/getStaticTotal',
    method: 'post',
    data: qs.stringify(data)
  })
}
