<script setup lang="ts">
defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="Layout">
    <div class="header">头部</div>
    <div class="menus">菜单</div>
    <div class="container">
      <router-view> </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
