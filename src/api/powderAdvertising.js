import request from '@/utils/request'
import qs from 'qs'

// 导粉广告-推送规则管理列表
export function groupList (data) {
    return request({
        url: 'Admin/PowderAdv/groupList',
        method: 'get',
        params: data
    })
}
// 分组配置-获取广告主
export function getCustomerList (data) {
    return request({
        url: 'Admin/PowderAdv/getCustomerList',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 分组配置-修改列表
export function addGroup (data) {
    return request({
        url: 'Admin/PowderAdv/addGroup',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 推送规则列表
export function pushList (data) {
    return request({
        url: 'Admin/PowderAdv/pushList',
        method: 'get',
        params: data
    })
}
// 推送规则-修改页
export function addPushSet (data) {
    return request({
        url: 'Admin/PowderAdv/addPushSet',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 推送规则-资源上传
export function uploadPic (data) {
    return request({
        url: 'Admin/PowderAdv/uploadPic',
        method: 'post',
        data: data
    })
}
// 导粉广告-修改、新增
export function updateInfo (data) {
    return request({
        url: 'Admin/WeChatAdv/updateInfo',
        method: 'post',
        data: qs.stringify(data)
    })
}
// 导粉广告-图片上传
export function uploadAdvUrl (data) {
    return request({
        url: 'Admin/WeChatAdv/uploadAdvUrl',
        method: 'post',
        data: data
    })
}
// 推送规则-修改页获取修改原信息
export function addPushPage (data) {
    return request({
        url: 'Admin/PowderAdv/addPushPage',
        method: 'get',
        params: data
    })
}
// 导粉广告-广告列表
export function getList (data) {
    return request({
        url: 'Admin/WeChatAdv/getList',
        method: 'get',
        params: data
    })
}
// 导粉广告-广告列表详情
export function getInfo (data) {
    return request({
        url: 'Admin/WeChatAdv/getInfo',
        method: 'get',
        params: data
    })
}
// 导粉广告-获取区域列表信息
export function getAllRegion (data) {
    return request({
        url: 'Admin/Area/getAll',
        method: 'get',
        params: data
    })
}
// 导粉广告-获取合伙人
export function getAllPartner (data) {
    return request({
        url: 'Admin/Agent/getAll',
        method: 'get',
        params: data
    })
}
// 导粉广告-获取获取场景列表数据
export function getAllScane (data) {
    return request({
        url: 'Admin/NewScene/getAll',
        method: 'get',
        params: data
    })
}
// 获取铺秤人员列表数据
export function getAllEmployee () {
    return request({
        url: 'Admin/Employee/getAll',
        method: 'post'
    })
}

// 获取公司列表
export function getCompList () {
    return request({
        url: 'Admin/PowderAdv/getCompList',
        method: 'get',

    })
}
