<script setup lang="ts">
import Articles from '@/components/User/Articles/Articles.vue'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { fetchTagByPath, fetchTagCountByPath } from '@/data/mock'

const route = useRoute()
const path = computed(() => (route.params.id ?? '') as string)
const tag = ref<{ path: string; name: string; desc: string; color: string; cover?: string } | null>(
  null,
)
const count = ref<number>(0)
const loading = ref<boolean>(true)

const loadTagData = async () => {
  if (!path.value) return

  loading.value = true
  tag.value = null
  count.value = 0

  const [tagData, countData] = await Promise.all([
    fetchTagByPath(path.value),
    fetchTagCountByPath(path.value),
  ])

  tag.value = tagData
  count.value = countData
  loading.value = false
}

loadTagData()
watch(
  () => route.params.id,
  (newTagPath, oldTagPath) => {
    if (newTagPath !== oldTagPath && route.path.startsWith('/tags/')) {
      loadTagData()
    }
  },
)

const name = computed(() => tag.value?.name)
const desc = computed(() => tag.value?.desc || '')
const color = computed(() => tag.value?.color || 'transparent')
const cover = computed(() => tag.value?.cover)
const hasCover = computed(() => !!cover.value)
</script>

<template>
  <div class="Tags">
    <div class="info" :class="{ 'has-cover': hasCover, loading: loading }">
      <div v-if="loading" class="skeleton">
        <div class="skeleton-text">
          <div class="skeleton-num"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-desc"></div>
        </div>
        <div class="skeleton-image"></div>
      </div>
      <div v-else class="text">
        <div class="num" v-if="count">{{ count }} posts</div>
        <div class="title">{{ name }} <span :style="{ backgroundColor: color }"></span></div>
        <div class="desc">{{ desc }}</div>
      </div>
      <img v-if="!loading && cover" :src="cover" loading="lazy" alt="" />
    </div>
    <Articles mode="infinite" />
  </div>
</template>

<style scoped lang="scss">
.Tags {
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 32px;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 64px;
    flex-wrap: nowrap;
    min-height: 200px;
    animation: fadeInUp 0.8s ease-out;

    .text {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      .num {
        font-size: 14px;
        animation: fadeInUp 0.8s ease-out 0.1s both;
      }
      .title {
        font-size: 45px;
        font-weight: 600;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: fadeInUp 0.8s ease-out 0.2s both;
        span {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-color: #ff5f57;
          border-radius: 50%;
        }
      }
      .desc {
        font-size: 16px;
        animation: fadeInUp 0.8s ease-out 0.3s both;
      }
    }

    .skeleton {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 64px;

      .skeleton-text {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
      }

      .skeleton-num {
        width: 80px;
        height: 16px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 25%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 10%) 50%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-title {
        width: 280px;
        height: 54px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 25%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 10%) 50%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 75%
        );
        background-size: 200% 100%;
        border-radius: 8px;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-desc {
        width: 400px;
        height: 20px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 25%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 10%) 50%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 75%
        );
        background-size: 200% 100%;
        border-radius: 4px;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-image {
        width: 50%;
        aspect-ratio: 16/9;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 25%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 10%) 50%,
          color-mix(in srgb, var(--bg-color-item), var(--black) 5%) 75%
        );
        background-size: 200% 100%;
        border-radius: 20px;
        animation: shimmer 1.5s infinite;
      }
    }

    &.loading {
      animation: none;
    }

    &.has-cover {
      .text {
        flex: 1.2;
      }
    }

    &:not(.has-cover) {
      .text {
        max-width: 600px;
      }
    }
  }
  img {
    width: 50%;
    aspect-ratio: 16/9;
    border-radius: 20px;
    animation: fadeInUp 0.5s ease-out both;
  }

  @media (max-width: 768px) {
    .info {
      flex-direction: column;
      align-items: flex-start;
      min-height: 150px;

      .text {
        gap: 4px;
        max-width: 100% !important;
        .title {
          letter-spacing: 1px;
          gap: 8px;
        }
      }

      &.has-cover img {
        width: 100%;
        order: -1;
      }

      &:not(.has-cover) img {
        display: none;
      }

      .skeleton {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;

        .skeleton-text {
          width: 100%;
        }

        .skeleton-title {
          width: 200px;
          height: 32px;
        }

        .skeleton-desc {
          width: 250px;
        }

        .skeleton-image {
          width: 100%;
          order: -1;
        }
      }
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
}
</style>
