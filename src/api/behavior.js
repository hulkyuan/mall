import request from '@/utils/request'



export function getInfo(id) {
  return request({
    url: '/algorithmAction/detail/'+id,
    method: 'get',
  })
}


export function fetchList(params) {
  return request({
    url: '/algorithmAction/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/algorithmAction/create',
    method: 'post',
    data: data
  })
}

export function updateBehavior(id, data) {
  return request({
    url: '/algorithmAction/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteBehavior(id) {
  return request({
    url: '/algorithmAction/delete/' + id,
    method: 'get'
  })
}

