<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ConfigProvider } from 'ant-design-vue'
import { theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'

const isDark = ref(false)
const { darkAlgorithm, defaultAlgorithm } = theme
const route = useRoute()

const isLoginPage = computed(() => {
  return route.path === '/login'
})

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
    <template v-if="isLoginPage">
      <el-icon @click="changeTheme" style="cursor: pointer">
        <Moon v-if="!isDark" style="color: #409eff" />
        <Sunny v-else style="color: #ff9500; transform: scale(1.3)" />
      </el-icon>
    </template>
    <template v-else>
      <el-switch
        v-model="isDark"
        @change="(val: any) => applyTheme(val)"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        style="--el-switch-on-color: #5f46d0; --el-switch-off-color: #ff9500"
      />
    </template>
  </ConfigProvider>
</template>

<style scoped></style>
