import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/companyAddress/listPage',
    method: 'get',
    params: params
  })
}

export function deleteList(id) {
  return request({
    url: '/companyAddress/delete/' + id,
    method: 'get'
  })
}
export function updateList(id, data) {
  return request({
    url: '/companyAddress/update/' + id,
    method: 'post',
    data: data
  })
}

export function createList(data) {
  return request({
    url: 'companyAddress/create',
    method: 'post',
    data: data
  })
}