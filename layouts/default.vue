<template>
  <div v-if="status === 'authenticated'"
    class="font-averta antialiased bg-slate-100 text-slate-500 dark:text-slate-400">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar -->
      <NewSideBar />

      <!-- Content area -->
      <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden z-0 dark:bg-slate-800">

        <!-- Site header -->
        <Header />

        <main
          class="main-container w-full relative mx-auto transition-all duration-300 ease-in-out text-slate-500 dark:text-slate-400 font-medium dark:bg-[#121212]">
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
    <ModalCreateEntities />
    <ScheduleDateSelectModal />
    <ModalOpenPostFullscreen />
    <ModalOpenPost />


    <AdditionFilters />
    <DisplayColumnSlide />
  </div>
  <div v-else class="font-averta">
    <main class="h-screen w-full relative transition-all duration-300 ease-in-out">
      <!-- <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> -->
      <div class="">
        <div class="relative w-full h-screen flex justify-center items-center ">
          <div
            class="w-1/2 relative h-screen text-slate-900 flex flex-col justify-center items-start px-10 py-20 overflow-hidden space-y-6 bg-[#d1d2f0]">
            <img src="/images/logo/positive/logo_name_horizontal.png" alt="Mailix Logo" class="h-24 mb-6" />
            <h1 class="text-3xl font-bold leading-snug text-[#020B51]">Email chuyên nghiệp & Nhân sự tinh gọn<br />
              <p class="text-[#0313B0]">Tất cả ở một nơi.</p>
            </h1>
            <p class="text-lg leading-relaxed opacity-90">
              "Nâng tầm thương hiệu qua email tên miền riêng và quản lý đội ngũ hiệu quả với công cụ nhân sự trực quan,
              tất cả trên một nền tảng. Mailix giúp bạn đơn giản hóa vận hành, tiết kiệm thời gian để tập trung vào tăng
              trưởng."
            </p>
          </div>
          <div
            class="w-1/2 h-screen bg-gradient-to-br from-[#020B51] to-[#7d7f8e] relative flex justify-center items-center ">
            <div class="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[150px] z-0">
            </div>

            <div
              class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] z-0">
            </div>
            <div class="z-10 w-2/3 border-2 border-gray-200 rounded-2xl shadow-xl shadow-blue-950/10 p-8 bg-white">

              <slot />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<style>
.clip-diagonal {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
<script setup>
import { ModalsContainer } from 'vue-final-modal'
const { status } = useAuth();
const route = useRoute()
const pageTitle = computed(() => {
  return `${route.meta.title} | MAILIX.VN`
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