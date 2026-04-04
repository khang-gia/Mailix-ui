<template>
    <UInputMenu
        v-model="user"
        :search="search"
        :loading="loading"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="name"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const user = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder', 'excludeId', 'parentOnly'])
const loading = ref(false)
async function search(q) {
    loading.value = true
    const params = {
        search: q,
        exclude_id: props.excludeId,
        related_work__isnull: props.parentOnly ? true : undefined
    }
    const { data } = await useAPI().get('core/works/', params)
    loading.value = false
    return data.value.results
}
</script>