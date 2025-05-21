<template>
    <div v-if="isLoggedIn">
        <CoreInfoProfile :userInfo="userInfo"/>
        <!-- <div class="dark:text-gray-400 text-gray-800 flex justify-center items-center space-x-2 text-lg h-screen">
        <p>In progress </p>
        <Icon name="svg-spinners:3-dots-scale-middle" size="24" />
        </div> -->
    </div>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setAuthModal} = modalStore
const { data: userStore } = useAuth()

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
const userInfo = ref({})
const {data:userData} = await useAPI().get(`core/profile_hrs/${userStore.value.id}/`);
userInfo.value = userData.value;
</script>