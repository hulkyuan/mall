import request from '@/utils/request'

// 基础算法api

export function getInfo(id) {
  return request({
    url: '/algorithmBase/detail/'+id,
    method: 'get',
  })
}


export function fetchList(params) {
  return request({
    url: '/algorithmBase/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/algorithmBase/create',
    method: 'post',
    data: data
  })
}

export function updateBehavior(id, data) {
  return request({
    url: '/algorithmBase/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteBehavior(id) {
  return request({
    url: '/algorithmBase/delete/' + id,
    method: 'get'
  })
}

