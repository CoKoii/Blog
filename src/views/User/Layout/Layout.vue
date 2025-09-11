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
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <!-- 非缓存分支 -->
          <component v-if="!route.meta?.keepAlive" :is="Component" :key="route.fullPath" />
          <!-- 缓存分支（KeepAlive 只能包一个子节点） -->
          <keep-alive v-else>
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
