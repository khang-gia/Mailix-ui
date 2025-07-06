<template>
    <USelectMenu
        :model-value="department"
        :searchable="search"
        :loading="loading"
        :placeholder="placeholder"
        :searchable-placeholder="$t('Search department')"
        :is-dark="colorMode.value === 'dark'"
        @update:model-value="onSelectOption($event)"
        option-attribute="name"
        by="id"
        trailing
        debounce=300
    >
    <template #option="{ option: department,  active:active}">
        <div v-if="department.id === 0">
            <span class="text-[#0313B0] dark:text-[#E0E0E0] cursor-pointer">
                <UIcon name="heroicons:plus-solid"/>
                {{ $t('Create department') }}
            </span>
        </div>
    </template>
    </USelectMenu>
</template>
<script setup>
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setCreateModal } = modalStore
const department = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('system/departments/', { search: q})
    loading.value = false
    data.value.results.push({ id: 0, name: '' })
    return data.value.results
}
const onSelectOption = (value)=>{
    if (value.id === 0){
        setCreateModal(true, 'department')
        return
    }
    department.value=value
}
</script>