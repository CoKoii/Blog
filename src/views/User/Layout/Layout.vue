<script setup lang="ts">
import Header from '@/components/User/Layout/Header/Header.vue'
import Menus from '@/components/User/Layout/Menus/Menus.vue'
import { provide, useTemplateRef } from 'vue'
const layoutRef = useTemplateRef<HTMLDivElement>('layout')
provide('layoutRef', layoutRef)
</script>

<template>
  <div class="Layout" ref="layout">
    <div class="header">
      <Header />
    </div>
    <div class="menus">
      <Menus />
    </div>
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
