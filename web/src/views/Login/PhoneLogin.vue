<script setup lang="ts">
import { Form, Input, Button, message } from 'ant-design-vue'
import { ref, reactive, computed } from 'vue'
import dragVerify from '@/components/dragVerify.vue'

const verifyRef = ref()
const phoneLogin = reactive({
  phone: '',
  code: '',
  rule: false,
})
const truePhone = computed(() => phoneLogin.phone.length === 11)

const countdown = ref(0)
const isCountingDown = computed(() => countdown.value > 0)

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendVerificationCode = () => {
  if (isCountingDown.value) return
  message.success('验证码正在发送中...')
  startCountdown()
}

const handleVerifySuccess = () => {
  message.success('验证码正在发送中...')
  phoneLogin.rule = true
  startCountdown()
}

const emit = defineEmits(['switchToAccountLogin'])
</script>

<template>
  <Form class="form-panel" :wrapperCol="{ span: 24 }">
    <h1>手机号登录 📱</h1>
    <div class="subTitle">请输入您的帐户信息以开始管理您的项目</div>
    <Form.Item name="phone">
      <Input placeholder="请输入11位手机号" v-model:value="phoneLogin.phone" style="height: 45px" />
    </Form.Item>
    <Form.Item v-if="truePhone" class="animate__animated animate__fadeIn">
      <dragVerify ref="verifyRef" style="width: 100%" @success="handleVerifySuccess" />
    </Form.Item>
    <Form.Item name="code" v-if="phoneLogin.rule" class="animate__animated animate__fadeIn">
      <Input placeholder="请输入验证码" v-model:value="phoneLogin.code" style="height: 45px" />
    </Form.Item>
    <Form.Item>
      <Button
        type="link"
        style="padding: 0; background: none"
        v-if="phoneLogin.rule"
        :disabled="isCountingDown"
        @click="sendVerificationCode"
      >
        {{ isCountingDown ? `重新发送(${countdown}s)` : '重新发送' }}
      </Button>
      <p style="float: right; cursor: pointer" @click="emit('switchToAccountLogin')">
        账号密码登录
      </p>
    </Form.Item>
    <Form.Item>
      <Button type="primary" block style="height: 35px">登录</Button>
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
