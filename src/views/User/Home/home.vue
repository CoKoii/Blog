<script setup lang="ts">
import Tags from '@/components/User/Tags/Tags.vue'
import About from '@/components/User/About/About.vue'
import Articles from '@/components/User/Articles/Articles.vue'
import TagsArticles from '@/components/User/TagsArticles/TagsArticles.vue'
</script>

<template>
  <div class="Home">
    <About />
    <Tags />
    <Articles />
    <TagsArticles />
  </div>
</template>

<style scoped lang="scss">
.Home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  h1 {
    text-align: center;
  }
}
</style>
