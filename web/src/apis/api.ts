import request from '@/utils/api'

// 获取天气接口
export const getWeather = (location: any) => {
  return request({
    url: `https://nt4nmphbat.re.qweatherapi.com/v7/weather/3d?location=${location}&key=c221ceab4424483993c787342427dd05`,
    method: 'get',
  })
}
