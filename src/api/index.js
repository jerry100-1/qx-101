import request from '@/utils/request'
import qs from 'qs'


export function logout () {
  return request({
    url: 'Admin/Index/logout',
    method: 'post'
  })
}

export function fetchMenu () {
  return request({
    url: 'Admin/Index/menu',
    method: 'post'
  })
}

export function fetchUserinfo () {
  return request({
    url: 'Admin/Index/userinfo',
    method: 'get'
  })
}

export function authexpire () {
  return request({
    url: 'Admin/Index/authexpire',
    method: 'post'
  })
}

export function refresh () {
  return request({
    url: 'Admin/Index/refresh',
    method: 'post'
  })
}
//添加字典
export function addDictionary(params) {
    return request({
        url: 'Admin/Dictionary/add',
        method: 'post',
        data: qs.stringify(params)
    })
}
