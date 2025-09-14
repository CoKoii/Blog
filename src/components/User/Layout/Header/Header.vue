<script setup lang="ts">
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { VIcon, VThemeToggle } from 'void-design-vue'
import { inject, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, type Ref } from 'vue'
const LayoutRef = inject<Ref<HTMLElement>>('layoutRef')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const onMenuClick = () => {
  LayoutRef?.value.classList.toggle('open')
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  document.body.style.overflow =
    isMobile && LayoutRef?.value.classList.contains('open') ? 'hidden' : 'auto'
}
const showSearch = ref(false)
const openSearch = () => {
  showSearch.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
  document.body.style.overflow = 'hidden'
}

const closeSearch = (e?: MouseEvent) => {
  if (!e || e.target === e.currentTarget) {
    showSearch.value = false
    document.body.style.overflow = 'auto'
  }
}
let handler: (e: KeyboardEvent) => void
onMounted(() => {
  handler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    const typing =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

    if (e.key === '/') {
      if (typing) return
      e.preventDefault()
      if (!showSearch.value) openSearch()
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      if (showSearch.value) closeSearch()
    }
  }
  window.addEventListener('keydown', handler)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handler)
})
</script>

<template>
  <div class="Header">
    <div class="title">
      <span @click="onMenuClick">
        <VIcon :icon="faBars" size="sm" />
      </span>
      <RouterLink to="/">Front End</RouterLink>
    </div>
    <button class="search" @click="openSearch">
      <VIcon :icon="faSearch" size="sm" />
      <span>Search</span>
      <span>/</span>
    </button>
    <div class="tools">
      <VThemeToggle />
    </div>
  </div>
  <teleport to="body">
    <transition>
      <div class="mask" v-if="showSearch" @click="closeSearch">
        <div class="search">
          <div class="search-container">
            <VIcon :icon="faSearch" />
            <input type="text" placeholder="搜索文章、标签、和作者..." ref="searchInputRef" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
