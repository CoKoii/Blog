<script setup lang="ts">
import {
  AppstoreOutlined,
  FileTextOutlined,
  GithubOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'
import { useSystemStore } from '@/stores/system'
import ChangeTheme from '@/components/changeTheme.vue'
import { Popover } from 'ant-design-vue'

const systemStore: any = useSystemStore()

const hideMenu = () => {
  systemStore.system.hiddenMenu = true
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
                    border-bottom: 1px solid #f0f0f0;
                  "
                >
                  <img
                    src="../../assets/logo.png"
                    alt="avatar"
                    style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px"
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
                  <div style="padding: 8px 0; cursor: pointer; display: flex; align-items: center">
                    <FileTextOutlined style="margin-right: 8px" /> 文档
                  </div>
                  <div style="padding: 8px 0; cursor: pointer; display: flex; align-items: center">
                    <GithubOutlined style="margin-right: 8px" /> GitHub
                  </div>
                  <div style="padding: 8px 0; cursor: pointer; display: flex; align-items: center">
                    <QuestionCircleOutlined style="margin-right: 8px" /> 问题 & 帮助
                  </div>
                  <div style="border-top: 1px solid #f0f0f0; margin-top: 8px"></div>
                  <div style="padding: 8px 0; cursor: pointer; display: flex; align-items: center">
                    <LockOutlined style="margin-right: 8px" /> 锁定屏幕
                  </div>
                  <div style="padding: 8px 0; cursor: pointer; display: flex; align-items: center">
                    <LogoutOutlined style="margin-right: 8px" /> 退出登录
                  </div>
                </div>
              </div>
            </template>
            <img src="../../assets/logo.png" alt="" />
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

@media screen and (max-width: 768px) {
  .nav-overlay {
    display: block;
  }
}
</style>
