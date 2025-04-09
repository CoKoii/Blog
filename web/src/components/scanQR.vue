<script setup lang="ts">
import { ScanOutlined } from '@ant-design/icons-vue'
const scanQR = () => {
  //打开相机扫码
}
</script>

<template>
  <div
    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
    class="avator-hover"
  >
    <ScanOutlined style="margin-right: 8px" @click="scanQR" /> 扫一扫
  </div>
</template>

<style scoped></style>
