<template>
    <div v-if="isLoggedIn">
        <div class="dark:text-gray-400 text-gray-800 flex justify-center items-center space-x-2 text-lg h-screen">
        <p>In progress </p>
        <Icon name="svg-spinners:3-dots-scale-middle" size="24" />
        </div>
    </div>
    <UContainer v-else class="mt-24 bg-gray-50 dark:bg-gray-900 py-10 rounded-md text-white" :ui="{ constrained: 'max-w-2xl' }">
      <p class="font-bold text-4xl">TTITACA WELCOME</p>
      <p class="font-bold text-3xl">Ready to get started?</p>
      <div class="flex items-center space-x-2 mt-4">
        <UButton class="font-semibold text-2xl" variant="solid" :loading="loading" :disabled="loading" @click="openAuthModal('signin')" size="xl"
          icon="i-heroicons-outline-login" trailing>Login now</UButton>
      </div>
    </UContainer>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setAuthModal} = modalStore

definePageMeta({
  title: 'Trang chủ'
})
console.log('logged in', useAuth())
const openAuthModal = (mode) => {
    setAuthModal(true, mode)
}
const isLoggedIn = computedAsync( () => {
  const data =  useAuth()
  return data.status.value == 'authenticated'
})
</script>