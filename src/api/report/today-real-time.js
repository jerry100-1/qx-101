import request from '@/utils/request'
import qs from 'qs'

// 获取今天实时数据
export function getTodayStat () {
  return request({
    url: 'Admin/TodayStatScale/getTodayStat',
    method: 'post'
  })
}

// 获取今天实时历史峰值数据
export function getHistoryMax () {
  return request({
    url: 'Admin/TodayStatScale/getHistoryMax',
    method: 'post'
  })
}

// 根据参数，今日曲线数据
export function getTodayEcharts (data) {
  return request({
    url: 'Admin/TodayStatScale/getTotayEcharts',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据参数，获取排行榜数据
export function getTopList (data) {
  return request({
    url: 'Admin/TodayStatScale/getTopList',
    method: 'post',
    data: qs.stringify(data)
  })
}
