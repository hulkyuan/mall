import request from '@/utils/request'



export function getInfo(id) {
  return request({
    url: '/camera/detail/' + id,
    method: 'get',
  })
}


export function fetchList(params) {
  return request({
    url: '/camera/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/camera/create',
    method: 'post',
    data: data
  })
}

export function updateAction(id, data) {
  return request({
    url: '/camera/update/' + id,
    method: 'post',
    data: data
  })
}
export function batchAdd( data) {
  return request({
    url: '/camera/batchAdd',
    method: 'post',
    data: data
  })
}

export function deleteAction(id) {
  return request({
    url: '/camera/delete/' + id,
    method: 'get'
  })
}
export function setActiveAction(id, status) {
  return request({
    url: '/camera/active/' + id + '?status=' + status,
    method: 'get'
  })
}
export function setAllActiveAction(status) {
  return request({
    url: '/camera/batchActive?status=' + status,
    method: 'get'
  })
}

