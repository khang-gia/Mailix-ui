<template>
    <BaseModal
        :modalOpen="indexInfoModal"
        :close-on-click="false"
        @close-modal="close"
        :title="indexInfo"
        size="xl">
        <div class="pt-4 pb-1">
            <div class="h-[500px] w-full px-4 mb-6">
                <ChartTradingView :symbol="indexInfo" v-if="indexInfo"/>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const { indexInfoModal,indexInfo } = storeToRefs(modalStore)
const { setIndexInfoModal } = modalStore
const $emit = defineEmits(["close-modal"])

const close = () => {
    $emit('close-modal')
    setIndexInfoModal(false)
}

</script>