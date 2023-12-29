import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/broadcast/list',
    method: 'get',
    params: params
  })
}
export function createNotice(data) {
  return request({
    url: '/broadcast/create',
    method: 'post',
    data: data
  })
}
export function updateNotice(data) {
  return request({
    url: '/broadcast/update',
    method: 'post',
    data: data
  })
}
export function deletNotice(params) {
  return request({
    url: '/broadcast/delete',
    method: 'get',
    params: params
  })
}