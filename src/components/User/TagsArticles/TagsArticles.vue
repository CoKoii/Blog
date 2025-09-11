<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, type ComponentPublicInstance } from 'vue'

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
  link: string
  articles: Article[]
}

const topics = ref<Topic[]>([
  {
    id: 1,
    name: 'JavaScript',
    color: '#28c840',
    desc:
      'JavaScript（简称 JS）是一种运行在浏览器和服务器端的高级编程语言，支持多范式与丰富的生态。',
    link: '/archive?tag=javascript',
    articles: Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      img: `https://picsum.photos/seed/js-${i + 1}/800/500`,
      title: `JS 模块化实践与最佳实践 Part ${i + 1}`,
      author: 'CaoKai',
      date: `2024-09-${String((i % 9) + 1).padStart(2, '0')}`,
      tag: 'JavaScript',
      readTotal: 20 + i * 3,
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
    })),
  },
  {
    id: 2,
    name: '独立开发',
    color: '#f59e0b',
    desc: '从 0 到 1 打造产品的心法与实战记录。',
    link: '/archive?tag=indie',
    articles: Array.from({ length: 8 }).map((_, i) => ({
      id: 100 + i + 1,
      img: `https://picsum.photos/seed/indie-${i + 1}/800/500`,
      title: `独立开发周报 #${i + 1}`,
      author: 'CaoKai',
      date: `2024-08-${String((i % 9) + 1).padStart(2, '0')}`,
      tag: '独立开发',
      readTotal: 45 + i * 5,
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
    })),
  },
  {
    id: 3,
    name: '读书笔记',
    color: '#3b82f6',
    desc: '记录读书所思所想，输出倒逼输入。',
    link: '/archive?tag=reading',
    articles: Array.from({ length: 8 }).map((_, i) => ({
      id: 200 + i + 1,
      img: `https://picsum.photos/seed/book-${i + 1}/800/500`,
      title: `书摘与感悟 · 第 ${i + 1} 篇`,
      author: 'CaoKai',
      date: `2024-07-${String((i % 9) + 1).padStart(2, '0')}`,
      tag: '读书',
      readTotal: 18 + i * 4,
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
    })),
  },
  {
    id: 4,
    name: '技术总结',
    color: '#ef4444',
    desc: '工程化、性能优化与架构笔记，持续沉淀。',
    link: '/archive?tag=tech',
    articles: Array.from({ length: 8 }).map((_, i) => ({
      id: 300 + i + 1,
      img: `https://picsum.photos/seed/tech-${i + 1}/800/500`,
      title: `前端性能优化清单 · ${i + 1}`,
      author: 'CaoKai',
      date: `2024-06-${String((i % 9) + 1).padStart(2, '0')}`,
      tag: '技术',
      readTotal: 60 + i * 2,
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
    })),
  },
])

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
        <RouterLink :to="topic.link" class="view-all">
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
              <img :src="article.img" alt="" />
              <div class="read_total">{{ article.readTotal }}人读过</div>
            </div>
            <div class="info">
              <img class="avatar" :src="article.avatar" alt="" />
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
