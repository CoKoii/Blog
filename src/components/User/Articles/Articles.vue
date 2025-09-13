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
let requestId = 0
const skeletonCount = computed(() => (props.mode === 'infinite' ? PAGE_SIZE : 6))

// Track image load state for smooth transitions
const coverLoaded = ref<Set<number>>(new Set())
const avatarLoaded = ref<Set<number>>(new Set())

function onCoverLoad(id: number) {
  coverLoaded.value.add(id)
}

function onAvatarLoad(id: number) {
  avatarLoaded.value.add(id)
}

const visibleArticles = computed(() => {
  if (props.mode === 'loadmore') {
    const n = Math.min(MAX_LOADMORE, filteredArticles.value.length)
    return filteredArticles.value.slice(0, n)
  }
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

  const currentRequestId = ++requestId

  isLoading.value = true
  try {
    const nextPage = page.value + 1
    const { items, total: t } = await fetchArticlesPageByTagPath(
      (currentCategory.value || '') as string,
      nextPage,
      PAGE_SIZE,
    )

    if (currentRequestId !== requestId) {
      return
    }

    totalCount.value = t
    rawArticles.value = rawArticles.value.concat(items as unknown as RawArticle[])
    page.value = nextPage
  } catch (error) {
    if (currentRequestId === requestId) {
      console.error('Failed to load more articles:', error)
    }
  } finally {
    if (currentRequestId === requestId) {
      isLoading.value = false
      await nextTick()
      if (sentinelVisible.value && hasMore.value) {
        setTimeout(() => loadMoreAsync(), 0)
      }
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

  const currentRequestId = ++requestId

  isFetching.value = true
  try {
    // reset loaded states so new images animate in
    coverLoaded.value = new Set()
    avatarLoaded.value = new Set()
    rawArticles.value = []
    totalCount.value = 0
    page.value = 1

    if (props.mode === 'infinite') {
      const { items, total: t } = await fetchArticlesPageByTagPath(path, 1, PAGE_SIZE)

      if (currentRequestId !== requestId) {
        return
      }

      rawArticles.value = items as unknown as RawArticle[]
      totalCount.value = t
    } else {
      const raw = (await fetchArticlesByTagPath(path)) as unknown as RawArticle[]

      if (currentRequestId !== requestId) {
        return
      }

      rawArticles.value = raw
      totalCount.value = raw.length
    }
  } catch (error) {
    if (currentRequestId === requestId) {
      console.error('Failed to refresh articles:', error)
    }
  } finally {
    if (currentRequestId === requestId) {
      isFetching.value = false
    }
  }
}

onMounted(async () => {
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
    if (props.mode === 'infinite') {
      cleanupObserver()
    }

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
    <template v-if="isFetching">
      <div v-for="i in skeletonCount" :key="`skeleton-${i}`" class="item skeleton-item">
        <div class="img skeleton-img"></div>
        <div class="info">
          <div class="avatar skeleton-avatar"></div>
          <div class="desc">
            <div class="title skeleton-title"></div>
            <div class="author skeleton-author"></div>
            <div class="arguments skeleton-arguments">
              <span class="skeleton-time"></span>
              <span class="skeleton-dot"></span>
              <span class="skeleton-tag"></span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        class="item"
        v-for="(item, index) in visibleArticles"
        :key="item.id"
        :style="{ '--i': index }"
        @click="$router.push({ path: `/article/${item.id}` })"
      >
        <div class="img">
          <img
            loading="lazy"
            :src="item.cover"
            alt=""
            :class="{ 'is-loaded': coverLoaded.has(item.id) }"
            @load="onCoverLoad(item.id)"
          />
          <div class="read_total">{{ item.reads }}人读过</div>
        </div>
        <div class="info">
          <img
            loading="lazy"
            class="avatar"
            src="https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640"
            alt=""
            :class="{ 'is-loaded': avatarLoaded.has(item.id) }"
            @load="onAvatarLoad(item.id)"
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
    </template>

    <div v-if="mode === 'infinite' && isLoading" class="loading-tip">
      <span class="spinner" />
      <span>加载中...</span>
    </div>
    <div v-if="mode === 'infinite' && hasMore" ref="sentinel" class="infinite-sentinel" />
    <div v-if="mode === 'infinite' && !hasMore && !isFetching" class="end-tip">— 没有更多了 —</div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
