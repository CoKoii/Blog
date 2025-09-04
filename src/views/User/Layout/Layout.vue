<script setup lang="ts">
import Menus from '@/components/User/Menus/Menus.vue'
defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="Layout">
    <div class="menus">
      <Menus />
    </div>
    <div class="main">
      <transition>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
