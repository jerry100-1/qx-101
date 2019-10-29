import request from '@/utils/request'

export function fetchWelcomeData () {
  return request({
    url: 'Admin/Welcome/index',
    method: 'post'
  })
}
