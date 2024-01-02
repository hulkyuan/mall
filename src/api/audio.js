import request from '@/utils/request'



export function getInfo(id) {
  return request({
    url: '/audio/detail/'+id,
    method: 'get',
  })
}


export function fetchList(params) {
  return request({
    url: '/audio/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/audio/create',
    method: 'post',
    data: data
  })
}

export function updateAction(id, data) {
  return request({
    url: '/audio/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteAction(id) {
  return request({
    url: '/audio/delete/' + id,
    method: 'get'
  })
}

