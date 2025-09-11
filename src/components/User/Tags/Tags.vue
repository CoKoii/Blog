<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const current = computed(() => (route.query.category ?? '') as string)
const tags = ref([
  { name: 'All Posts', category: '', id: 1 },
  { name: '技术总结', category: 'jszj', id: 2 },
  { name: '独立开发', category: 'dlkf', id: 3 },
  { name: '读书笔记', category: 'dsbj', id: 4 },
  { name: '生活随笔', category: 'shsb', id: 5 },
  { name: '友情链接', category: 'links', id: 6 },
  { name: '关于我', category: 'about', id: 7 },
  { name: '归档', category: 'archive', id: 8 },
  { name: '更多', category: 'more', id: 9 },
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
        <li v-for="t in tags" :key="t.id">
          <router-link
            :to="{ name: route.name, query: { category: t.category || undefined } }"
            :class="{ active: current === (t.category || '') }"
          >
            {{ t.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="controls" v-if="showArrows">
      <button class="btn left" @click="scrollLeft">{{ '<' }}</button>
      <button class="btn right" @click="scrollRight">{{ '>' }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
