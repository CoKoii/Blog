<script setup lang="ts">
import { faAddressCard, faCompass, faFolderOpen, faHome } from '@fortawesome/free-regular-svg-icons'
import { VIcon } from 'void-design-vue'

type MenuItem = {
  to: string
  label: string
  icon?: unknown
}

type TagItem = {
  to: string
  label: string
  color: string
}

const mainMenus: MenuItem[] = [
  { to: '/home', label: 'Home', icon: faHome },
  { to: '/archive', label: 'Archive', icon: faFolderOpen },
  { to: '/about', label: 'About', icon: faAddressCard },
]

const moreMenus: MenuItem[] = [{ to: '/more', label: '正在发掘...', icon: faCompass }]

const tags: TagItem[] = [
  { to: '/vuejs', label: 'VueJs', color: '#ff5f57' },
  { to: '/javascript', label: 'JavaScript', color: '#febc2e' },
  { to: '/nodejs', label: 'Node.js', color: '#28c840' },
]
</script>

<template>
  <div class="Menus">
    <!-- 主页面菜单 -->
    <ul class="menus_main">
      <li v-for="item in mainMenus" :key="item.to">
        <router-link :to="item.to" active-class="active">
          <VIcon v-if="item.icon" :icon="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
    <div class="line"></div>
    <!-- 更多功能 -->
    <h1 class="title">More Features</h1>
    <ul class="menus_main">
      <li v-for="item in moreMenus" :key="item.to">
        <router-link :to="item.to" active-class="active">
          <VIcon v-if="item.icon" :icon="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
    <!-- 标签 -->
    <h1 class="title">Tags</h1>
    <ul class="menus_main">
      <li v-for="tag in tags" :key="tag.to">
        <router-link :to="tag.to" active-class="active">
          <span class="dots" :style="{ backgroundColor: tag.color }"></span>
          <span>{{ tag.label }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
