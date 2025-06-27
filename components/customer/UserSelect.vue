<template>
    <USelectMenu
        v-model="selectedUsers"
        :multiple="multiple"
        :searchable-placeholder="$t('Search users')"
        :placeholder="placeholder"
        :loading="loading"
        :searchable="search"
        option-attribute="full_name"
        by="id"
        trailing
        debounce=300
    >
    <template #label>
        <span v-if="multiple && selectedUsers.length" class="truncate">{{ selectedUsers.map(user => user.full_name).join(', ') }} </span>
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

// const selectedUsers = ref(props.multiple ? [] : null);
const selectedUsers = defineModel({ required: true, type: [Array, String] })
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('core/users/', { search: q })
    loading.value = false
    return data.value.results
}
</script>