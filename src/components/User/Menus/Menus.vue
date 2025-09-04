<script setup lang="ts">
import { VThemeToggle } from 'void-design-vue'
defineOptions({
  name: 'Menus',
})
</script>

<template>
  <div class="Menus">
    <div class="logo"></div>
    <ul>
      <li>
        <a href="">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </a>
      </li>
      <li>
        <a href="">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </a>
      </li>
      <li>
        <a href="">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </a>
      </li>
      <li>
        <a href="">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </a>
      </li>
    </ul>
    <VThemeToggle />
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
