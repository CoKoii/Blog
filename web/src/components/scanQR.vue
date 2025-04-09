<script setup lang="ts">
import { ScanOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const showScanner = ref(false)
const scannerRef = ref<HTMLDivElement | null>(null)
let html5QrCode: Html5Qrcode | null = null
const isScanning = ref(false)

// 打开扫码界面
const scanQR = () => {
  showScanner.value = true
  // 在下一个DOM更新周期启动扫描器
  setTimeout(() => {
    startScanner()
  }, 100)
}

// 关闭扫码界面
const closeScanner = () => {
  if (html5QrCode) {
    html5QrCode.stop().catch((error) => console.error('停止扫描出错:', error))
  }
  showScanner.value = false
  isScanning.value = false
}

// 初始化并启动扫描器 - 全屏优化版本
const startScanner = async () => {
  if (!scannerRef.value || isScanning.value) return

  try {
    // 初始化扫描器
    html5QrCode = new Html5Qrcode('reader')
    isScanning.value = true

    const qrCodeSuccessCallback = (decodedText: string) => {
      // 扫描成功，使用alert显示结果
      alert('扫描结果: ' + decodedText)
      closeScanner()
    }

    // 使用固定大小的二维码扫描框，不随容器变化
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: true,
    }

    await html5QrCode.start(
      { facingMode: 'environment' }, // 使用后置摄像头
      config,
      qrCodeSuccessCallback,
      undefined,
    )
  } catch (error) {
    console.error('标准模式启动扫描器出错:', error)
    isScanning.value = false

    try {
      if (html5QrCode) {
        isScanning.value = true
        await html5QrCode.start(
          true, // 使用默认设备
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            alert('扫描结果: ' + decodedText)
            closeScanner()
          },
          undefined,
        )
      }
    } catch (fallbackError) {
      console.error('备用扫描模式失败:', fallbackError)
      isScanning.value = false

      try {
        if (html5QrCode) {
          const cameraId = await getCameraId()
          if (cameraId) {
            isScanning.value = true
            await html5QrCode.start(
              cameraId,
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => {
                alert('扫描结果: ' + decodedText)
                closeScanner()
              },
              undefined,
            )
          } else {
            throw new Error('未找到可用摄像头')
          }
        }
      } catch (lastError) {
        console.error('所有扫描模式都失败:', lastError)
        alert('无法启动摄像头，请确保已授予摄像头权限，或尝试使用其他浏览器')
        closeScanner()
      }
    }
  }
}

// 获取可用的摄像头ID
const getCameraId = async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length) {
      return devices[0].id // 返回第一个可用摄像头
    }
    return null
  } catch (error) {
    console.error('获取摄像头列表失败:', error)
    return null
  }
}

// 组件卸载时确保停止扫描
onUnmounted(() => {
  if (html5QrCode) {
    html5QrCode.stop().catch((error) => console.error('停止扫描出错:', error))
  }
})
</script>

<template>
  <div
    style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center"
    @click="scanQR"
  >
    <ScanOutlined style="margin-right: 8px" /> 扫一扫
  </div>

  <!-- 扫码全屏模态框放在body层级，避免定位问题 -->
  <teleport to="body">
    <div v-if="showScanner" class="scanner-fullscreen">
      <div class="scanner-content" ref="scannerRef">
        <!-- 摄像头区域 -->
        <div id="reader"></div>

        <!-- 顶部控制区域 -->
        <div class="scanner-header">
          <div class="control-btn close-btn" @click="closeScanner">
            <CloseOutlined />
          </div>
          <div class="header-title">扫一扫</div>
          <div class="placeholder"></div>
        </div>

        <!-- 扫描框UI -->
        <div class="scan-frame">
          <div class="corner-box left-top"></div>
          <div class="corner-box right-top"></div>
          <div class="corner-box left-bottom"></div>
          <div class="corner-box right-bottom"></div>

          <!-- 扫描线 -->
          <div class="scan-line"></div>
        </div>

        <div class="scan-hint">将二维码放入框内，即可自动扫描</div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.scanner-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 2000;
}

.scanner-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scanner-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  z-index: 30;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.placeholder {
  width: 40px; /* 与关闭按钮宽度相同，保持标题居中 */
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
}

.close-btn {
  font-size: 18px;
}

#reader {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
}

#reader video {
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* 隐藏Html5Qrcode库的UI元素，我们使用自定义UI */
:deep(#reader img),
:deep(#reader div[style*='border']) {
  display: none !important;
}

/* 隐藏Html5Qrcode库自带的扫描框 */
:deep(#qr-shaded-region),
:deep(.qr-region-highlighted) {
  display: none !important;
  border: none !important;
}

/* 确保库内部的元素不影响我们的UI */
:deep(#reader__scan_region) {
  background: transparent !important;
  border: none !important;
}

/* 隐藏所有可能的按钮和控制元素 */
:deep(#reader__dashboard_section_csr),
:deep(#reader__dashboard_section_fsr),
:deep(#reader__dashboard_section_swaplink),
:deep(#reader__status_span) {
  display: none !important;
}

.scan-frame {
  position: absolute;
  width: 250px;
  height: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  border: none;
}

.corner-box {
  position: absolute;
  width: 25px;
  height: 25px;
  border-color: #1aad19;
  border-style: solid;
  border-width: 0;
}

.left-top {
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
}

.right-top {
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
}

.left-bottom {
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
}

.right-bottom {
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #1aad19;
  top: 0;
  left: 0;
  animation: scanAnimation 2s linear infinite;
}

@keyframes scanAnimation {
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 2px);
  }
  100% {
    top: 0;
  }
}

.scan-hint {
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 16px;
  padding: 8px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}
</style>
