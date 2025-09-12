<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { fetchArticlesByTagPath, expandArticleTags, fetchArticlesPageByTagPath } from '@/data/mock'
import { useRoute, useRouter } from 'vue-router'
type Mode = 'loadmore' | 'infinite'
const props = withDefaults(
  defineProps<{
    mode?: Mode
    total?: number
    loadMoreTo?: string
  }>(),
  { mode: 'loadmore', total: 36, loadMoreTo: '/archive' },
)
const router = useRouter()
const route = useRoute()

const routeNameAtMount = ref(route.name)

function resolveCategoryFromRoute(): string {
  const q = route.query.category
  if (typeof q === 'string' && q) return q
  const p = route.params.id
  if (typeof p === 'string' && p) return p
  return ''
}

const currentCategory = ref<string>('')

type Article = {
  id: number
  title: string
  author: string
  date: string
  tag: string
  reads: number
  cover: string
}

const MAX_LOADMORE = 11
// Infinite mode uses page-based loading
const page = ref(1)
const PAGE_SIZE = 6
const totalCount = ref(0)

type RawArticle = {
  id: number
  cover: string
  title: string
  authorAvatar: string
  authorName: string
  date: string
  tagIds: number[]
  views: number
}

const rawArticles = ref<RawArticle[]>([])

const filteredArticles = computed<Article[]>(() => {
  const raw = rawArticles.value
  return raw.map((a) => {
    const tagList = expandArticleTags(a) as Array<{ name: string; path: string }>
    const path = (currentCategory.value || '') as string
    const matched = path ? tagList.find((t) => t.path === path)?.name : null
    return {
      id: a.id,
      title: a.title,
      author: a.authorName,
      date: a.date,
      tag: matched ?? tagList[0]?.name ?? '',
      reads: a.views,
      cover: a.cover,
    }
  })
})

const hasMore = computed(() => rawArticles.value.length < totalCount.value)
const isLoading = ref(false)
const isFetching = ref(false)

const visibleArticles = computed(() => {
  if (props.mode === 'loadmore') {
    const n = Math.min(MAX_LOADMORE, filteredArticles.value.length)
    return filteredArticles.value.slice(0, n)
  }
  // infinite mode shows the accumulated rawArticles (page-based)
  return filteredArticles.value
})

const showLoadMoreTile = computed(
  () => props.mode === 'loadmore' && filteredArticles.value.length > MAX_LOADMORE,
)

function onClickLoadMore() {
  if (props.mode !== 'loadmore') return
  router.push({ path: props.loadMoreTo, query: route.query })
}

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const sentinelVisible = ref(false)

async function loadMoreAsync() {
  if (props.mode !== 'infinite') return
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const nextPage = page.value + 1
    const { items, total: t } = await fetchArticlesPageByTagPath(
      (currentCategory.value || '') as string,
      nextPage,
      PAGE_SIZE,
    )
    totalCount.value = t
    rawArticles.value = rawArticles.value.concat(items as unknown as RawArticle[])
    page.value = nextPage
  } finally {
    isLoading.value = false
    // If sentinel still visible after append and there is more, load next page
    await nextTick()
    if (sentinelVisible.value && hasMore.value) {
      setTimeout(() => loadMoreAsync(), 0)
    }
  }
}

function setupObserver() {
  if (props.mode !== 'infinite') return
  cleanupObserver()
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        sentinelVisible.value = entry.isIntersecting
        if (entry.isIntersecting) loadMoreAsync()
      }),
    { root: null, rootMargin: '300px 0px', threshold: 0 },
  )
  if (sentinel.value) observer.observe(sentinel.value)
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

async function refreshArticles() {
  const path = (currentCategory.value || '') as string
  isFetching.value = true
  try {
    // Clear previous data immediately to avoid stale rendering
    rawArticles.value = []
    totalCount.value = 0
    page.value = 1
    if (props.mode === 'infinite') {
      const { items, total: t } = await fetchArticlesPageByTagPath(path, 1, PAGE_SIZE)
      rawArticles.value = items as unknown as RawArticle[]
      totalCount.value = t
    } else {
      // loadmore mode keeps previous behavior: fetch all then slice in view
      const raw = (await fetchArticlesByTagPath(path)) as unknown as RawArticle[]
      rawArticles.value = raw
      totalCount.value = raw.length
    }
  } finally {
    isFetching.value = false
  }
}

onMounted(async () => {
  // Initialize snapshot from the current route
  currentCategory.value = resolveCategoryFromRoute()
  await refreshArticles()
  if (props.mode === 'infinite') {
    await nextTick()
    setupObserver()
  }
})

onBeforeUnmount(() => {
  cleanupObserver()
})

watch(
  () => currentCategory.value,
  async () => {
    await refreshArticles()
    if (props.mode !== 'infinite') return
    isLoading.value = false
    await nextTick()
    setupObserver()
  },
)

watch(
  () => [route.name, route.query.category, route.params.id],
  () => {
    if (route.name !== routeNameAtMount.value) return
    currentCategory.value = resolveCategoryFromRoute()
  },
)
</script>

<template>
  <div class="Articles">
    <div v-if="isFetching" class="loading-tip">正在加载文章。。。</div>
    <div
      class="item"
      v-for="(item, index) in visibleArticles"
      :key="item.id"
      :style="{ '--i': index }"
    >
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
