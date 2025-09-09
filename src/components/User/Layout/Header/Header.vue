<script setup lang="ts">
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { VIcon } from 'void-design-vue'
</script>

<template>
  <div class="Header">
    <div class="title">
      <VIcon :icon="faBars" size="sm" />
      <RouterLink to="/">Cheng</RouterLink>
    </div>

    <div class="tools"></div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
