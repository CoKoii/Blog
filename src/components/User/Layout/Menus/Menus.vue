<script setup lang="ts">
import { faAddressCard, faFolderOpen, faHome } from '@fortawesome/free-regular-svg-icons'
import { VIcon } from 'void-design-vue'
</script>

<template>
  <div class="Menus">
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
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
