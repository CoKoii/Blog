<script setup lang="ts">
import { faGithub, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { VIcon } from 'void-design-vue'

const socials = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/Cokoii', icon: faGithub },
  { key: 'telegram', label: 'Telegram', href: 'https://t.me/Cokoii', icon: faTelegram },
]
</script>

<template>
  <div class="About">
    <div class="info">
      <img loading="lazy" src="https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640" alt="Avatar" />
      <div class="desc">
        <h2>Front‑End Developer 🧑🏻‍💻</h2>
        <p>Full‑stack developer</p>
        <p>Welcome to my personal page!</p>
      </div>
      <div class="socials">
        <a
          v-for="s in socials"
          :key="s.key"
          class="social-link"
          :class="s.key"
          :href="s.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="s.label"
        >
          <VIcon :icon="s.icon" />
          {{ s.label }}
        </a>
      </div>
    </div>
    <div class="chart-scroll">
      <img loading="lazy" src="https://ghchart.rshah.org/Cokoii" alt="GitHub contribution graph" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
