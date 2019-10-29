import request from '@/utils/request'
import qs from 'qs'

// 根据参数，获取设备分析数据（按日）
export function getScaleAnalysis (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getScaleAnalysis',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据参数，获取设备曲线图（按日）
export function getDayScaleAnalysisEcharts (data) {
  return request({
    url: 'Admin/DayStatAgentScale/getScaleAnalysisEcharts',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据参数，获取设备曲线图（按时）
export function getHourScaleAnalysisEcharts (data) {
  return request({
    url: 'Admin/HourStatAgentScale/getScaleAnalysisEcharts',
    method: 'post',
    data: qs.stringify(data)
  })
}
