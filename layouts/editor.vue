<template>
  <div class="font-averta antialiased dark:bg-[#111827] text-slate-600 dark:text-slate-400">
    <div class="flex h-screen overflow-hidden">

      <!-- Sidebar (with auth + dark mode support matching default layout) -->
      <NewSideBar />

      <!-- Content area: NO Header - the page owns its own top bar -->
      <div class="flex flex-col flex-1 overflow-hidden z-0">
        <slot />
      </div>

    </div>
    <!-- Keep global modals/notifications so they still work on this page -->
    <LazyModalGlobalAuth />
    <UNotifications>
      <template #description="{ description }">
        <span v-html="description"></span>
      </template>
    </UNotifications>
    <LazyBaseAlert />
  </div>
</template>

<script setup>
const { status } = useAuth()
const route = useRoute()
const pageTitle = computed(() => `${route.meta.title} | MAILIX.VN`)
useHead({ title: pageTitle })
</script>
