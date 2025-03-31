<template>
  <div class="drag-verify">
    <div class="drag-verify-container" :class="{ success: isPassing }">
      <!-- 添加进度条元素 -->
      <div class="drag-verify-progress" :style="{ width: progressWidth + 'px' }"></div>
      <div class="drag-verify-text">{{ isPassing ? props.successText : props.text }}</div>
      <div
        class="drag-verify-slider"
        @mousedown="handleMouseDown"
        :style="{ left: sliderLeft + 'px' }"
        ref="sliderRef"
      >
        <i class="drag-verify-icon">→</i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

interface Props {
  height?: number
  text?: string
  successText?: string
  successColor?: string
  backgroundColor?: string
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 40,
  text: '请向右滑动验证',
  successText: '验证通过',
  successColor: '#4CD964',
  backgroundColor: '#F1F3F6',
  borderColor: '#ddd',
})

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'fail'): void
}>()

const isPassing = ref(false)
const isMoving = ref(false)
const sliderLeft = ref(0)
const startX = ref(0)
const containerWidth = ref(0)
const maxLeft = ref(0)
const sliderRef = ref<HTMLElement | null>(null)

// 在模板中使用的计算属性
const containerHeight = computed(() => `${props.height}px`)
const containerLineHeight = computed(() => `${props.height}px`)

// 添加进度宽度计算属性
const progressWidth = computed(() => sliderLeft.value + 40) // 40px是滑块宽度

onMounted(() => {
  // 获取容器的实际宽度
  nextTick(() => {
    updateContainerWidth()
    // 监听窗口大小变化，更新宽度
    window.addEventListener('resize', updateContainerWidth)
  })

  // 添加全局鼠标事件
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onBeforeUnmount(() => {
  // 组件销毁前移除事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', updateContainerWidth)
})

const updateContainerWidth = () => {
  const el = document.querySelector('.drag-verify-container') as HTMLElement
  if (el) {
    containerWidth.value = el.offsetWidth
    // 计算滑块最大可滑动距离
    maxLeft.value = containerWidth.value - 40 // 40px 是滑块宽度
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (isPassing.value) return
  isMoving.value = true
  startX.value = event.clientX
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isMoving.value) return

  const currentX = event.clientX
  const moveX = currentX - startX.value

  // 计算滑块位置，不能超出边界
  sliderLeft.value = Math.max(0, Math.min(maxLeft.value, moveX))

  // 防止选中文本
  event.preventDefault()
}

const handleMouseUp = () => {
  if (!isMoving.value) return

  isMoving.value = false

  // 判断是否滑到最右侧（允许有10px的误差）
  if (sliderLeft.value >= maxLeft.value - 10) {
    isPassing.value = true
    sliderLeft.value = maxLeft.value
    emit('success')
  } else {
    // 未通过，复位
    sliderLeft.value = 0
    emit('fail')
  }
}

// 修改重置方法，确保更新宽度
const reset = () => {
  isPassing.value = false
  sliderLeft.value = 0
  nextTick(() => {
    updateContainerWidth()
  })
}

// 暴露方法供父组件调用
defineExpose({
  reset,
})
</script>

<style scoped>
.drag-verify {
  position: relative;
  margin: 0 auto;
  user-select: none;
  width: 100%; /* 默认使用100%宽度 */
}

.drag-verify-container {
  position: relative;
  background-color: v-bind('props.backgroundColor');
  height: v-bind('containerHeight');
  line-height: v-bind('containerLineHeight');
  text-align: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid v-bind('props.borderColor');
  width: 100%; /* 使容器宽度为100% */
}

.drag-verify-container.success {
  background-color: v-bind('props.successColor');
  color: #fff;
}

/* 修改进度条样式，提高鲜艳度，减少透明度 */
.drag-verify-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: v-bind('props.successColor');
  z-index: 1;
  /* 移除transition减少卡顿感 */
}

.drag-verify-text {
  position: relative;
  z-index: 2;
}

.drag-verify-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  /* 移除background的transition */
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  will-change: transform; /* 提示浏览器优化动画性能 */
}

.drag-verify-slider:hover {
  background-color: #f1f1f1;
}

.drag-verify-icon {
  font-style: normal;
  color: #666;
}
</style>
