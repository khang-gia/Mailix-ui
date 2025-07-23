<template>
    <USelectMenu
        v-model="selectDepartments"
        :multiple="multiple"
        :searchable-placeholder="$t('Search departments')"
        :placeholder="placeholder"
        :loading="loading"
        :searchable="search"
        option-attribute="name"
        by="id"
        trailing
        debounce=300
    >
    <template #label>
        <span v-if="multiple && selectDepartments.length" class="truncate">{{ selectDepartments.map(department => department.name).join(', ') }} </span>
        <span v-else-if="multiple">{{placeholder }}</span>
    </template>
    </USelectMenu>
</template>

<script setup>
const colorMode = useColorMode()
const props = defineProps({
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
})
const loading = ref(false)

// const selectDepartments = ref(props.multiple ? [] : null);
const selectDepartments = defineModel({ required: true, type: [Array, String] })
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('system/departments/', { search: q })
    loading.value = false
    return data.value.results
}
</script>