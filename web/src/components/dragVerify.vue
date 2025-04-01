<template>
  <div class="drag-verify">
    <div class="drag-verify-container" :class="{ success: isPassing }">
      <div class="drag-verify-progress" :style="{ width: progressWidth + 'px' }"></div>
      <div class="drag-verify-text">{{ isPassing ? props.successText : props.text }}</div>
      <div
        class="drag-verify-slider"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        :style="{ left: sliderLeft + 'px' }"
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
}

const props = withDefaults(defineProps<Props>(), {
  height: 40,
  text: '请向右滑动验证',
  successText: '验证通过',
})

const emit = defineEmits(['success', 'fail'])

const isPassing = ref(false)
const isMoving = ref(false)
const sliderLeft = ref(0)
const startX = ref(0)
const containerWidth = ref(0)
const maxLeft = ref(0)

const containerStyle = computed(() => `${props.height}px`)
const progressWidth = computed(() => sliderLeft.value + 40)

onMounted(() => {
  nextTick(updateContainerWidth)
  window.addEventListener('resize', updateContainerWidth)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', updateContainerWidth)
})

const updateContainerWidth = () => {
  const el = document.querySelector('.drag-verify-container') as HTMLElement
  if (el) {
    containerWidth.value = el.offsetWidth
    maxLeft.value = containerWidth.value - 40
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (isPassing.value) return
  isMoving.value = true
  startX.value = event.clientX
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isMoving.value) return
  const moveX = event.clientX - startX.value
  sliderLeft.value = Math.max(0, Math.min(maxLeft.value, moveX))
  event.preventDefault()
}

const handleMouseUp = () => {
  if (!isMoving.value) return
  isMoving.value = false

  if (sliderLeft.value >= maxLeft.value - 10) {
    isPassing.value = true
    sliderLeft.value = maxLeft.value
    emit('success')
  } else {
    sliderLeft.value = 0
    emit('fail')
  }
}

const handleTouchStart = (event: TouchEvent) => {
  if (isPassing.value) return
  isMoving.value = true
  startX.value = event.touches[0].clientX
  event.preventDefault()
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isMoving.value) return
  const moveX = event.touches[0].clientX - startX.value
  sliderLeft.value = Math.max(0, Math.min(maxLeft.value, moveX))
  event.preventDefault()
}

const handleTouchEnd = () => {
  if (!isMoving.value) return
  isMoving.value = false

  if (sliderLeft.value >= maxLeft.value - 10) {
    isPassing.value = true
    sliderLeft.value = maxLeft.value
    emit('success')
  } else {
    sliderLeft.value = 0
    emit('fail')
  }
}

const reset = () => {
  isPassing.value = false
  sliderLeft.value = 0
  nextTick(updateContainerWidth)
}

defineExpose({ reset })
</script>

<style scoped>
.drag-verify {
  position: relative;
  margin: 0 auto;
  user-select: none;
  width: 100%;
  color: var(--text-primary);
}

.drag-verify-container {
  position: relative;
  border-radius: 4px;
  background-color: var(--verify-bg);
  height: v-bind('containerStyle');
  line-height: v-bind('containerStyle');
  text-align: center;
  overflow: hidden;
  border: 1px solid var(--verify-border);
  width: 100%;
  color: var(--text-primary);
}

.drag-verify-container.success {
  background-color: var(--color-success);
  color: #fff;
  border-color: transparent;
}

.drag-verify-progress {
  position: absolute;
  top: 0;
  left: 0px;
  height: 100%;
  background-color: var(--verify-progress);
  z-index: 1;
}

.drag-verify-text {
  position: relative;
  z-index: 2;
  font-weight: 500;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  color: inherit;
}

.drag-verify-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 45px;
  height: 100%;
  background-color: var(--verify-slider-bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  will-change: transform;
}

.drag-verify-icon {
  font-style: normal;
  color: var(--verify-icon);
  font-weight: bold;
}
</style>
