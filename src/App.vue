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
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
