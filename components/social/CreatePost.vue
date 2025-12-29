<template>
    <UCard :ui="{ body: { padding: 'p-4' } }">
        <div class="flex gap-3 mb-4">
            <UButton :label="t('Post title')" rounded variant="soft" color="gray"
                class="flex-1 text-md font-medium" @click="openCreatePostModal" />
            <!-- <div class="flex gap-2">
                <UButton icon="i-heroicons-face-smile" color="gray" variant="ghost" />
                <UButton icon="i-heroicons-paper-airplane" color="gray" variant="ghost" />
            </div> -->
            <div class="flex gap-4">
                <UButton icon="i-heroicons-photo" color="green" variant="soft" size="sm" />
                <UButton icon="i-heroicons-document-text" color="blue" variant="soft" size="sm" />
                <UButton icon="i-heroicons-chart-bar" color="orange" variant="soft" size="sm"
                    @click="openCreatePollModal" />
            </div>
        </div>

        <!-- <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
            <div class="flex gap-4">
                <UButton icon="i-heroicons-photo" :label="t('Photo/File')" color="green" variant="ghost" size="sm" />
                <UButton icon="i-heroicons-document-text" :label="t('Note')" color="blue" variant="ghost" size="sm" />
                <UButton icon="i-heroicons-chart-bar" :label="t('Poll')" color="orange" variant="ghost" size="sm" />
            </div>
        </div> -->
    </UCard>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { useModalStore } from '@/stores/modal'

const { t } = useI18n()
const modalStore = useModalStore()
const { setSocialCreatePostModal } = modalStore

const openCreatePostModal = () => {
    setSocialCreatePostModal(true)
}

const openCreatePollModal = () => {
    setSocialCreatePostModal(true, 2) // Open with post_type = 2 (poll)
}
</script>
