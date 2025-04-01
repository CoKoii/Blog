<script setup lang="ts">
import { Row, Col, Form, Input, Button, Checkbox, Divider } from 'ant-design-vue'
import { SoundOutlined, GithubFilled, SettingFilled } from '@ant-design/icons-vue'
import changeTheme from '@/components/changeTheme.vue'
import { ref } from 'vue'
import dragVerify from '@/components/dragVerify.vue'

const verifyRef = ref()
</script>
<template>
  <div class="loginContainer">
    <Row class="logo">
      <Col>
        <img src="../../assets/logo.png" alt="" />
      </Col>
      <Col> 躺不平的咸鱼 </Col>
    </Row>
    <Row>
      <Col :xs="0" :sm="0" :md="0" :lg="12" :xl="16" :xxl="16" class="banner"> </Col>
      <Col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" :xxl="8" class="loginArea">
        <div class="themeTool">
          <SettingFilled />
          <SoundOutlined />
          <changeTheme />
          <GithubFilled />
        </div>
        <Form style="width: 100%" :wrapperCol="{ span: 24 }">
          <h1>欢迎回来 👋🏻</h1>
          <div class="subTitle">请输入您的帐户信息以开始管理您的项目</div>
          <Form.Item name="username">
            <Input placeholder="请输入用户名" style="height: 40px" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password placeholder="请输入密码" style="height: 40px" />
          </Form.Item>
          <Form.Item>
            <dragVerify ref="verifyRef" style="width: 100%" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" no-style>
              <Checkbox style="color: var(--text-primary)">记住我</Checkbox>
            </Form.Item>
            <a style="float: right" href="">忘记密码</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block style="height: 40px">登录</Button>
          </Form.Item>
          <Form.Item>
            <Row :gutter="24">
              <Col :span="12">
                <Button block style="height: 40px">注册</Button>
              </Col>
              <Col :span="12">
                <Button block style="height: 40px">扫码登录</Button>
              </Col>
            </Row>
          </Form.Item>
          <Divider style="font-weight: normal; font-size: 12px; color: var(--text-primary)"
            >其他登录方式</Divider
          >
          <Row
            style="
              font-size: 16px;
              display: flex;
              justify-content: center;
              gap: 20px;
              margin: 30px auto;
              opacity: 0.6;
            "
          >
            <SettingFilled />
            <SoundOutlined />
            <changeTheme />
            <GithubFilled />
          </Row>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<style scoped lang="scss">
@import url(./index.scss);
.ant-input,
.ant-input-password {
  background-color: var(--input-bg) !important;
  border-color: var(--input-border) !important;
  color: var(--input-text) !important;

  &::placeholder {
    color: var(--input-placeholder) !important;
  }

  &:hover {
    border-color: var(--input-hover-border) !important;
  }

  &:focus {
    border-color: var(--input-focus-border) !important;
    box-shadow: 0 0 0 2px var(--input-focus-shadow) !important;
  }
}

.ant-input-password {
  background-color: var(--input-bg) !important;
  border-color: var(--input-border) !important;

  &:hover {
    border-color: var(--input-hover-border) !important;
  }

  &:focus,
  &-focused {
    border-color: var(--input-focus-border) !important;
    box-shadow: 0 0 0 2px var(--input-focus-shadow) !important;
  }

  // 密码输入框内部的实际输入元素
  .ant-input {
    background-color: transparent !important;
    color: var(--input-text) !important;

    &::placeholder {
      color: var(--input-placeholder) !important;
    }
  }

  // 密码可见性切换图标
  .anticon {
    color: var(--input-placeholder) !important;

    &:hover {
      color: var(--input-hover-border) !important;
    }
  }
}

// 普通按钮样式
.ant-btn:not(.ant-btn-primary) {
  background-color: var(--button-bg) !important;
  border-color: var(--button-border) !important;
  color: var(--button-text) !important;

  &:hover {
    background-color: var(--button-hover-bg) !important;
    border-color: var(--button-hover-border) !important;
  }

  &:active {
    background-color: var(--button-active-bg) !important;
  }
}
</style>
