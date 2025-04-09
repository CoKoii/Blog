<script setup lang="ts">
import { ScanOutlined } from '@ant-design/icons-vue'
import { Html5Qrcode } from 'html5-qrcode'
import { ref } from 'vue'

let html5QrCode: any = null
const scanResult = ref('')
const isScanning = ref(false)

const start = () => {
  html5QrCode
    .start(
      // environment后置摄像头 user前置摄像头
      { facingMode: 'environment' },
      {
        fps: 2, // 可选，每秒帧扫描二维码
        qrbox: { width: 250, height: 250 }, // 可选，如果你想要有界框UI
      },
      (decodedText: any, decodedResult: any) => {
        // 处理扫码结果
        console.log('decodedText', decodedText)
        console.log('decodedResult', decodedResult)
        scanResult.value = decodedText
        stopScan()
      },
    )
    .catch((err: any) => {
      console.log('扫码错误信息', err)
      if (typeof err == 'string') {
        alert(err)
      } else {
        if (err.name == 'NotAllowedError') alert('您需要授予相机访问权限')
        if (err.name == 'NotFoundError') alert('这个设备上没有摄像头')
        if (err.name == 'NotSupportedError')
          alert('摄像头访问只支持在安全的上下文中，如https或localhost')
        if (err.name == 'NotReadableError') alert('相机被占用')
        if (err.name == 'OverconstrainedError') alert('安装摄像头不合适')
        if (err.name == 'StreamApiNotSupportedError') alert('此浏览器不支持流API')
      }
    })
}

const scanQR = () => {
  scanResult.value = ''
  isScanning.value = true
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        html5QrCode = new Html5Qrcode('reader')
        start()
      }
    })
    .catch((err: any) => {
      html5QrCode = new Html5Qrcode('reader')
      alert('您需要授予相机访问权限')
    })
}

const stopScan = () => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode
      .stop()
      .then(() => {
        console.log('QR Code scanning stopped.')
        isScanning.value = false
      })
      .catch((err: any) => {
        console.log('Unable to stop scanning.', err)
      })
  }
}
</script>

<template>
  <div>
    <div
      style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
      class="avator-hover"
      @click="scanQR"
    >
      <ScanOutlined style="margin-right: 8px" /> 扫一扫
    </div>

    <div v-if="isScanning" class="scanner-container">
      <div class="scanner-header">
        <h3>扫码</h3>
        <button @click="stopScan">取消扫码</button>
      </div>
      <div id="reader"></div>
    </div>

    <div v-if="scanResult" class="result-container">
      <h3>扫码结果：</h3>
      <p>{{ scanResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scanner-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: white;
}

#reader {
  width: 300px;
  height: 300px;
  background-color: white;
}

.result-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
