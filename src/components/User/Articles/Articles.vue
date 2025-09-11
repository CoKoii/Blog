<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Mode = 'loadmore' | 'infinite'

const props = withDefaults(
  defineProps<{
    mode?: Mode
    total?: number
    loadMoreTo?: string
  }>(),
  {
    mode: 'loadmore',
    total: 36,
    loadMoreTo: '/archive',
  },
)

const router = useRouter()
const route = useRoute()
const category = computed(() => (route.query.category ?? '') as string)

type Article = {
  id: number
  title: string
  author: string
  date: string
  tag: string
  reads: number
  cover: string
}

const allArticles = computed<Article[]>(() => {
  const items: Article[] = []
  const covers = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
  ]
  for (let i = 1; i <= props.total; i++) {
    items.push({
      id: i,
      title: `文章标题 ${i} - WildCard 虚拟信用卡与海外工具`,
      author: 'CaoKai',
      date: `2020-11-${String(((i - 1) % 28) + 1).padStart(2, '0')}`,
      tag: `标签${((i - 1) % 5) + 1}`,
      reads: 10 + ((i * 7) % 120),
      cover: covers[i % covers.length],
    })
  }
  return items
})

const MAX_LOADMORE = 11

const categoryToTag: Record<string, string | null> = {
  '': null, // 全部
  jszj: '标签1',
  dlkf: '标签2',
  dsbj: '标签3',
  shsb: '标签4',
}

const INITIAL_INFINITE = 12
const STEP_INFINITE = 6
const count = ref(INITIAL_INFINITE)
const filteredArticles = computed(() => {
  const tag = categoryToTag[category.value]
  if (!tag) return allArticles.value
  return allArticles.value.filter((a) => a.tag === tag)
})
const hasMore = computed(() => count.value < filteredArticles.value.length)
const isLoading = ref(false)

const visibleArticles = computed(() => {
  if (props.mode === 'loadmore') {
    const n = Math.min(MAX_LOADMORE, filteredArticles.value.length)
    return filteredArticles.value.slice(0, n)
  }
  return filteredArticles.value.slice(0, Math.min(count.value, filteredArticles.value.length))
})

const showLoadMoreTile = computed(
  () => props.mode === 'loadmore' && filteredArticles.value.length > MAX_LOADMORE,
)

function onClickLoadMore() {
  if (props.mode !== 'loadmore') return
  router.push(props.loadMoreTo)
}

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadMoreAsync() {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 800))
  count.value = Math.min(count.value + STEP_INFINITE, filteredArticles.value.length)
  isLoading.value = false
}

function setupObserver() {
  if (props.mode !== 'infinite') return
  cleanupObserver()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMoreAsync()
      })
    },
    { root: null, rootMargin: '200px 0px', threshold: 0 },
  )
  if (sentinel.value) observer.observe(sentinel.value)
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

onMounted(() => {
  if (props.mode === 'infinite') count.value = INITIAL_INFINITE
  setupObserver()
})

onBeforeUnmount(() => {
  cleanupObserver()
})

watch(
  () => props.mode,
  (m) => {
    if (m === 'infinite') {
      count.value = INITIAL_INFINITE
      isLoading.value = false
    }
    setupObserver()
  },
)

// 当分类变化时，如果当前实例未被 KeepAlive 缓存（或首次挂载），按需重置无限滚动计数
watch(
  () => category.value,
  () => {
    if (props.mode === 'infinite') {
      count.value = INITIAL_INFINITE
      isLoading.value = false
      // 重新观察以适配不同列表长度
      setupObserver()
    }
  },
)
</script>

<template>
  <div class="Articles">
    <div class="item" v-for="item in visibleArticles" :key="item.id">
      <div class="img">
        <img loading="lazy" :src="item.cover" alt="" />
        <div class="read_total">{{ item.reads }}人读过</div>
      </div>
      <div class="info">
        <img
          loading="lazy"
          class="avatar"
          src="https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640"
          alt=""
        />
        <div class="desc">
          <div class="title">{{ item.title }}</div>
          <div class="author">{{ item.author }}</div>
          <div class="arguments">
            <span class="time">{{ item.date }}</span>
            <span>•</span>
            <span class="tags">{{ item.tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showLoadMoreTile" class="item load-more">
      <div class="img" @click="onClickLoadMore">📖 Load More...</div>
    </div>
    <div v-if="mode === 'infinite' && isLoading" class="loading-tip">
      <span class="spinner" />
      <span>加载中...</span>
    </div>
    <div v-if="mode === 'infinite' && hasMore" ref="sentinel" class="infinite-sentinel" />
    <div v-if="mode === 'infinite' && !hasMore" class="end-tip">— 没有更多了 —</div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
