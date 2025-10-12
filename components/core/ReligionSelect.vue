<template>
    <UInputMenu
        v-model="religion"
        :loading="loading"
        :options="religions"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="label"
        value-attribute="value"
        trailing
        debounce=300
    >
    </UInputMenu>
</template>
<script setup>
const religion = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
const religions = [
    { label: 'Phật giáo', value: 'Phật giáo' },
    { label: 'Thiên Chúa giáo', value: 'Thiên Chúa giáo' },
    { label: 'Hồi giáo', value: 'Hồi giáo' },
    { label: 'Ấn Độ giáo', value: 'Ấn Độ giáo' },
    { label: 'Do Thái giáo', value: 'Do Thái giáo' },
    { label: 'Sikh giáo', value: 'Sikh giáo' },
    { label: 'Cao Đài', value: 'Cao Đài' },
    { label: 'Hòa Hảo', value: 'Hòa Hảo' },
    { label: 'Bahá\'í giáo', value: 'Bahá\'í giáo' },
    { label: 'Không tôn giáo', value: 'Không tôn giáo' },
    { label: 'Khác', value: 'Khác' },
]
</script>