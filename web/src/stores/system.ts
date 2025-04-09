import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const system = ref({
    hiddenMenu: false,
  })
  const userInfo = ref({})
  if (window.innerWidth < 768) {
    system.value.hiddenMenu = true
  }
  return { system, userInfo }
})
