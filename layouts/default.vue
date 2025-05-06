<template>
  <div class="font-inter antialiased bg-slate-100 text-slate-500 dark:text-slate-400">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar -->
      <Sidebar  />

      <!-- Content area -->
      <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden z-0 dark:bg-slate-800">
        
        <!-- Site header -->
        <Header />

        <main class="main-container w-full relative mx-auto transition-all duration-300 ease-in-out text-slate-500 dark:text-slate-400 font-medium dark:bg-[#121212]">
          <!-- <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> -->
            <div class="main-wrapper pb-5">
              <slot />
            </div>
            <!-- <StatusFooter /> -->
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
    <ModalsContainer />
    <ModalExpandImg />
  </div>
</template>

<script setup>
import { ModalsContainer } from 'vue-final-modal'

const route = useRoute()
const pageTitle = computed(() => {
  return `${route.meta.title} | MAILIX.COM`
})

useHead({
  title: pageTitle
})

</script>
<style scoped>
.main-wrapper {
  min-height: calc(100vh - 75px);
}

</style>