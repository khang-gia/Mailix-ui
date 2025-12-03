<template>
    <!-- Filters Dropdown -->
    <UPopover :popper="{ placement: 'bottom-start' }">
        <UChip :show="!isWorkFilterEmpty" size="sm">
            <UButton color="gray" variant="soft" size="sm" icon="i-heroicons-funnel"
                trailing-icon="i-heroicons-chevron-down">
                {{ $t('Filters') }}
            </UButton>
        </UChip>
        <template #panel>
            <div class="p-4 w-80 max-h-[600px] overflow-y-auto bg-white dark:bg-gray-900">
                <!-- Search -->
                <!-- <div class="mb-4">
                    <UInput icon="i-heroicons-magnifying-glass" :placeholder="$t('Search')" size="sm" />
                </div> -->

                <!-- Priority Filter -->
                <UAccordion :items="[{ label: $t('Priority'), slot: 'priority', defaultOpen: true }]" class="mb-3">
                    <template #priority>
                        <div class="space-y-2 py-2">
                            <!-- workFilter.priorities have format [ { "label": "Thấp", "id": 1 }, { "label": "Cao", "id": 3 } ] -->
                            <label v-for="priority in priorityOptions" :key="priority.id"
                                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                                <UCheckbox :model-value="workFilter.priorities.some(p => p.id === priority.id)"
                                    @update:model-value="togglePriority(priority.id)" />
                                <UIcon :name="priority.icon" :style="{ color: priority.color }" />
                                <span class="text-sm">{{ priority.label }}</span>
                            </label>
                        </div>
                    </template>
                </UAccordion>

                <!-- State Filter -->
                <UAccordion :items="[{ label: $t('State'), slot: 'state', defaultOpen: true }]" class="mb-3">
                    <template #state>
                        <div class="space-y-2 py-2">
                            <label v-for="status in visibleStatuses" :key="status.id"
                                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                                <UCheckbox :model-value="isStatusSelected(status.id)"
                                    @update:model-value="toggleStatus(status)" />
                                <UIcon :name="status.icon || 'material-symbols:circle-outline'" class="w-4 h-4" />
                                <span class="text-sm">{{ status.label }}</span>
                            </label>
                            <UButton v-if="workStatuses.length > 5" variant="ghost" size="xs" color="primary"
                                @click="showAllStatuses = !showAllStatuses" class="w-full">
                                {{ showAllStatuses ? $t('Show less') : $t('View all') }}
                            </UButton>
                        </div>
                    </template>
                </UAccordion>

                <!-- Assignee Filter -->
                <UAccordion :items="[{ label: $t('Assignees'), slot: 'assignees', defaultOpen: true }]">
                    <template #assignees>
                        <div class="space-y-2 py-2">
                            <label v-for="assignee in visibleAssignees" :key="assignee"
                                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                                <UCheckbox :model-value="workFilter.assigned_tos.some(u => u.id === assignee.id)"
                                    @update:model-value="toggleAssignee(assignee)" />
                                <UAvatar :src="assignee.avatar" :name="assignee.name" />
                                <span class="text-sm">{{ assignee.full_name }}</span>
                            </label>
                            <UButton v-if="assignee_users.length > 5" variant="ghost" size="xs" color="primary"
                                @click="showAllAssignees = !showAllAssignees" class="w-full">
                                {{ showAllAssignees ? $t('Show less') : $t('View all') }}
                            </UButton>
                        </div>
                    </template>
                </UAccordion>
            </div>
        </template>
    </UPopover>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const { t } = useI18n();

const filterStore = useFilterStore()
const { workFilter } = storeToRefs(filterStore)

const showAllStatuses = ref(false)
const showAllAssignees = ref(false)
// Priority options
// Priority options based on PrioritySelect
const priorityOptions = [
    { label: t('Low'), id: 1, icon: 'i-heroicons-check-circle', color: '#388e3c' },
    { label: t('Medium'), id: 2, icon: 'i-heroicons-exclamation-circle', color: '#fbc02d' },
    { label: t('High'), id: 3, icon: 'i-heroicons-exclamation-triangle', color: '#ff6d00' },
    { label: t('Urgent'), id: 4, icon: 'i-heroicons-stop-circle', color: '#d50000' },
    { label: t('Critical'), id: 5, icon: 'i-heroicons-x-circle', color: '#8b0000' },
    { label: t('None'), id: 6, icon: 'i-heroicons-question-mark-circle', color: '#9e9e9e' },
]

// Work statuses (same as AdditionFilters)
const workStatuses = [
    { label: t('Not Started'), id: 1, icon: 'mdi:checkbox-blank-outline' },
    { label: t('Backlog'), id: 2, icon: 'mdi:archive-outline' },
    { label: t('Todo'), id: 3, icon: 'mdi:format-list-bulleted' },
    { label: t('In Progress'), id: 4, icon: 'i-heroicons-arrow-path' },
    { label: t('Completed'), id: 5, icon: 'i-heroicons-check-circle' },
    { label: t('On Hold'), id: 6, icon: 'i-heroicons-pause-circle' },
    { label: t('Cancelled'), id: 7, icon: 'i-heroicons-x-circle' },
    { label: t('Deferred'), id: 8, icon: 'i-heroicons-clock' },
    { label: t('Waiting for Review'), id: 9, icon: 'i-heroicons-eye' },
    { label: t('Approved'), id: 10, icon: 'i-heroicons-check-badge' },
    { label: t('Rejected'), id: 11, icon: 'i-heroicons-x-mark' },
    { label: t('Pending'), id: 12, icon: 'i-heroicons-ellipsis-horizontal-circle' },
    { label: t('Failed'), id: 13, icon: 'mingcute:sad-line' },
    { label: t('Success'), id: 14, icon: 'i-heroicons-trophy' },
    { label: t('Archived'), id: 15, icon: 'i-heroicons-archive-box' },
    { label: t('Deleted'), id: 16, icon: 'i-heroicons-trash' },
    { label: t('Draft'), id: 17, icon: 'i-heroicons-document-text' },
]

const visibleStatuses = computed(() => {
    return showAllStatuses.value ? workStatuses : workStatuses.slice(0, 5)
})



// Helper functions
const togglePriority = (value) => {
    console.log('togglePriority', value)
    const index = workFilter.value.priorities.findIndex(p => p.id === value)
    if (index > -1) {
        workFilter.value.priorities.splice(index, 1)
    } else {
        workFilter.value.priorities.push({ label: priorityOptions.find(p => p.id === value).label, id: value })
    }
}

const isStatusSelected = (statusId) => {
    return workFilter.value.statuses.some(s => s.id === statusId)
}

const toggleStatus = (status) => {
    const index = workFilter.value.statuses.findIndex(s => s.id === status.id)
    if (index > -1) {
        workFilter.value.statuses.splice(index, 1)
    } else {
        workFilter.value.statuses.push(status)
    }
}

// Check if workFilter is empty
const isWorkFilterEmpty = computed(() => {
    return Object.values(workFilter.value).every(value => {
        if (Array.isArray(value)) return value.length === 0
        if (value === null) return true
        if (typeof value === 'string') return value.trim() === ''
        return false
    })
})
const assignee_users = computedAsync(async () => {
    const { data } = await useAPI().get('core/users/', {})
    return data.value.results
})
const visibleAssignees = computed(() => {
    return showAllAssignees.value ? assignee_users.value : assignee_users.value.slice(0, 5)
})
const toggleAssignee = (assignee) => {
    const index = workFilter.value.assigned_tos.findIndex(a => a.id === assignee.id)
    if (index > -1) {
        workFilter.value.assigned_tos.splice(index, 1)
    } else {
        workFilter.value.assigned_tos.push(assignee)
    }
}
</script>