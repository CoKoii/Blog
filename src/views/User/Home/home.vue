<script setup lang="ts">
import Tags from '@/components/User/Tags/Tags.vue'
import About from '@/components/User/About/About.vue'
import Articles from '@/components/User/Articles/Articles.vue'
</script>

<template>
  <div class="home">
    <About />
    <Tags />
    <Articles />
    <h1>777</h1>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
