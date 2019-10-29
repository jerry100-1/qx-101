import request from '@/utils/request'
import qs from 'qs'

export function profitIndex () {
    return request({
        url: 'Admin/AgentGainSet/index',
        method: 'get'
    })
}

export function profitStore (data) {
    return request({
        url: 'Admin/AgentGainSet/store',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function profitUpdate (data) {
    return request({
        url: 'Admin/AgentGainSet/update',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function profitEdit (data) {
    return request({
        url: 'Admin/AgentGainSet/edit',
        method: 'get',
        params: data
    })
}
