import request from '@/utils/request'
import qs from 'qs'
// 订单管理
export function saleOrderIndex (data) {
    return request({
        url: 'Admin/SaleOrder/saleOrderIndex',
        method: 'get',
        params: data
    })
}
// 设备销售提成明细
export function commissionSubsidiary (data) {
    return request({
        url: 'Admin/SaleOrder/commissionSubsidiary',
        method: 'get',
        params: data
    })
}
// 设备销售提成明细-下拉列表
export function list (data) {
    return request({
        url: 'Admin/SaleAgent/list',
        method: 'get',
        params: data
    })
}
// 广告佣金及分润统计
export function accountAdvlist (data) {
    return request({
        url: 'Admin/SaleCommission/accountAdvlist',
        method: 'post',
        data: qs.stringify(data),
    })
}
