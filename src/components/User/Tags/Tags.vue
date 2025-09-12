<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { fetchUsedTags } from '@/data/mock'
import { useRoute } from 'vue-router'
const route = useRoute()
const current = computed(() => (route.query.category ?? '') as string)
type SimpleTag = { name: string; path: string }
const tags = ref<{ name: string; category: string; id: number }[]>([
  { name: 'All Posts', category: '', id: 1 },
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
  const dataTags = (await fetchUsedTags()) as unknown as Array<SimpleTag>
  tags.value = [
    { name: 'All Posts', category: '', id: 1 },
    ...dataTags.map((t: SimpleTag, i: number) => ({ name: t.name, category: t.path, id: i + 2 })),
  ]
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
