<template>
  <div class="font-averta antialiased bg-slate-100 text-slate-600">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar -->
      <Sidebar :blank="true" :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

      <!-- Content area -->
      <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        
        <!-- Site header -->
        <Header :blank="true" :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <main>
          <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <slot />
          </div>
        </main>

      </div> 
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
</script>