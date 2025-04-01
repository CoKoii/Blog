<script setup lang="ts">
import { Row, Col } from 'ant-design-vue'
import { SoundOutlined, GithubFilled, SettingFilled } from '@ant-design/icons-vue'
import changeTheme from '@/components/changeTheme.vue'
import { ref } from 'vue'
import PhoneLogin from './PhoneLogin.vue'
import AccountLogin from './AccountLogin.vue'
import QrcodeLogin from './QrcodeLogin.vue'
import SocialLogin from './SocialLogin.vue'

const step = ref(1)

const switchToPhoneLogin = () => {
  step.value = 0
}

const switchToAccountLogin = () => {
  step.value = 1
}
const switchToQrcodeLogin = () => {
  step.value = 2
}
</script>

<template>
  <div class="loginContainer">
    <Row>
      <Col :xs="0" :sm="0" :md="0" :lg="12" :xl="16" :xxl="16" class="banner"></Col>
      <Col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" :xxl="8" class="loginArea">
        <div class="themeTool">
          <SettingFilled />
          <SoundOutlined />
          <changeTheme />
          <GithubFilled />
        </div>
        <div class="form-container">
          <div class="form-slider" :class="`step-${step}`">
            <PhoneLogin @switchToAccountLogin="switchToAccountLogin">
              <template #footer>
                <SocialLogin />
              </template>
            </PhoneLogin>

            <AccountLogin
              @switchToPhoneLogin="switchToPhoneLogin"
              @switchToQrcodeLogin="switchToQrcodeLogin"
            >
              <template #footer>
                <SocialLogin />
              </template>
            </AccountLogin>

            <QrcodeLogin @switchToAccountLogin="switchToAccountLogin">
              <template #footer>
                <SocialLogin />
              </template>
            </QrcodeLogin>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<style scoped lang="scss">
@import url(./index.scss);

.form-container {
  width: 100%;
  perspective: 1000px;
  position: relative;
}

.form-slider {
  display: flex;
  width: 300%;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.step-0 {
    transform: translateX(0);
  }

  &.step-1 {
    transform: translateX(-33.333%);
  }

  &.step-2 {
    transform: translateX(-66.666%);
  }
}

.form-panel {
  width: 33.333%;
  box-sizing: border-box;
  opacity: 1;
  transition:
    opacity 0.2s ease,
    transform 0.3s ease;

  &:nth-child(1) {
    .step-1 &,
    .step-2 & {
      opacity: 0;
      transform: translateX(-30px);
      pointer-events: none;
    }
  }

  &:nth-child(2) {
    .step-0 & {
      opacity: 0;
      transform: translateX(30px);
      pointer-events: none;
    }
    .step-2 & {
      opacity: 0;
      transform: translateX(-30px);
      pointer-events: none;
    }
  }

  &:nth-child(3) {
    .step-0 &,
    .step-1 & {
      opacity: 0;
      transform: translateX(30px);
      pointer-events: none;
    }
  }
}
</style>
