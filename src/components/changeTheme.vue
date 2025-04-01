<script setup lang="ts">
import { BulbOutlined, BulbFilled } from '@ant-design/icons-vue'
import { ref } from 'vue'

const show = ref(false)
const changeTheme = () => {
  show.value = !show.value
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
  } else {
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
  }
}
</script>
<template>
  <BulbOutlined v-show="!show" @click="changeTheme" />
  <BulbFilled v-show="show" @click="changeTheme" style="color: #ff9500" />
</template>

<style scoped></style>
