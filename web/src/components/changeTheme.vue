<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ConfigProvider } from 'ant-design-vue'
import { theme } from 'ant-design-vue'

const isDark = ref(false)
const { darkAlgorithm, defaultAlgorithm } = theme

const themeConfig = reactive({
  algorithm: defaultAlgorithm,
})

const applyTheme = (dark: boolean) => {
  isDark.value = dark
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  document.documentElement.classList[dark ? 'add' : 'remove']('dark')
  themeConfig.algorithm = dark ? darkAlgorithm : defaultAlgorithm
}

const changeTheme = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  applyTheme(savedTheme === 'dark' || (savedTheme === null && prefersDark))
})
</script>

<template>
  <ConfigProvider :theme="themeConfig">
    <el-icon @click="changeTheme" style="cursor: pointer">
      <Moon v-if="!isDark" style="color: #409eff" />
      <Sunny v-else style="color: #ff9500; transform: scale(1.3)" />
    </el-icon>
  </ConfigProvider>
</template>

<style scoped></style>
