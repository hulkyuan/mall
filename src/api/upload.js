import request from '@/utils/request'
export function uploadImg(data) {
  return request({
    url:'/minio/upload',
    method:'post',
    data:data
  })
}
