import request from '@/utils/request'
import qs from 'qs'

// 新增、修改文章
export function editArticle (data) {
  return request({
    url: 'Admin/Material/edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增、修改文章
export function addArticle (data) {
  return request({
    url: 'Admin/Material/add',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改文章状态
export function updateArticleStatus (data) {
  return request({
    url: 'Admin/Material/editStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增、修改文章
export function getArticleList (data) {
  return request({
    url: 'Admin/Material/getPageList',
    method: 'get',
    params: data
  })
}

// 获取文章
export function getArticleInfo (data) {
  return request({
    url: 'Admin/Material/getInfo',
    method: 'get',
    params: data
  })
}
// 抓取微信公众号文章内容
export function getUrlMsg (data) {
  return request({
    url: 'Admin/Material/getUrlMsg',
    method: 'post',
    data: qs.stringify(data)
  })
}
