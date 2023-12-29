import request from '@/utils/request'
export function fetchList() {
  return request({
    url: '/sysConfig/listAll',
    method: 'get'
  })
}
export function updateParams(data, id) {
  return request({
    url: `/sysConfig/update/${id}`,
    method: 'post',
    data: data
  })
}
export function getInfo(id) {
  return request({
    url: `/sysConfig/info/${id}`,
    method: 'get'
  })
}
