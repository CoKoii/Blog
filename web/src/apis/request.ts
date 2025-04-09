import request from '@/utils/request'
// 登录接口
export const loginApi = (data: any) => {
  return request({
    url: '/api/login',
    method: 'post',
    data,
  })
}
export const getUserInfoApi = () => {
  return request({
    url: '/api/info',
    method: 'get',
  })
}
