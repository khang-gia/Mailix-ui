<template>
  <div class="font-inter antialiased bg-slate-100 text-slate-600">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar -->
      <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

      <!-- Content area -->
      <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden z-0">
        
        <!-- Site header -->
        <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <main class="h-full w-full mx-auto transition-all duration-300 ease-in-out text-lg text-slate-500 font-medium">
          <!-- <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"> -->
            <slot />
        </main>
      </div> 
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
</script>