<script setup lang="ts">
import { Row, Col, Form, Input, Button, Checkbox } from 'ant-design-vue'
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
      <Col :xs="0" :sm="0" :md="0" :lg="12" :xl="16" :xxl="16" class="banner">
        <img src="../../assets/Code3D.webp" alt="" />
        <h1>开箱即用的大型中后台管理系统</h1>
        <p>工程化、高性能、跨组件库的前端模版，为您的项目开发提供强大支持</p>
      </Col>
      <Col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" :xxl="8" class="loginArea">
        <Form style="width: 100%" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
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
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a style="float: right" href="">忘记密码</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block>登录</Button>
          </Form.Item>
          <Form.Item>
            <Row :gutter="24">
              <Col :span="12">
                <Button block>注册</Button>
              </Col>
              <Col :span="12">
                <Button block>第三方登录</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<style scoped lang="scss">
@import url(./index.scss);
</style>
