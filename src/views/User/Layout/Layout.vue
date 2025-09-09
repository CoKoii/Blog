<script setup lang="ts">
import Header from '@/components/User/Layout/Header/Header.vue'
import { provide, useTemplateRef } from 'vue'
const layoutRef = useTemplateRef<HTMLDivElement>('layout')
provide('layoutRef', layoutRef)
</script>

<template>
  <div class="Layout open" ref="layout">
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
