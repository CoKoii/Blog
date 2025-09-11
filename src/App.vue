<script setup lang="ts">
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <Component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
.App {
  inset: 0;
  overflow-x: hidden;
  position: relative;
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }
  .fade-enter-from {
    opacity: 0;
  }
  .fade-leave-to {
    opacity: 0;
    transform: scale(1.05);
  }
}
</style>
