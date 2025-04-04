<script setup lang="ts">
import 'qweather-icons/font/qweather-icons.css'
import { getWeather } from '@/apis/api'
import { ref } from 'vue'
import { Popover, message } from 'ant-design-vue'

const weather = ref()
const locationError = ref(false)
const loading = ref(false)
const permissionDenied = ref(false)

const success = async (position: GeolocationPosition) => {
  try {
    loading.value = true
    locationError.value = false

    const res = await getWeather(
      `${position.coords.longitude.toFixed(2)},${position.coords.latitude.toFixed(2)}`,
    )
    weather.value = res
  } catch (error) {
    console.error('获取天气数据失败:', error)
    message.error('获取天气数据失败')
  } finally {
    loading.value = false
  }
}

const error = (err: GeolocationPositionError) => {
  loading.value = false
  locationError.value = true
  permissionDenied.value = err.code === 1
  console.error(err.code === 1 ? '位置权限被拒绝:' : '获取位置信息失败:', err.message)
}

const requestLocation = () => {
  loading.value = true
  permissionDenied.value = false
  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  })
}

const openPermissionGuide = () => {
  message.info('请在浏览器设置中允许网站访问位置信息')
}

requestLocation()

const isDay = () => {
  const now = Date.now()
  const sunrise = weather.value?.daily[0].sunrise * 1000
  const sunset = weather.value?.daily[0].sunset * 1000
  return now >= sunrise && now <= sunset
}

const icon = () => {
  return weather.value?.daily[0][isDay() ? 'iconDay' : 'iconNight']
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${date.getMonth() + 1}月${date.getDate()}日 星期${weekdays[date.getDay()]}`
}

const getBgGradient = () => {
  if (!weather.value) return 'linear-gradient(to bottom, #6699cc, #9ab9db)'

  const weatherCode = weather.value.daily[0][isDay() ? 'iconDay' : 'iconNight']

  if (['100', '150'].includes(weatherCode)) {
    return isDay()
      ? 'linear-gradient(to bottom, #1E90FF, #87CEEB)'
      : 'linear-gradient(to bottom, #191970, #483D8B)'
  } else if (['101', '102', '103', '151', '152', '153'].includes(weatherCode)) {
    return isDay()
      ? 'linear-gradient(to bottom, #6699cc, #9ab9db)'
      : 'linear-gradient(to bottom, #4B0082, #483D8B)'
  } else if (['104'].includes(weatherCode)) {
    return 'linear-gradient(to bottom, #708090, #C0C0C0)'
  } else {
    return isDay()
      ? 'linear-gradient(to bottom, #6699cc, #9ab9db)'
      : 'linear-gradient(to bottom, #191970, #483D8B)'
  }
}

const getIconFilter = () => {
  return isDay() ? '' : 'brightness(0.85) contrast(1.1)'
}
</script>

<template>
  <Popover placement="bottomRight" :overlayClassName="'weather-popover'">
    <template #content>
      <div class="weather-details" :style="{ background: getBgGradient() }">
        <div v-if="locationError" class="location-error-container">
          <div class="location-error-message">
            <i class="qi-location-off location-error-icon"></i>
            <div class="error-text">无法获取位置信息</div>

            <div class="error-tip" v-if="permissionDenied">
              您已禁用位置权限，请在浏览器设置中允许访问
            </div>
            <div class="error-tip" v-else>请允许浏览器访问您的位置</div>

            <button
              class="retry-button"
              @click="requestLocation"
              :disabled="loading"
              v-if="!permissionDenied"
            >
              {{ loading ? '请求中...' : '重新获取位置' }}
            </button>

            <div v-if="permissionDenied" class="permission-guide">
              <button class="guide-button" @click="openPermissionGuide">
                查看如何开启位置权限
              </button>
              <div class="manual-retry">
                <span>权限开启后</span>
                <button class="retry-link" @click="requestLocation" :disabled="loading">
                  {{ loading ? '请求中...' : '重新尝试' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="loading && !weather" class="loading-container">
          <i class="qi-loading loading-icon"></i>
          <div>获取天气信息中...</div>
        </div>
        <template v-else-if="weather">
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

          <div class="weather-footer">
            更新于
            {{ weather?.updateTime?.split('T')?.[1]?.split('+')?.[0]?.substring(0, 5) || '' }}
            <a href="#" class="refresh-link" @click.prevent="requestLocation">
              <i class="qi-refresh" :class="{ refreshing: loading }"></i>
            </a>
          </div>
        </template>
      </div>
    </template>
    <i
      :class="[
        locationError ? 'qi-location-off' : loading && !weather ? 'qi-loading' : `qi-${icon()}`,
      ]"
      class="weather-current"
      :style="{ filter: !locationError && !loading ? getIconFilter() : '' }"
      @click="locationError ? requestLocation() : null"
    >
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  text-align: center;
}

.location-error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.location-error-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.error-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.error-tip {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 16px;
}

.retry-button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.4);
}
.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  gap: 16px;
}

.loading-icon {
  font-size: 36px;
  animation: spin 1.5s linear infinite;
}

.refresh-link {
  color: white;
  opacity: 0.7;
  margin-left: 8px;
  display: inline-block;
}

.refreshing {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

:deep(.ant-popover-inner) {
  background: transparent;
}
:deep(.ant-popover-arrow) {
  display: none;
}
:deep(.ant-popover-inner-content) {
  padding: 0;
}

.permission-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
  gap: 10px;
}

.guide-button {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-button:hover {
  background: rgba(255, 255, 255, 0.4);
}

.manual-retry {
  display: flex;
  align-items: center;
  font-size: 12px;
  opacity: 0.8;
}

.retry-link {
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  font-size: 12px;
  padding: 0 4px;
  cursor: pointer;
  opacity: 0.9;
}

.retry-link:hover {
  opacity: 1;
}
.retry-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style>
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
