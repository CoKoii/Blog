<script setup lang="ts">
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.App {
  inset: 0;
  overflow-x: hidden;
  position: relative;
  background-color: var(--bg-color-page);
}
</style>
