<template>
    <USelectMenu
        v-model="department"
        :searchable="search"
        :loading="loading"
        :placeholder="placeholder"
        :searchable-placeholder="$t('Search department')"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="name"
        by="id"
        trailing
        debounce=300
    >
    </USelectMenu>
</template>
<script setup>
const department = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps({
    placeholder: {
        type: Object,
        default: {}
    },
})
const loading = ref(false)
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('system/business-units/', { search: q})
    loading.value = false
    return data.value.results
}
// const onSelectOption = (value)=>{
//     if (value.id === 0){
//         setCreateModal(true, 'business-units')
//         return
//     }
//     department.value=value
// }
</script>