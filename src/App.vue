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
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg-color-page);
}
</style>
