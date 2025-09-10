<script setup lang="ts"></script>

<template>
  <div class="home">
    <h1 v-for="item in 100" :key="item">我是首页2</h1>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
}
</style>
