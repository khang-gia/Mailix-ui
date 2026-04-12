<template>
    <USelectMenu 
        v-model="internalModel" 
        :options="priority_options" 
        :placeholder="placeholder"
        size="sm" 
        :ui="{ base: 'w-full' }" 
        option-attribute="label"
        :by="compareById"
        :multiple="multiple"
        :is-dark="colorMode.value === 'dark'">
        
        <template #label>
            <div v-if="multiple && internalModel?.length" class="flex items-center gap-1 overflow-hidden">
                <div v-for="(p, index) in internalModel" :key="index" class="flex items-center shrink-0">
                    <UIcon
                        :name="getPriorityInfo(p)?.icon"
                        class="inline-block mr-1"
                        :style="{ color: getPriorityInfo(p)?.color }"
                    />
                    <span class="truncate">{{ getPriorityInfo(p)?.label }}<span v-if="index < internalModel.length - 1">,</span></span>
                </div>
            </div>
            <div v-else-if="!multiple && internalModel" class="flex items-center">
                <UIcon
                    :name="getPriorityInfo(internalModel)?.icon"
                    class="inline-block mr-2"
                    :style="{ color: getPriorityInfo(internalModel)?.color }"
                />
                <span>{{ getPriorityInfo(internalModel)?.label }}</span>
            </div>
            <span v-else>{{ placeholder || $t('Priority') }}</span>
        </template>

        <template #option="{ option }">
            <div class="flex items-center">
                 <UIcon
                    :name="option.icon"
                    class="inline-block mr-2"
                    :style="{ color: option.color }"
                />
                <span>{{ option.label }}</span>
            </div>
        </template>

    </USelectMenu>
</template>

<script setup>
const priorities = defineModel({ required: true, type: [Array, Object, Number, String] })
const colorMode = useColorMode()
const props = defineProps({
    placeholder: { type: String, default: '' },
    multiple: { type: Boolean, default: false }
})

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const priority_options = [
    { label: t('Low'), id: 1, color: '#388e3c', icon: 'i-heroicons-check-circle' },
    { label: t('Medium'), id: 2, color: '#fbc02d', icon: 'i-heroicons-exclamation-circle' },
    { label: t('High'), id: 3, color: '#ff6d00', icon: 'i-heroicons-exclamation-triangle' },
    { label: t('Urgent'), id: 4, color: '#d50000', icon: 'i-heroicons-stop-circle' },
    { label: t('Critical'), id: 5, color: '#8b0000', icon: 'i-heroicons-x-circle' },
    { label: t('None'), id: 6, color: '#9e9e9e', icon: 'i-heroicons-question-mark-circle' },
]

const getPriorityInfo = (p) => {
    if (!p) return null
    const id = typeof p === 'object' ? p.id : p
    return priority_options.find(opt => opt.id === id)
}

const compareById = (a, b) => {
    if (!a && !b) return true
    if (!a || !b) return false
    const aId = typeof a === 'object' ? a?.id : a
    const bId = typeof b === 'object' ? b?.id : b
    return aId === bId
}

const internalModel = computed({
    get: () => {
        const val = priorities.value
        if (props.multiple) {
            if (!Array.isArray(val)) return []
            return val.map(p => typeof p === 'object' && p !== null ? p : getPriorityInfo(p)).filter(Boolean)
        }
        // Single mode — guard against null explicitly (typeof null === 'object' in JS!)
        if (val === null || val === undefined) return null
        return typeof val === 'object' ? val : getPriorityInfo(val)
    },
    set: (val) => priorities.value = val
})
</script>
