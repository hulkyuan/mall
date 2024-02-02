import request from '@/utils/request'




export function fetchList(params) {
  return request({
    url: '/video/alermList',
    method: 'get',
    params: params
  })
}

export function deleteAction(id) {
  return request({
    url: '/camera/delete/' + id,
    method: 'get'
  })
}
