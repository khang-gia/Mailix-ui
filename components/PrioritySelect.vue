<template>
    <USelectMenu
        v-model="priority"
        :loading="loading"
        :options="priorities"
        :placeholder="placeholder"
        :is-dark="colorMode.value === 'dark'"
        option-attribute="label"
        value-attribute="value"
        trailing

    >
        <template #option="{ option }">
            <div style="display: flex; align-items: center;">
                 <UIcon
                    :name="`i-heroicons-${option.value === 1 ? 'check-circle' : option.value === 2 ? 'exclamation-circle' : option.value === 3 ? 'exclamation-triangle' : option.value === 4 ? 'stop-circle' : option.value === 5 ? 'x-circle' : 'question-mark-circle'}`"
                    class="inline-block mr-2 text-gray-500"
                    :style="{ color: priorityColors[option.value] || '#9e9e9e' }"
                />
                <span>{{ option.label }}</span>
            </div>
        </template>
        <template #label>
            <div style="display: flex; align-items: center;">
                 <UIcon
                    :name="`i-heroicons-${priorities.find(p => p.value === priority)?.value === 1 ? 'check-circle' : priorities.find(p => p.value === priority)?.value === 2 ? 'exclamation-circle' : priorities.find(p => p.value === priority)?.value === 3 ? 'exclamation-triangle' : priorities.find(p => p.value === priority)?.value === 4 ? 'stop-circle' : priorities.find(p => p.value === priority)?.value === 5 ? 'x-circle' : 'question-mark-circle'}`"
                    class="inline-block mr-2 text-gray-500"
                    :style="{ color: priorityColors[priorities.find(p => p.value === priority)?.value] || '#9e9e9e' }"
                />
                <span>{{ priorities.find(p => p.value === priority)?.label || '' }}</span>
            </div>
        </template>
    </USelectMenu>
</template>
<script setup>
const priority = defineModel({ default: '' })
const colorMode = useColorMode()
const props = defineProps(['placeholder'])
const loading = ref(false)
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const priorities = [
    {label: t('Low'), value: 1},
    {label: t('Medium'), value: 2},
    {label: t('High'), value: 3},
    {label: t('Urgent'), value: 4},
    {label: t('Critical'), value: 5},
    {label: t('None'), value: 6},
]
const priorityColors = {
    1: '#388e3c', // Green (Low)
    2: '#fbc02d', // Yellow (Medium)
    3: '#ff6d00', // Orange (High)
    4: '#d50000', // Bright Red (Urgent)
    5: '#8b0000', // Dark Red (Critical)
    6: '#9e9e9e', // Grey (None)
}
</script>
