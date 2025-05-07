<template>
    <UInputMenu
        v-model="user"
        :search="search"
        :loading="loading"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="full_name"
        value-attribute="id"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const user = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
async function search(q) {
    loading.value = true
    const { data } = await useAPI().get('core/users/', { q })
    loading.value = false
    return data.value.results
}
</script>