<script setup lang="ts">
import { Divider, Row } from 'ant-design-vue'
import {
  WechatFilled,
  QqCircleFilled,
  AlipayCircleFilled,
  GithubFilled,
} from '@ant-design/icons-vue'
</script>

<template>
  <Divider style="font-weight: normal; font-size: 16px">其他登录方式</Divider>
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
    <WechatFilled />
    <QqCircleFilled />
    <AlipayCircleFilled />
    <GithubFilled />
  </Row>
</template>
