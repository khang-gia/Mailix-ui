<template>
    <BaseModal :title="imageData.title" :modalOpen="expandImageModal" :closeOnClick="false" :closeOnEsc="true" @close-modal="setExpandImageModal(false,{})">
        <div class="w-full h-full flex justify-center items-center">
            <img :src="imageData.src" :width="imageData.imageWidth" :height="imageData.imageHeight" class="w-full h-auto object-cover"/>
        </div>
        
    </BaseModal>
</template>

<script setup>
    import { useModalStore } from '@/stores/modal'
    import { storeToRefs } from 'pinia'
    const modalStore = useModalStore()
    const { expandImageModal, imageData } = storeToRefs(modalStore)
    const { setExpandImageModal } = modalStore

    const props = defineProps(['id'])
    const emit = defineEmits(['close-modal', 'change-mode'])
</script>
