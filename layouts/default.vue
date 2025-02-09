<template>
  <div class="font-inter antialiased bg-slate-100 text-slate-500 dark:text-slate-400">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar -->
      <Sidebar :sidebarOpen="isSidebarExpanded" @close-sidebar="closeSidebar" @toggle-sidebar="toggleSidebar" />

      <!-- Content area -->
      <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden z-0 dark:bg-slate-800">
        
        <!-- Site header -->
        <Header :sidebarOpen="isSidebarExpanded" @open-sidebar="openSidebar" />

        <main class="main-container w-full relative mx-auto transition-all duration-300 ease-in-out text-slate-500 dark:text-slate-400 font-medium dark:bg-slate-900">
          <!-- <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> -->
            <div class="main-wrapper pb-5">
              <slot />
            </div>
            <StatusFooter />
        </main>
      </div> 
    </div>
    <LazyModalGlobalAuth />
    <!-- <DraggableModal/> -->
    <UNotifications>
      <template #description="{ description }">
        <span v-html="description"></span>
      </template>
    </UNotifications>
    <LazyBaseAlert />
    <FeedbackModal />
    <ModalSearch />
    <ModalsContainer />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { ModalsContainer } from 'vue-final-modal'
const appStore = useAppStore()

const { isSidebarExpanded, isSidebarAutoClose } = storeToRefs(appStore)
const { setSidebarExpanded } = appStore
const { $pwa } = useNuxtApp()
const gtm = useGtm()
const route = useRoute()
const pageTitle = computed(() => {
  return `${route.meta.title} | SieuCoPhieu.VN`
})

// const _isTradeTime = computed(() => {
//   const t = isTradeTime()
//   return t
// })

useHead({
  title: pageTitle
})

onMounted( () => {
  // const { $sse } = useNuxtApp()
  // // $socket.open()
  
  // $sse.open()
  if (!$pwa) return
   
  if ($pwa.needRefresh) {
    // showPWARefreshNoti()
    console.log('Need to refresh PWA')
    $pwa.updateServiceWorker()
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    gtm.trackEvent({
      event: 'pwaInstall',
      category: 'PWA'
    })
  })
})

const toggleSidebar = () => {
  setSidebarExpanded(!isSidebarExpanded.value)
}

const openSidebar = (autoClose=false) => {
  setSidebarExpanded(true, autoClose)
}

const closeSidebar = (clickOut=false) => {
  if (clickOut && !isSidebarAutoClose.value) return
  setSidebarExpanded(false)
}

</script>
<style scoped>
.main-wrapper {
  min-height: calc(100vh - 75px);
}

</style>