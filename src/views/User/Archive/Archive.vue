<script setup lang="ts">
import AutoArticles from '@/components/User/AutoArticles/AutoArticles.vue'
import Tags from '@/components/User/Tags/Tags.vue'
</script>

<template>
  <div class="Archive">
    <Tags />
    <AutoArticles />
  </div>
</template>

<style scoped lang="scss">
.Archive {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
