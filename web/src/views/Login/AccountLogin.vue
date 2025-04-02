<script setup lang="ts">
import { Form, Input, Button, Checkbox, Row, Col } from 'ant-design-vue'
import { ref } from 'vue'
import dragVerify from '@/components/dragVerify.vue'

const verifyRef = ref()
const emit = defineEmits(['switchToPhoneLogin', 'switchToQrcodeLogin'])
</script>

<template>
  <Form class="form-panel" :wrapperCol="{ span: 24 }">
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
      <Button type="primary" block style="height: 35px">登录</Button>
    </Form.Item>
    <Form.Item>
      <Row :gutter="24">
        <Col :span="12">
          <Button block style="height: 35px" @click="emit('switchToPhoneLogin')">手机号登录</Button>
        </Col>
        <Col :span="12">
          <Button block style="height: 35px" @click="emit('switchToQrcodeLogin')">扫码登录</Button>
        </Col>
      </Row>
    </Form.Item>
    <slot name="footer"></slot>
  </Form>
</template>
<style lang="scss" scoped>
h1 {
  font-size: 36px;
  user-select: none;
}
.subTitle {
  user-select: none;
  margin-top: -20px;
  font-size: 14px;
  margin-bottom: 30px;
}
</style>
