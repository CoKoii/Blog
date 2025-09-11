<script setup lang="ts">
const scrollContainer = (container: HTMLElement, direction: 'left' | 'right') => {
  const scrollAmount = 320 // 一个文章卡片的宽度加间距
  const currentScroll = container.scrollLeft
  const targetScroll =
    direction === 'left' ? Math.max(0, currentScroll - scrollAmount) : currentScroll + scrollAmount

  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  })
}

const scrollLeft = (index: number) => {
  const container = document.querySelector(`.scroll-container-${index}`) as HTMLElement
  if (container) scrollContainer(container, 'left')
}

const scrollRight = (index: number) => {
  const container = document.querySelector(`.scroll-container-${index}`) as HTMLElement
  if (container) scrollContainer(container, 'right')
}
</script>

<template>
  <div class="TagsArticles">
    <div class="item" v-for="(item, index) in 4" :key="item">
      <h1><span class="dots" style="background-color: #28c840"></span> JavaScript</h1>
      <div class="title_desc">
        JavaScript（简称JS）是一种高级的、解释型的编程语言。它是一种动态类型、基于原型、支持面向对象、命令式、函数式编程风格的多范式语言。
      </div>
      <div class="articles-container">
        <button class="scroll-btn scroll-left" @click="scrollLeft(index)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div class="articles-scroll" :class="`scroll-container-${index}`">
          <div class="article-item" v-for="article in 8" :key="article">
            <div class="img">
              <img
                src="https://oss.zibll.com/zibll.com/2020/11/%E6%8E%A8%E5%B9%BF%E8%AE%A1%E5%88%92.png?x-oss-process=image%2Fquality,q_50%2Fresize,m_fill,w_429,h_300"
                alt=""
              />
              <div class="read_total">30人读过</div>
            </div>
            <div class="info">
              <img class="avatar" src="https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640" alt="" />
              <div class="desc">
                <div class="title">💳 WildCard 虚拟信用卡申请 - 海外 AI 工具充值</div>
                <div class="author">CaoKai</div>
                <div class="arguments">
                  <span class="time">2020-11-01</span>
                  <span>•</span>
                  <span class="tags">标签1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="scroll-btn scroll-right" @click="scrollRight(index)">
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
</style>
