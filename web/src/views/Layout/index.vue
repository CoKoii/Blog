<script setup lang="ts">
import {
  FileTextOutlined,
  GithubOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'
import { useSystemStore } from '@/stores/system'
import ChangeTheme from '@/components/changeTheme.vue'
import { Popover } from 'ant-design-vue'
import Weather from '@/components/weather.vue'
import ScanQR from '@/components/scanQR.vue'

const systemStore: any = useSystemStore()

const hideMenu = () => {
  systemStore.system.hiddenMenu = true
}
const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  window.location.href = '/login'
}
</script>

<template>
  <div class="layout">
    <div class="nav-overlay" v-if="!systemStore.system.hiddenMenu" @click="hideMenu"></div>
    <div
      class="navigation"
      :style="{
        width: systemStore.system.hiddenMenu ? '0' : '240px',
        opacity: systemStore.system.hiddenMenu ? '0' : '1',
      }"
    >
      <div class="logo_nav">
        <div class="logo">
          <img src="../../assets/logo.webp" alt="" />
          <h1>躺不平的咸鱼</h1>
        </div>
        <div class="nav">
          <ul>
            <li>
              <router-link to="/home" active-class="active">
                <div class="text"><PieChartOutlined />仪表盘</div></router-link
              >
            </li>
            <li>
              <router-link to="/home/1"
                ><div class="text"><PieChartOutlined />音乐</div></router-link
              >
            </li>
            <li>
              <router-link to="/home/2"
                ><div class="text"><PieChartOutlined />在线网盘</div></router-link
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="ai">
        <img src="../../assets/ai.webp" alt="" />
      </div>
    </div>
    <div class="content">
      <div class="menu">
        <div class="left">
          <MenuUnfoldOutlined
            @click="systemStore.system.hiddenMenu = !systemStore.system.hiddenMenu"
            v-if="systemStore.system.hiddenMenu"
          />
          <MenuFoldOutlined
            @click="systemStore.system.hiddenMenu = !systemStore.system.hiddenMenu"
            v-else
          />
          {{ $route.name }}
        </div>
        <div class="right">
          <Weather></Weather>
          <ChangeTheme></ChangeTheme>
          <Popover placement="bottomRight">
            <template #content>
              <div style="width: 250px">
                <!-- 用户信息 -->
                <div
                  style="
                    display: flex;
                    align-items: center;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                  "
                >
                  <img
                    src="../../assets/logo.webp"
                    class="avatar"
                    alt="avatar"
                    style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px"
                  />
                  <div>
                    <div style="font-weight: bold">
                      曹凯
                      <span
                        style="
                          background: #f6ffed;
                          color: #52c41a;
                          border-radius: 4px;
                          padding: 0 4px;
                          font-size: 12px;
                        "
                        >前端开发工程师</span
                      >
                    </div>
                    <div style="font-size: 12px; color: #888">2655257336@qq.com</div>
                  </div>
                </div>

                <!-- 菜单项 -->
                <div style="padding-top: 12px">
                  <div
                    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
                    class="avator-hover"
                  >
                    <FileTextOutlined style="margin-right: 8px" /> 文档
                  </div>
                  <div
                    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
                    class="avator-hover"
                  >
                    <GithubOutlined style="margin-right: 8px" /> GitHub
                  </div>
                  <div
                    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
                    class="avator-hover"
                  >
                    <QuestionCircleOutlined style="margin-right: 8px" /> 问题 & 帮助
                  </div>
                  <div
                    style="
                      border-top: 1px solid var(--border-color);
                      margin-top: 8px;
                      margin-bottom: 8px;
                    "
                  ></div>
                  <ScanQR></ScanQR>
                  <div
                    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
                    class="avator-hover"
                    @click="logout"
                  >
                    <LogoutOutlined style="margin-right: 8px" /> 退出登录
                  </div>
                </div>
              </div>
            </template>
            <img src="../../assets/logo.webp" alt="" style="cursor: pointer" />
          </Popover>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url(./index.scss);

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: none;
}
.avator-hover {
  transition:
    color 0.3s,
    transform 0.3s;
  &:hover {
    outline: 2px dashed #9279ff;
    border-radius: 10px;
    color: #9279ff;
    transform: scale(1.015);
  }
}
.avatar {
  transition: all 0.3s;
  &:hover {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 768px) {
  .nav-overlay {
    display: block;
  }
}
</style>
