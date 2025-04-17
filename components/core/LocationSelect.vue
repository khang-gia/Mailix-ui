<template>
    <UInputMenu
        v-model="pob"
        :search="search"
        :loading="loading"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        by="id"
        option-attribute="name"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const pob = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
async function search(q) {
    loading.value = true
    const { data } = await useAPI().getLocation('search', { q, 
        format: 'json',
        countrycodes: 'vn',
        featureType:'city', 
        namedetails:'1',
        addressdetails:'1'
    })
    loading.value = false
    console.log('data', data.value)
    return data.value.map((item) => {
        return {
            id: item.display_name,
            name: item.display_name,
        }
    })
}
</script>