<template>
    <BaseModal :title="$t('Delete watchlist')" :modalOpen="modalOpen" @close-modal="closeModal" :closeOnClick="false" >
        <div class="p-5">{{ $t('Are you sure you want to delete this category?') }}<span class="text-red-500">{{ stockList.name }}</span>?
        </div>
        <hr class="h-px w-full bg-slate-200 dark:bg-slate-600 block mt-1 border-transparent" />
        <div class="p-5 modal-footer flex justify-end gap-2">
            <UButton color="gray" type="button" @click="closeModal">{{ $t('Cancel') }}</UButton>
            <UButton type="button" color="red" icon="i-heroicons-trash-16-solid" @click="confirmed" >{{ $t('Delete') }}</UButton>
        </div>
    </BaseModal>
</template>

<script setup>

    const emit = defineEmits(['close-modal', 'on-confirmed'])
    const props = defineProps(['modalOpen', 'stockList'])

    const closeModal = () => {
        emit('close-modal')
    }
    
    const confirmed = () => {
        closeModal()
        emit('on-confirmed')
    }



</script>
