<template>
    <USelectMenu
        :model-value="title"
        :searchable="search"
        :loading="loading"
        :placeholder="placeholder"
        :searchable-placeholder="$t('Search title')"
        :is-dark="colorMode.value === 'dark'"
        @update:model-value="onSelectOption($event)"
        option-attribute="name"
        by="id"
        trailing
        debounce=300
    >
    <template #option="{ option: title,  active:active}">
        <div v-if="title.id === 0 && isCreate">
            <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
                <UIcon name="heroicons:plus-solid"/>
                {{ $t('Create title') }}
            </span>
        </div>
    </template>
    <template #option-empty="{ query }">
        <!-- <div v-if="isCreate">
            <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
                <UIcon name="heroicons:plus-solid"/>
                {{ $t('Create title') }}
            </span>
        </div>
        <div v-else>
            <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
                {{ $t('No results') }}
            </span>
        </div> -->
        <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
            {{ $t('No results') }}
        </span>
    </template>
    <template #empty>
        <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
            {{ $t('No results') }}
        </span>
    </template>
    </USelectMenu>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
import { storeToRefs } from 'pinia'
const { createModal } = storeToRefs(modalStore)
const { setCreateModal } = modalStore
const title = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps({
    placeholder: {
        type: Object,
        default: {}
    },
    isCreate: {
        type:Boolean,
        default: false,
    }
})
const loading = ref(false)
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('core/titles/', { search: q})
    loading.value = false
    if (props.isCreate){
        data.value.results.push({ id: 0, name: '' })
    }
    return data.value.results
}
const onSelectOption = (value)=>{
    if (value.id === 0){
        setCreateModal(true, 'title')
        return
    }
    title.value=value
}
</script>