<script setup lang="ts">
import Articles from '@/components/User/Articles/Articles.vue'
import Tags from '@/components/User/Tags/Tags.vue'
</script>

<template>
  <div class="Archive">
    <Tags />
    <Articles />
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
