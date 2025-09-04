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
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
