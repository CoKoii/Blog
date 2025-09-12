<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, type ComponentPublicInstance } from 'vue'
import { usedTags, getArticlesByTagPath } from '@/data/mock'

type Article = {
  id: number
  img: string
  title: string
  author: string
  date: string
  tag: string
  readTotal: number
  avatar: string
}

type Topic = {
  id: number
  name: string
  color: string
  desc: string
  path: string
  articles: Article[]
}

type Raw = {
  id: number
  cover: string
  title: string
  authorName: string
  date: string
  views: number
  authorAvatar: string
}

const mapRawToArticle = (tagName: string) => (a: Raw): Article => ({
  id: a.id,
  img: a.cover,
  title: a.title,
  author: a.authorName,
  date: a.date,
  tag: tagName,
  readTotal: a.views,
  avatar: a.authorAvatar,
})

const topics = ref<Topic[]>(
  usedTags.map((t, idx) => ({
    id: t.id ?? idx + 1,
    name: t.name,
    color: t.color,
    desc: '',
    path: t.path,
    articles: (getArticlesByTagPath(t.path) as unknown as Raw[])
      .slice(0, 8)
      .map(mapRawToArticle(t.name)),
  })),
)

const containers = ref<HTMLElement[]>([])
const canScrollLeft = ref<boolean[]>([])
const canScrollRight = ref<boolean[]>([])

const updateEdges = (index: number) => {
  const el = containers.value[index]
  if (!el) return
  const max = el.scrollWidth - el.clientWidth - 1
  canScrollLeft.value[index] = el.scrollLeft > 0
  canScrollRight.value[index] = el.scrollLeft < max
}

const scrollContainer = (el: HTMLElement, direction: 'left' | 'right') => {
  if (!el) return
  const amount = Math.max(240, Math.round(el.clientWidth * 0.9))
  const current = el.scrollLeft
  const target = direction === 'left' ? Math.max(0, current - amount) : current + amount
  el.scrollTo({ left: target, behavior: 'smooth' })
}

const scrollLeft = (index: number) => {
  const el = containers.value[index]
  if (el) scrollContainer(el, 'left')
}

const scrollRight = (index: number) => {
  const el = containers.value[index]
  if (el) scrollContainer(el, 'right')
}

let resizeHandler: (() => void) | null = null

onMounted(() => {
  nextTick(() => containers.value.forEach((_, i) => updateEdges(i)))
  resizeHandler = () => containers.value.forEach((_, i) => updateEdges(i))
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
})

const setContainer = (index: number) => (el: Element | ComponentPublicInstance | null) => {
  containers.value[index] = el as unknown as HTMLElement
}
</script>

<template>
  <div class="TagsArticles">
    <div class="item" v-for="(topic, index) in topics" :key="topic.id">
      <div class="header-row">
        <div class="header-left">
          <h1>
            <span class="dots" :style="{ backgroundColor: topic.color }"></span>
            {{ topic.name }}
          </h1>
          <div class="title_desc">
            {{ topic.desc }}
          </div>
        </div>
        <RouterLink :to="'/tags/' + topic.path" class="view-all">
          查看全部
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </RouterLink>
      </div>
      <div class="articles-container">
        <button
          class="scroll-btn scroll-left"
          :disabled="!canScrollLeft[index]"
          @click="scrollLeft(index)"
          aria-label="向左滚动"
          title="向左"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div class="articles-scroll" :ref="setContainer(index)" @scroll="updateEdges(index)">
          <div class="article-item" v-for="article in topic.articles" :key="article.id">
            <div class="img">
              <img loading="lazy" :src="article.img" alt="" />
              <div class="read_total">{{ article.readTotal }}人读过</div>
            </div>
            <div class="info">
              <img loading="lazy" class="avatar" :src="article.avatar" alt="" />
              <div class="desc">
                <div class="title">{{ article.title }}</div>
                <div class="author">{{ article.author }}</div>
                <div class="arguments">
                  <span class="time">{{ article.date }}</span>
                  <span>•</span>
                  <span class="tags">{{ article.tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          class="scroll-btn scroll-right"
          :disabled="!canScrollRight[index]"
          @click="scrollRight(index)"
          aria-label="向右滚动"
          title="向右"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--text-color), transparent 70%);
  background: color-mix(in srgb, var(--bg-color-item), var(--black) 6%);
  color: inherit;
  text-decoration: none;
  opacity: 0.9;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    opacity: 1;
    background: color-mix(in srgb, var(--bg-color-item), var(--black) 12%);
  }
}

.articles-container:hover .scroll-btn[disabled] {
  opacity: 0.35;
}

@media (max-width: 600px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .title_desc {
    width: 100%;
  }
  .view-all {
    align-self: flex-start;
  }
}
</style>
