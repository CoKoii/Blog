<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

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

const scrollRef = ref<HTMLElement | null>(null)
const showArrows = ref(false)

const updateArrows = () => {
  const el = scrollRef.value
  if (!el) return
  showArrows.value = el.scrollWidth > el.clientWidth
}

const scrollLeft = () => {
  scrollRef.value?.scrollBy({ left: -200, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollRef.value?.scrollBy({ left: 200, behavior: 'smooth' })
}

const onResize = () => updateArrows()

onMounted(async () => {
  await nextTick()
  updateArrows()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="Tags">
    <div class="scroll" ref="scrollRef">
      <ul>
        <li v-for="value in tags" :key="value.id">
          <router-link :to="value.path" active-class="active">{{ value.name }}</router-link>
        </li>
      </ul>
    </div>
    <div class="controls" v-if="showArrows">
      <button class="btn left" @click="scrollLeft">‹</button>
      <button class="btn right" @click="scrollRight">›</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
