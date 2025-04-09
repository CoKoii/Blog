<script setup lang="ts">
import { ScanOutlined, CloseOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons-vue'
import { ref, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  disableFlip: true,
}

const showScanner = ref(false)
const scannerRef = ref<HTMLDivElement | null>(null)
let html5QrCode: Html5Qrcode | null = null
const isScanning = ref(false)
const scanResults = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const scanMode = ref<'camera' | 'upload'>('camera')
const isProcessingImage = ref(false)

const scanQR = () => {
  scanMode.value = 'camera'
  scanResults.value = ''
  isProcessingImage.value = false

  showScanner.value = true
  setTimeout(startScanner, 0)
}

const closeScanner = () => {
  if (html5QrCode && isScanning.value) {
    html5QrCode.stop().catch((error) => console.error('停止扫描出错:', error))
  }
  showScanner.value = false
  isScanning.value = false
  scanResults.value = ''
}

const handleScanSuccess = (decodedText: string) => {
  scanResults.value = decodedText
  alert('扫描结果: ' + decodedText)
  closeScanner()
}

const getCameraId = async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (!devices?.length) return null

    const backCameraKeywords = ['back', '环境', 'rear', 'environment', '后置']

    const backCamera = devices.find((device) => {
      const label = device.label.toLowerCase()
      return backCameraKeywords.some((keyword) => label.includes(keyword))
    })

    return backCamera?.id || devices[0].id
  } catch (error) {
    console.error('获取摄像头列表失败:', error)
    return null
  }
}

const tryFallbackCamera = async () => {
  try {
    if (!html5QrCode) return false

    await html5QrCode.start(
      { facingMode: 'environment' },
      SCANNER_CONFIG,
      handleScanSuccess,
      undefined,
    )
    return true
  } catch (error) {
    console.error('后备摄像头启动失败:', error)
    return false
  }
}

const startScanner = async () => {
  if (!scannerRef.value || isScanning.value) return

  try {
    html5QrCode = new Html5Qrcode('reader')
    isScanning.value = true

    const cameraId = await getCameraId()

    if (cameraId) {
      await html5QrCode.start(cameraId, SCANNER_CONFIG, handleScanSuccess, undefined)
    } else {
      await html5QrCode.start(
        { facingMode: { exact: 'environment' } },
        SCANNER_CONFIG,
        handleScanSuccess,
        undefined,
      )
    }
  } catch (error) {
    console.error('启动扫描器出错:', error)
    isScanning.value = false

    if (!(await tryFallbackCamera())) {
      alert('无法启动摄像头，请确保已授予摄像头权限，或尝试使用其他浏览器')
      closeScanner()
    }
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  try {
    isProcessingImage.value = true

    const tempHtml5Qrcode = new Html5Qrcode('reader-temp')

    const result = await tempHtml5Qrcode.scanFile(files[0], true)

    handleScanSuccess(result)
  } catch (error) {
    console.error('图片解析失败:', error)
    alert('无法从图片中识别二维码，请尝试其他图片或使用相机扫描')
  } finally {
    isProcessingImage.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const triggerFileUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const switchScanMode = (mode: 'camera' | 'upload') => {
  if (scanMode.value === mode) return

  scanMode.value = mode

  if (mode === 'upload' && html5QrCode && isScanning.value) {
    html5QrCode.stop().catch((error) => console.error('停止扫描出错:', error))
    isScanning.value = false
  } else if (mode === 'camera') {
    startScanner()
  }
}

onUnmounted(() => {
  if (html5QrCode && isScanning.value) {
    html5QrCode.stop().catch((error) => console.error('停止扫描出错:', error))
  }
})
</script>

<template>
  <div class="scan-trigger" @click="scanQR"><ScanOutlined style="margin-right: 8px" /> 扫一扫</div>

  <teleport to="body">
    <div v-if="showScanner" class="scanner-fullscreen">
      <div class="scanner-content" ref="scannerRef">
        <div id="reader" v-show="scanMode === 'camera'"></div>
        <div id="reader-temp" style="display: none"></div>

        <div v-show="scanMode === 'upload'" class="upload-area">
          <div class="upload-box" @click="triggerFileUpload">
            <UploadOutlined class="upload-icon" />
            <p class="upload-text">点击上传二维码图片</p>
            <input
              type="file"
              ref="fileInputRef"
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
            />
          </div>
          <div v-if="isProcessingImage" class="processing-indicator">正在处理图片...</div>
        </div>

        <div class="scanner-header">
          <div class="control-btn close-btn" @click="closeScanner">
            <CloseOutlined />
          </div>
          <div class="header-title">扫一扫</div>
          <div class="placeholder"></div>
        </div>

        <div class="scanner-footer">
          <div
            class="mode-btn"
            :class="{ active: scanMode === 'camera' }"
            @click="switchScanMode('camera')"
          >
            <CameraOutlined class="mode-icon" />
            <span>相机扫描</span>
          </div>
          <div
            class="mode-btn"
            :class="{ active: scanMode === 'upload' }"
            @click="switchScanMode('upload')"
          >
            <UploadOutlined class="mode-icon" />
            <span>图片上传</span>
          </div>
        </div>

        <div class="scan-frame" v-show="scanMode === 'camera'">
          <div class="corner-box left-top"></div>
          <div class="corner-box right-top"></div>
          <div class="corner-box left-bottom"></div>
          <div class="corner-box right-bottom"></div>
          <div class="scan-line"></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.scan-trigger {
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

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
  width: 40px;
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

:deep(#reader) {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
}

:deep(#reader video) {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(#reader img),
:deep(#reader div[style*='border']),
:deep(#qr-shaded-region),
:deep(.qr-region-highlighted),
:deep(#reader__dashboard_section_csr),
:deep(#reader__dashboard_section_fsr),
:deep(#reader__dashboard_section_swaplink),
:deep(#reader__status_span) {
  display: none !important;
}

:deep(#reader__scan_region) {
  background: transparent !important;
  border: none !important;
}

.scan-frame {
  position: absolute;
  width: 250px;
  height: 250px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
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

.scanner-footer {
  position: fixed;
  bottom: 30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
}

.mode-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  padding: 6px 12px;
  margin: 0 30px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
}

.mode-btn.active {
  color: #fff;
  background-color: #1aad19;
}

.mode-icon {
  font-size: 16px;
  margin-right: 4px;
}

.upload-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 260px;
  border: 2px dashed #666;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #1aad19;
  background-color: rgba(26, 173, 25, 0.1);
}

.upload-icon {
  font-size: 48px;
  color: #1aad19;
  margin-bottom: 16px;
}

.upload-text {
  color: #ddd;
  font-size: 16px;
}

.processing-indicator {
  margin-top: 20px;
  color: #1aad19;
  font-size: 16px;
}
</style>
