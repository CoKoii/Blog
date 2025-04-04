<template>
  <div class="error-page-container">
    <Result status="error" title="404" sub-title="抱歉，您访问的页面不存在">
      <template #extra>
        <Button key="home" type="primary" @click="goHome">返回首页</Button>
        <Button key="back" @click="goBack">返回上一页</Button>
      </template>

      <div class="desc">
        <p class="error-tip">
          <QuestionCircleOutlined :style="{ color: '#1890ff', marginRight: '8px' }" />
          <span>可能的原因：</span>
        </p>
        <ul class="error-list">
          <li>网址输入错误</li>
          <li>该页面已被移除或不存在</li>
          <li>您没有访问此页面的权限</li>
        </ul>
      </div>
    </Result>
  </div>
</template>
<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { Button, Result } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>
<style scoped>
.error-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

:deep(.ant-result) {
  width: 100vw;
  max-width: 800px;
  padding: 48px 32px;
  transform: scale(1.3);
}

.desc {
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  margin: 0 auto;
}

.error-tip {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.error-list {
  padding-left: 28px;
  color: #666;
}

.error-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>
