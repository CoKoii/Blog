//后端接口使用的api
import { message } from 'ant-design-vue'
import axios from 'axios'
const request = axios.create({
  timeout: 10000,
})
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers['saToken'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 0) {
      message.error(response.data.msg)
    }
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)
export default request
