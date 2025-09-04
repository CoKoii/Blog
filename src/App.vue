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
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
