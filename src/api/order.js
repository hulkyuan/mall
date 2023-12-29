import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params: params
  })
}

export function closeOrder(params) {
  return request({
    url: '/order/update/close',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/order/delete',
    method: 'post',
    params: params
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/order/update/note',
    method: 'post',
    params: params
  })
}

export function getOrderItem(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  })
}


export function deliveryOrder(data) {
  return request({
    url: '/order/update/delivery',
    method: 'post',
    data: data
  });
}

// 订单发货的接口 /update/delivery，增加了一个字段 订单明细id  orderItemId，取值为orderItemList.id
// 订单有多少商品，deliveryParamList就要有多少条数据，不管是批量发货还是分开发货，deliveryParamList里面都要拼装每个商品的发货单号哈。