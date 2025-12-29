import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const info = ref({})
  const company = ref({})
  const isNullCompany = computed(() => !company.value.id)
  const isSidebarOpen = ref(true)
  const isDismissTodayTask = ref(false)
  const dismissedTaskDate = ref(null) // Store the date when task was dismissed
  
  function setInfo(newInfo) {
    console.log('set Info here:', newInfo)
    info.value = newInfo
  }
  
  function setDissmissTodayTask(value) {
    isDismissTodayTask.value = value
    if (value) {
      // Store current date when dismissing
      dismissedTaskDate.value = new Date().toDateString()
    }
  }
  
  function checkAndResetDismissedTask() {
    // Check if the stored date is different from today
    const today = new Date().toDateString()
    if (dismissedTaskDate.value && dismissedTaskDate.value !== today) {
      isDismissTodayTask.value = false
      dismissedTaskDate.value = null
    }
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
    setSidebar,
    isDismissTodayTask,
    setDissmissTodayTask,
    dismissedTaskDate,
    checkAndResetDismissedTask,
  }
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'none',  // Allow cross-domain access
      secure: true,      // Required for sameSite: 'none' (HTTPS only)
    }),
  },
})