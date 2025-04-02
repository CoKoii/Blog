<script setup lang="ts">
import { PieChartOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="layout">
    <div class="navigation">
      <div class="logo_nav">
        <div class="logo">
          <img src="../../assets/logo.png" alt="" />
          <h1>躺不平的咸鱼</h1>
        </div>
        <div class="nav">
          <ul>
            <router-link to="/home" active-class="active" class="li">
              <div class="text"><PieChartOutlined />仪表盘</div></router-link
            >
            <router-link to="/home/1" class="li"
              ><div class="text"><PieChartOutlined />音乐</div></router-link
            >
            <router-link to="/home/2" class="li"
              ><div class="text"><PieChartOutlined />在线网盘</div></router-link
            >
          </ul>
        </div>
      </div>
      <div class="ai">
        <img src="../../assets/ai.png" alt="" />
      </div>
    </div>
    <div class="content">
      <div class="menu">
        <div class="top">1</div>
        <div class="bottom">2</div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url(./index.scss);
</style>
