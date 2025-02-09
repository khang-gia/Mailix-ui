<template>
    <ModalAuth :authMode="authModalMode" :modalOpen="authModalOpen"
        :data="authArg" @change-mode="changeMode" @close-modal="closeAuthModal" />
</template>

<script setup>
    import { useModalStore } from '@/stores/modal'
    import { storeToRefs } from 'pinia'

    const modalStore = useModalStore()
    const { authModalMode, authModalOpen } = storeToRefs(modalStore)
    const { setAuthModal } = modalStore
    const authArg = ref(null)

    const changeMode = (mode='signin', param = null) => {
        authModalMode.value = mode
        authArg.value = param
    }

    const closeAuthModal = () => {
        setAuthModal(false)
    }
</script>