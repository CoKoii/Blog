<script setup lang="ts">
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { VIcon } from 'void-design-vue'
import { inject, ref, type Ref } from 'vue'
const LayoutRef = inject<Ref<HTMLElement>>('layoutRef')
const onMenuClick = () => {
  LayoutRef?.value.classList.toggle('open')
}
const showSearch = ref(false)
const openSearch = () => {
  showSearch.value = true
  document.body.style.overflow = 'hidden'
}
const closeSearch = () => {
  showSearch.value = false
  document.body.style.overflow = 'auto'
}
</script>

<template>
  <div class="Header">
    <div class="title">
      <span @click="onMenuClick">
        <VIcon :icon="faBars" size="sm" />
      </span>
      <RouterLink to="/">Cheng</RouterLink>
    </div>
    <button class="search" @click="openSearch">
      <VIcon :icon="faSearch" size="sm" />
      Search
      <span>/</span>
    </button>
    <div class="tools"></div>
  </div>
  <teleport to="body">
    <div class="mask" v-if="showSearch" @click="closeSearch">
      <div class="search"></div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
