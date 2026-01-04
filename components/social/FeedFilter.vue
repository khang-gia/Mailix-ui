<template>
    <div class="flex gap-2 mb-4">
        <button v-for="(filter, index) in filters" :key="index" @click="selectFilter(filter)" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            filter.value === activeFilter
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]">
            {{ filter.label }}
        </button>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['filter-change'])

const props = defineProps({
    activeFilter: {
        type: String,
        default: 'all'
    }
})

const filters = [
    { label: t('All'), value: 'all' },
    { label: t('From group'), value: 'group' },
    { label: t('Poll'), value: 'poll' },
]

const selectFilter = (filter) => {
    emit('filter-change', filter.value)
}
</script>
