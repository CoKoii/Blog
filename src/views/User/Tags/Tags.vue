<script setup lang="ts">
import Articles from '@/components/User/Articles/Articles.vue'
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { fetchUsedTags, fetchTagCounts } from '@/data/mock'

const route = useRoute()
const path = computed(() => (route.params.id ?? '') as string)
const tags = ref<Array<{ path: string; name: string; desc: string }>>([])
const counts = ref<Record<string, number>>({})

onMounted(async () => {
  const [t, c] = await Promise.all([fetchUsedTags(), fetchTagCounts()])
  tags.value = t as Array<{ path: string; name: string; desc: string }>
  counts.value = c
})

const name = computed(() => tags.value.find((t) => t.path === path.value)?.name || path.value)
const count = computed(() => counts.value[path.value as string] ?? 0)
const desc = computed(() => tags.value.find((t) => t.path === path.value)?.desc || '')
</script>

<template>
  <div class="Tags">
    <div class="info">
      <div class="text">
        <div class="num">{{ count }} posts</div>
        <div class="title">{{ name }} <span></span></div>
        <div class="desc">{{ desc }}</div>
      </div>
      <img
        loading="lazy"
        src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
        alt=""
      />
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
    .text {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .num {
        font-size: 14px;
      }
      .title {
        font-size: 45px;
        font-weight: 600;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 12px;
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
      }
    }
  }
  img {
    width: 50%;
    aspect-ratio: 16/9;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    .info {
      flex-direction: column;
      align-items: flex-start;
      .text {
        gap: 4px;
        .title {
          letter-spacing: 1px;
          gap: 8px;
        }
      }
    }
    img {
      display: none;
    }
  }
}
</style>
