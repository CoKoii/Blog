<script setup lang="ts">
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { VIcon } from 'void-design-vue'
import { inject, type Ref } from 'vue'
const LayoutRef = inject<Ref<HTMLElement>>('layoutRef')
const onMenuClick = () => {
  LayoutRef?.value.classList.toggle('open')
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

    <div class="tools"></div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
