import request from '@/utils/request'
import qs from 'qs'

// 获取合伙人列表数据
export function getAllAgent () {
  return request({
    url: 'Admin/Agent/getAll',
    method: 'post'
  })
}

// 根据合伙人ID，获取合伙人信息
export function getAgentByAgentId (data) {
  return request({
    url: 'Admin/Agent/getOneByAgentId',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取场景列表数据
export function getAllScene () {
  return request({
    url: 'Admin/NewScene/getAll',
    method: 'post'
  })
}

// 根据ID，获取场景信息
export function getSceneBySceneId (data) {
  return request({
    url: 'Admin/NewScene/getOneBySceneId',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取区域列表信息
export function getAllArea () {
  return request({
    url: 'Admin/Area/getAll',
    method: 'post'
  })
}

// 根据ID，获取区域信息
export function getAreaByAreaId (data) {
  return request({
    url: 'Admin/Area/getOneByAreaId',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取铺秤人员列表数据
export function getAllEmployee () {
  return request({
    url: 'Admin/Employee/getAll',
    method: 'post'
  })
}

// 根据铺秤人员ID，获取合伙人信息
export function getEmployeeByEmployeeId (data) {
  return request({
    url: 'Admin/Employee/getOneByEmployeeId',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 根据参数，获取秤列表信息
export function getAssociatedFilters (data) {
  return request({
    url: 'Admin/Scale/getListByWhere',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取收益模式列表
export function getIncomeList () {
  return request({
    url: 'Admin/Recom/getIncomeList',
    method: 'get'
  })
}
