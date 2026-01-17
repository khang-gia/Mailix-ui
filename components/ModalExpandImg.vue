<template>
    <UModal v-model="isOpen" :ui="{ width: '' }">
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h3 v-if="imageData.title" class="text-lg font-semibold">{{ imageData.title }}</h3>
                <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="closeModal" />
            </div>
            <div class="w-full flex justify-center items-center">
                <img :src="imageData.src" :style="{
                    maxWidth: imageData.imageWidth ? `${imageData.imageWidth}px` : '100%',
                    maxHeight: imageData.imageHeight ? `${imageData.imageHeight}px` : 'auto'
                }" class="object-contain rounded-lg" />
            </div>
        </div>
    </UModal>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const modalStore = useModalStore()
const { expandImageModal, imageData } = storeToRefs(modalStore)
const { setExpandImageModal } = modalStore

const isOpen = computed({
    get: () => expandImageModal.value,
    set: (value) => {
        if (!value) {
            setExpandImageModal(false, {})
        }
    }
})

const closeModal = () => {
    setExpandImageModal(false, {})
}
</script>
