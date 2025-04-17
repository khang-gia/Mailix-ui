<template>
    <UInputMenu
        v-model="nationality"
        :search="search"
        :loading="loading"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="name"
        by="id"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const nationality = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
async function search(q) {
    if (!q){
        return []
    }
    loading.value = true
    const { data } = await useAPI().getNationality('name/' + q )
    loading.value = false
    console.log('data', data.value)
    return data.value.map((item) => {
        return {
            id: item.name.common == 'Vietnam'?'Việt Nam':item.name.common,
            name: item.name.common == 'Vietnam'?'Việt Nam':item.name.common
        }
    })
}
</script>