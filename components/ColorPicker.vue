<template>
    <USelectMenu
        v-model="color"
        :loading="loading"
        :options="colors"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="label"
        value-attribute="value"
        trailing
        size="md"

    >
        <template #option="{ option }">
            <div style="display: flex; align-items: center;">
                <span :style="{ backgroundColor: option.value, width: '16px', height: '16px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }"></span>
            </div>
        </template>
        <template #label>
            <div style="display: flex; align-items: center;">
                <span :style="{ backgroundColor: color, width: '16px', height: '16px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }"></span>
            </div>
        </template>
    </USelectMenu>
</template>
<script setup>
const color = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
const colors = [
    { label: 'Red', value: '#d50001' },       // Brownish Red
    { label: 'Green', value: '#0A8043' },     // Forest Green (user sample)
    { label: 'Blue', value: '#3688d8' },      // Slightly lighter dark blue 039be5
    { label: 'Yellow', value: '#f5bf25' },    // Dark Yellow
    { label: 'Cyan', value: '#0E8388' },      // Slightly lighter dark cyan
    { label: 'Magenta', value: '#9B2C6B' },   // Dark Magenta with some brightness
    { label: 'Orange', value: '#f4511e' },    // Dark Orange
    { label: 'Purple', value: '#8e24aa' },    // Dark Purple
    { label: 'Teal', value: '#115E59' },      // Dark Teal
    { label: 'Brown', value: '#6B4226' },     // Dark Brown
    { label: 'Pink', value: '#e67b73' },      // Dark Pink
]
</script>