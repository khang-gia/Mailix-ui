<template>
    <USelectMenu 
        v-model="priorities" 
        :options="priority_options" 
        :placeholder="$t('Priority')"
        size="sm" 
        :ui="{ base: 'w-full' }" 
        option-attribute="label"
        by="id"
        :multiple="multiple"
        :is-dark="colorMode.value === 'dark'">
        <template #label>
            <div v-if="multiple && priorities.length" class="flex items-center" v-for="priority in priorities" :key="priority.id">
                <UIcon
                    :name="`i-heroicons-${priority_options.find(p => p.id === priority.id)?.id === 1 ? 'check-circle' : priority_options.find(p => p.id === priority.id)?.id === 2 ? 'exclamation-circle' : priority_options.find(p => p.id === priority.id)?.id === 3 ? 'exclamation-triangle' : priority_options.find(p => p.id === priority.id)?.id === 4 ? 'stop-circle' : priority_options.find(p => p.id === priority.id)?.id === 5 ? 'x-circle' : 'question-mark-circle'}`"
                    class="inline-block mr-2 text-gray-500"
                    :style="{ color: priorityColors[priority_options.find(p => p.id === priority.id)?.id] || '#9e9e9e' }"
                />
                <span>{{ priority.label }},</span>
            </div>
            <span v-else-if="!multiple">{{ priority_options.find(p => p.id === priorities)?.label }}</span>
            <span v-else-if="multiple">{{placeholder }}</span>
        </template>
        <template #option="{ option }">
            <div class="flex items-center">
                 <UIcon
                    :name="`i-heroicons-${priority_options.find(p => p.id === option.id)?.id === 1 ? 'check-circle' : priority_options.find(p => p.id === option.id)?.id === 2 ? 'exclamation-circle' : priority_options.find(p => p.id === option.id)?.id === 3 ? 'exclamation-triangle' : priority_options.find(p => p.id === option.id)?.id === 4 ? 'stop-circle' : priority_options.find(p => p.id === option.id)?.id === 5 ? 'x-circle' : 'question-mark-circle'}`"
                    class="inline-block mr-2 text-gray-500"
                    :style="{ color: priorityColors[priority_options.find(p => p.id === option.id)?.id] || '#9e9e9e' }"
                />
                <span>{{ option.label }}</span>
            </div>
        </template>

    </USelectMenu>
</template>
<script setup>
const priorities = defineModel({ required: true, type: [Array, String] })
const colorMode = useColorMode()
const props = defineProps({
    placeholder: String,
    multiple: {
        type: Boolean,
        default: false
    }
})
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const priority_options = [
    { label: t('Low'), id: 1 },
    { label: t('Medium'), id: 2 },
    { label: t('High'), id: 3 },
    { label: t('Urgent'), id: 4 },
    { label: t('Critical'), id: 5 },
    { label: t('None'), id: 6 },
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
