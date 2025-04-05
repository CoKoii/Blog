<script setup lang="ts">
import { Form, Input, Button, Checkbox, Row, Col, message } from 'ant-design-vue'
import { ref, computed } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import dragVerify from '@/components/dragVerify.vue'

// 表单验证规则
const formRules: any = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
} as const

// 优化问候语逻辑
const getGreeting = () => {
  const hours = new Date().getHours()
  const greetings = {
    morning: { text: '早上好😄', range: [0, 12] },
    afternoon: { text: '下午好🫠', range: [12, 18] },
    evening: { text: '晚上好🥱', range: [18, 24] },
  }

  return (
    Object.values(greetings).find(({ range: [start, end] }) => hours >= start && hours < end)
      ?.text || greetings.morning.text
  )
}

const time = computed(getGreeting)
const verifyRef = ref()
const formRef = ref()
const loading = ref(false)
const scroll = ref(false)

const accountForm = ref({
  username: '',
  password: '',
  remember: false,
})

const emit = defineEmits(['switchToPhoneLogin', 'switchToQrcodeLogin'])

const onSuccess = () => {
  scroll.value = true
}

const login = async () => {
  if (loading.value) return

  try {
    loading.value = true
    await formRef.value.validate()

    if (!scroll.value) {
      verifyRef.value.showError()
      message.error('请先完成验证')
      return
    }

    // 登录逻辑
    await handleLogin(accountForm.value)
    message.success('登录成功')
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    } else {
      message.error('登录失败，请稍后重试')
    }
    console.error('登录错误:', error)
  } finally {
    loading.value = false
  }
}

// 处理登录请求
const handleLogin = async (formData: any) => {
  // 这里添加实际的登录API调用
  console.log('登录表单数据:', formData)
}
</script>

<template>
  <Form
    class="form-panel"
    :wrapperCol="{ span: 24 }"
    :rules="formRules"
    ref="formRef"
    :model="accountForm"
  >
    <h1>Hi,{{ time }}</h1>
    <div class="subTitle">请输入您的帐户信息以开始管理您的项目</div>
    <Form.Item name="username">
      <Input placeholder="请输入用户名" style="height: 40px" v-model:value="accountForm.username">
        <template #prefix> <UserOutlined /> </template>
      </Input>
    </Form.Item>
    <Form.Item name="password">
      <Input.Password
        placeholder="请输入密码"
        style="height: 40px"
        v-model:value="accountForm.password"
      >
        <template #prefix> <LockOutlined /> </template>
      </Input.Password>
    </Form.Item>
    <Form.Item>
      <dragVerify ref="verifyRef" style="width: 100%" @success="onSuccess" />
    </Form.Item>
    <Form.Item>
      <Form.Item name="remember" valuePropName="checked" no-style>
        <Checkbox v-model:checked="accountForm.remember">记住我</Checkbox>
      </Form.Item>
      <a style="float: right" href="">申请加入</a>
    </Form.Item>
    <Form.Item>
      <Button type="primary" block style="height: 35px" @click="login" :loading="loading"
        >登录</Button
      >
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
