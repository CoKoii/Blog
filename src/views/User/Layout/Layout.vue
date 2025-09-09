<script setup lang="ts">
import Header from '@/components/User/Layout/Header/Header.vue'

defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="Layout">
    <div class="header">
      <Header />
    </div>
    <div class="menus">菜单</div>
    <div class="container">
      <router-view> </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
