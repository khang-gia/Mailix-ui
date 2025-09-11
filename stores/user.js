import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const info = ref({})
  const company = ref({})
  const isNullCompany = computed(() => !company.value.id)
  const isSidebarOpen = ref(true)

  function setInfo(newInfo) {
    info.value = newInfo
  }

  function setCompany(newCompany) {
    company.value = newCompany
  }

  function clear() {
    info.value = {}
    company.value = {}
  }

  function setSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return {
    clear,
    info,
    setInfo,
    company,
    setCompany,
    isNullCompany,
    isSidebarOpen,
    setSidebar
  }
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict',
    }),
  },
})