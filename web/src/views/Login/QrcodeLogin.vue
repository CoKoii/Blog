<script setup lang="ts">
import { Form } from 'ant-design-vue'
import QrcodeVue from 'qrcode.vue'

const emit = defineEmits(['switchToAccountLogin'])
</script>

<template>
  <Form class="form-panel" :wrapperCol="{ span: 24 }">
    <h1>扫一扫</h1>
    <div class="subTitle">用登录账号扫描下方二维码即可登录哦</div>
    <qrcode-vue
      :value="String(new Date())"
      :size="250"
      level="Q"
      render-as="svg"
      :margin="2"
      background="var(--text-color-light)"
      foreground="var(--text-color-dark)"
      style="
        margin: 50px auto;
        display: block;
        border-radius: 10%;
        padding: 10px;
        border: 4px dashed var(--text-color-grey);
        box-sizing: border-box;
      "
    />
    <Form.Item>
      <Form.Item name="remember" valuePropName="checked" no-style>
        <a @click="emit('switchToAccountLogin')">账号密码登录</a>
      </Form.Item>
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
