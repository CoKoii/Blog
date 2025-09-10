<script setup lang="ts">
import { ref } from 'vue'

const tags = ref([
  { name: 'All Posts', path: '/', id: 1 },
  { name: '技术总结', path: '/jszj', id: 2 },
  { name: '独立开发', path: '/dlkf', id: 3 },
  { name: '读书笔记', path: '/dsbj', id: 4 },
  { name: '生活随笔', path: '/shsb', id: 5 },
  { name: '友情链接', path: '/links', id: 6 },
  { name: '关于我', path: '/about', id: 7 },
  { name: '归档', path: '/archive', id: 8 },
  { name: '更多', path: '/more', id: 9 },
])
</script>

<template>
  <div class="Tags">
    <ul>
      <li v-for="value in tags" :key="value.id">
        <router-link :to="value.path" active-class="active">{{ value.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
