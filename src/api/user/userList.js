import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url: '/member/list',
    method: 'post',
    data: data
  })
}

export function updateList(data) {
  return request({
    url: '/member/update',
    method: 'post',
    data: data
  })
}

export function getGrowthList(id) {
  return request({
    url: `/member/growthList/${id}`,
    method: 'get'
  })
}
export function getIntegrationList(id) {
  return request({
    url: `/member/integrationList/${id}`,
    method: 'get'
  })
}


