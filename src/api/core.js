import request from '@/utils/request'



export function getInfo(id) {
  return request({
    url: '/videoAlgorithm/detail/'+id,
    method: 'get',
  })
}
export function videoList(){
  return request({
    url: '/video/list',
    method: 'get',
  })
}

export function algorithmBaseList(params) {
  return request({
    url: '/algorithmBase/list',
    method: 'get',
  })
}

export function algorithmBehaviorList(params) {
  return request({
    url: '/algorithmAction/list',
    method: 'get',
  })
}

export function audioList(params) {
  return request({
    url: '/audio/list',
    method: 'get',
  })
}
export function fetchList(params) {
  return request({
    url: '/videoAlgorithm/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/videoAlgorithm/create',
    method: 'post',
    data: data
  })
}

export function updateAction(id, data) {
  return request({
    url: '/videoAlgorithm/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteAction(id) {
  return request({
    url: '/videoAlgorithm/delete/' + id,
    method: 'get'
  })
}

