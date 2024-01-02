import request from '@/utils/request'



export function getInfo(id) {
  return request({
    url: '/video/detail/'+id,
    method: 'get',
  })
}
export function cameraList(){
  return request({
    url: '/camera/list',
    method: 'get',
  })
}

export function fetchList(params) {
  return request({
    url: '/video/page',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/video/create',
    method: 'post',
    data: data
  })
}

export function updateAction(id, data) {
  return request({
    url: '/video/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteAction(id) {
  return request({
    url: '/video/delete/' + id,
    method: 'get'
  })
}

