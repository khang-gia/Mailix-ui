<template>
    <UModal v-model="socialCommentModal" :ui="{ width: 'w-full sm:max-w-4xl' }" class="font-averta">
        <SocialPostItem :post="post" :open-post-modal="true"/>
    </UModal>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
import { storeToRefs } from 'pinia'
const {socialCommentModal, socialCommentPost: post} = storeToRefs(modalStore)
</script>