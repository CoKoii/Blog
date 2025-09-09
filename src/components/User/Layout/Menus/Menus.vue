<script setup lang="ts">
import { faAddressCard, faCompass, faFolderOpen, faHome } from '@fortawesome/free-regular-svg-icons'
import { VIcon } from 'void-design-vue'
</script>

<template>
  <div class="Menus">
    <!-- 主页面菜单 -->
    <ul class="menus_main">
      <li>
        <router-link to="/home" active-class="active">
          <VIcon :icon="faHome" />
          Home</router-link
        >
      </li>
      <li>
        <router-link to="/archive" active-class="active">
          <VIcon :icon="faFolderOpen" />
          Archive</router-link
        >
      </li>
      <li>
        <router-link to="/about" active-class="active">
          <VIcon :icon="faAddressCard" />
          About</router-link
        >
      </li>
    </ul>
    <div class="line"></div>
    <!-- 更多功能 -->
    <h1 class="title">More Features</h1>
    <ul class="menus_main">
      <li>
        <router-link to="/more" active-class="active">
          <VIcon :icon="faCompass" />
          正在发掘...</router-link
        >
      </li>
    </ul>
    <!-- 标签 -->
    <h1 class="title">Tags</h1>
    <ul class="menus_main">
      <li>
        <router-link to="/vuejs" active-class="active">
          <span class="dots" style="background-color: #ff5f57"></span>
          VueJs</router-link
        >
      </li>
      <li>
        <router-link to="/javascript" active-class="active">
          <span class="dots" style="background-color: #febc2e"></span>

          JavaScript</router-link
        >
      </li>
      <li>
        <router-link to="/nodejs" active-class="active">
          <span class="dots" style="background-color: #28c840"></span>

          Node.js</router-link
        >
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
