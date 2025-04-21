<template>
    <BaseModal
        :modalOpen="alertModal"
        :close-on-click="false"
        @close-modal="close"
        :title="alertProps.title"
        size="sm">
        <div class="p-5">
            <div class="mb-5">
                <div class="block py-2 text-lg font-medium text-slate-500 dark:text-white">{{ alertProps.message }}</div>
            </div>
        </div>
        <div class="px-5 py-4 border-t-2 border-slate-200 dark:border-slate-700">
            <div class="flex justify-end gap-2">
                <UButton color="gray" type="button" @click="close"> {{alertProps.denyButton || 'Đóng'}} </UButton>
                <UButton color="blue" type="button" @click="confirm"> {{alertProps.confirmButton || 'OK'}} </UButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const { alertModal, alertProps } = storeToRefs(modalStore)
const { setAlertModal } = modalStore

const close = () => {
    setAlertModal(false, {})
}
const confirm = () => {
    setAlertModal(false, {}, true)
}

</script>
