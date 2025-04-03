<script setup lang="ts">
import { getWeather } from '@/apis/api'
import { ref } from 'vue'
import { Popover } from 'ant-design-vue'
const weather = ref()

const getWeatherData = async () => {
  const res = await getWeather()
  weather.value = res
}
getWeatherData()

const isDay = () => {
  const now = Date.now()
  const sunrise = weather.value?.daily[0].sunrise * 1000
  const sunset = weather.value?.daily[0].sunset * 1000
  return now >= sunrise && now <= sunset
}

const icon = () => {
  return weather.value?.daily[0][isDay() ? 'iconDay' : 'iconNight']
}

// 格式化日期为 "MM月DD日 星期几"
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${date.getMonth() + 1}月${date.getDate()}日 星期${weekdays[date.getDay()]}`
}

// 获取当前的背景渐变色
const getBgGradient = () => {
  if (!weather.value) return 'linear-gradient(to bottom, #6699cc, #9ab9db)'

  const weatherCode = weather.value.daily[0][isDay() ? 'iconDay' : 'iconNight']

  // 根据天气代码返回相应的背景渐变
  if (['100', '150'].includes(weatherCode)) {
    // 晴天
    return isDay()
      ? 'linear-gradient(to bottom, #1E90FF, #87CEEB)'
      : 'linear-gradient(to bottom, #191970, #483D8B)'
  } else if (['101', '102', '103', '151', '152', '153'].includes(weatherCode)) {
    // 多云
    return isDay()
      ? 'linear-gradient(to bottom, #6699cc, #9ab9db)'
      : 'linear-gradient(to bottom, #4B0082, #483D8B)'
  } else if (['104'].includes(weatherCode)) {
    // 阴天
    return 'linear-gradient(to bottom, #708090, #C0C0C0)'
  } else {
    // 默认
    return isDay()
      ? 'linear-gradient(to bottom, #6699cc, #9ab9db)'
      : 'linear-gradient(to bottom, #191970, #483D8B)'
  }
}

// 获取天气图标滤镜
const getIconFilter = () => {
  return isDay() ? '' : 'brightness(0.85) contrast(1.1)'
}
</script>

<template>
  <Popover placement="bottomRight" :overlayClassName="'weather-popover'">
    <template #content>
      <div class="weather-details" :style="{ background: getBgGradient() }">
        <!-- 头部信息展示 -->
        <div class="weather-header">
          <div class="header-left">
            <div class="location">
              {{ weather?.fxLink?.split('/')?.pop()?.split('-')?.[0] || '当前位置' }}
            </div>
            <div class="current-desc">
              {{ weather?.daily?.[0]?.[isDay() ? 'textDay' : 'textNight'] }}
            </div>
          </div>
          <div class="header-right">
            <div class="current-temp">{{ weather?.daily?.[0]?.tempMax }}°</div>
            <div class="temp-range">
              {{ weather?.daily?.[0]?.tempMin }}° ~ {{ weather?.daily?.[0]?.tempMax }}°
            </div>
          </div>
        </div>

        <!-- 天气预报简洁版 -->
        <div class="forecast-container">
          <div v-for="(day, index) in weather?.daily" :key="index" class="forecast-day">
            <div class="day-name">
              {{
                index === 0
                  ? '今天'
                  : ['明天', '后天'][index - 1] || formatDate(day.fxDate).split(' ')[1]
              }}
            </div>
            <i
              :class="`qi-${day.iconDay}`"
              class="forecast-icon"
              :style="{ filter: index === 0 ? getIconFilter() : '' }"
            ></i>
            <div class="forecast-temps">
              <span>{{ day.tempMin }}° / {{ day.tempMax }}°</span>
            </div>
          </div>
        </div>

        <!-- 重要天气信息 -->
        <div class="weather-highlights">
          <div class="highlight-row">
            <div class="highlight-item">
              <div class="highlight-value">{{ weather?.daily?.[0]?.humidity }}%</div>
              <div class="highlight-label">湿度</div>
            </div>
            <div class="highlight-item">
              <div class="highlight-value">{{ weather?.daily?.[0]?.windScaleDay }}级</div>
              <div class="highlight-label">风力</div>
            </div>
            <div class="highlight-item">
              <div class="highlight-value">{{ weather?.daily?.[0]?.uvIndex || 'N/A' }}</div>
              <div class="highlight-label">紫外线</div>
            </div>
          </div>
        </div>

        <!-- 数据来源 -->
        <div class="weather-footer">
          更新于 {{ weather?.updateTime?.split('T')?.[1]?.split('+')?.[0]?.substring(0, 5) || '' }}
        </div>
      </div>
    </template>
    <i :class="`qi-${icon()}`" class="weather-current" :style="{ filter: getIconFilter() }">
      <div class="weather-temp">
        {{ weather?.daily?.[0]?.tempMin }}~{{ weather?.daily?.[0]?.tempMax }}°
      </div>
    </i>
  </Popover>
</template>

<style scoped>
.weather-current {
  font-weight: normal;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
}

.weather-temp {
  margin-left: 6px;
  font-size: 14px;
  color: inherit;
}

.weather-details {
  width: 320px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  text-align: left;
}

.header-right {
  text-align: right;
}

.location {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
}

.current-desc {
  font-size: 14px;
  opacity: 0.85;
}

.current-temp {
  font-size: 26px;
  font-weight: 400;
  line-height: 1;
}

.temp-range {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
}

.forecast-container {
  display: flex;
  justify-content: space-around;
  padding: 10px 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;
}

.day-name {
  font-size: 13px;
  margin-bottom: 4px;
}

.forecast-icon {
  font-size: 20px;
  margin: 4px 0;
}

.forecast-temps span {
  font-size: 13px;
  font-weight: 400;
}

.weather-highlights {
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.highlight-row {
  display: flex;
  justify-content: space-between;
}

.highlight-item {
  text-align: center;
  flex: 1;
}

.highlight-value {
  font-size: 16px;
  font-weight: 500;
}

.highlight-label {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}

.weather-footer {
  padding: 8px 15px;
  font-size: 11px;
  opacity: 0.6;
  text-align: center;
}

/* 自定义 Popover 样式 */
:deep(.ant-popover-inner) {
  background: transparent;
}

:deep(.ant-popover-arrow) {
  display: none;
}

:deep(.ant-popover-inner-content) {
  padding: 0;
}
</style>

<style>
/* 全局样式修改 Popover */
.weather-popover .ant-popover-inner {
  background: transparent;
  box-shadow: none;
}

.weather-popover .ant-popover-inner-content {
  padding: 0;
}

.weather-popover .ant-popover-arrow {
  display: none;
}
</style>
