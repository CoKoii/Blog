<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchArticleById, expandArticleTags } from '@/data/mock'
import type { Article, Tag } from '@/data/mock'

defineOptions({ name: 'Detail' })

const route = useRoute()

const article = ref<Article | null>(null)
const tags = ref<Tag[]>([])
const loading = ref(true)
const error = ref('')

let controller: AbortController | null = null

async function loadByArticleId(id: number) {
  if (!Number.isFinite(id) || id <= 0) return
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const data = await fetchArticleById(id)
    if (data) {
      article.value = data
      tags.value = expandArticleTags(data)
    } else {
      article.value = null
      tags.value = []
      error.value = '文章不存在'
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name !== 'AbortError') {
      error.value = '加载文章失败'
      console.error('Failed to fetch article:', err)
    }
  } finally {
    loading.value = false
  }
}

function shouldHandleArticlePath(p: string) {
  return p.startsWith('/article')
}

async function handleRouteChange() {
  const path = route.path || ''
  if (shouldHandleArticlePath(path)) {
    const maybeId = Number(route.params.id)
    article.value = null
    tags.value = []
    await loadByArticleId(maybeId)
  }
}

onMounted(handleRouteChange)

watch(
  () => route.fullPath,
  () => {
    handleRouteChange()
  },
)
</script>

<template>
  <div class="Detail">
    {{ tags }}
    <h1>{{ article }}</h1>
  </div>
</template>

<style scoped lang="scss"></style>
