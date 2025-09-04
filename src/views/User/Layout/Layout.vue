<script setup lang="ts">
defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="Layout">
    <div class="menus"></div>
    <transition>
      <router-view />
    </transition>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
