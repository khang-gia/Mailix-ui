<template>
    <div v-if="activeFilters.length > 0"
        class="py-2 px-2 flex flex-wrap gap-2 bg-white dark:bg-[#1E1E2E] w-full items-center border-b border-gray-200 dark:border-gray-800">
        <div v-for="filter in activeFilters" :key="filter.key"
            class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-sm border border-gray-200 dark:border-gray-700">
            <span class="text-gray-500 dark:text-gray-400 mr-2">{{ filter.label }}</span>

            <!-- Priority Badge -->
            <div v-if="filter.key === 'priorities'" class="" v-for="priority in filter.value" :key="priority.id">
                <UBadge color="gray" variant="solid" class="flex items-center mr-2">
                    <UIcon
                        :name="`i-heroicons-${priority.id === 1 ? 'check-circle' : priority.id === 2 ? 'exclamation-circle' : priority.id === 3 ? 'exclamation-triangle' : priority.id === 4 ? 'stop-circle' : priority.id === 5 ? 'x-circle' : 'question-mark-circle'}`"
                        class="inline-block text-gray-500"
                        :style="{ color: priorityColors[priority.id] || '#9e9e9e' }" />
                    <span>{{ priority.label }}</span>
                </UBadge>
            </div>
            <!-- State Badge -->
            <div v-else-if="filter.key === 'statuses'" class="" v-for="status in filter.value" :key="status.id">
                <UBadge color="gray" variant="solid" class="flex items-center mr-2">
                    <UIcon :name="statusIcons[status.id]" class="inline-block text-gray-500" />
                    <span>{{ status.label }}</span>
                </UBadge>
            </div>
            <!-- Is Assigned To Badge -->
            <UBadge v-else-if="filter.key === 'assigned_to__isnull'" variant="subtle" size="xs"
                :color="filter.value ? 'red' : 'green'" class="mr-2 flex items-center gap-1">
                <UIcon :name="filter.value ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle'" class="w-4 h-4" />
            </UBadge>

            <!-- Avatar Value -->
            <span v-else-if="filter.key === 'assigned_tos' || filter.key === 'assigned_bys'" class=""
                v-for="user in filter.value" :key="user.id">
                <UBadge color="gray" variant="solid" class="flex items-center mr-2">
                    <UAvatar :src="user.avatar" :alt="user.full_name" size="2xs" />
                    <span>{{ user.full_name }}</span>
                </UBadge>
            </span>

            <UButton icon="i-heroicons-x-mark" size="2xs" color="gray" variant="ghost"
                class="-mr-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" @click="removeFilter(filter)" />
        </div>

        <UButton v-if="activeFilters.length > 0" :label="$t('Clear All')" size="xs" color="gray" variant="ghost"
            icon="i-heroicons-x-mark" @click="clearAllFilters" class="ml-auto" />
    </div>

    <div class="p-2 ">
        <!-- <WorkKanban :tasks="works" @update:status="handleStatusUpdate" @create:task="handleTaskCreate" /> -->

        <UCard
            :ui="{ rounded: 'rounded-xl', divide: '', body: { padding: 'py-0' }, footer: { padding: 'px-0' }, header: { padding: 'pb-0' } }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-center space-x-2">
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {{ $t('Kanban board - Work management') }}
                        </h2>
                    </div>
                </div>
            </template>
            <div class="kanban-com">
                <WorkKanban :tasks="localWorks" @update:status="handleStatusUpdate" @create:task="handleTaskCreate" />
            </div>
        </UCard>
    </div>

    <!-- Create Work Item Modal -->
    <ModalCreateKanbanItem @workCreated="handleWorkCreated" />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { alertConfirm, alertModal } = storeToRefs(modalStore)
const { setAlertModal } = modalStore
import { useFilterStore } from '@/stores/filter'
import { useSearchStore } from '@/stores/search';
import { saveAs } from "file-saver"
import moment from "moment"

const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);
const filterStore = useFilterStore()
const { setFilterModal, clearFilter } = filterStore
const { workFilter } = storeToRefs(filterStore)

// No props needed - using workFilter from store directly

const filterLabels = {
    priorities: t('Priority'),
    statuses: t('State'),
    assigned_tos: t('Assignees'),
    assigned_bys: t('Assigned by'),
    managers: t('Manager'),
    start_date: t('Start Date'),
    end_date: t('End Date'),
    ordering: t('Ordering'),
    group: t('Group'),
    type_of_customer: t('Type of Customer'),
    customer_source: t('Customer Source'),
    curators: t('Curators'),
    departments: t('Departments'),
    title: t('Title'),
    direct_managers: t('Direct Managers'),
    join_date: t('Join Date'),
    progress_start: t('Progress Start'),
    progress_end: t('Progress End'),
    actual_start_date: t('Actual Start Date'),
    assigned_to__isnull: t('Is assigned to'),
}
const priorityColors = {
    1: '#388e3c', // Green (Low)
    2: '#fbc02d', // Yellow (Medium)
    3: '#ff6d00', // Orange (High)
    4: '#d50000', // Bright Red (Urgent)
    5: '#8b0000', // Dark Red (Critical)
    6: '#9e9e9e', // Grey (None)
}
const statusIcons = {
    1: 'mdi:checkbox-blank-outline',
    // 2: 'mdi:archive-outline',
    // 3: 'mdi:format-list-bulleted',
    4: 'i-heroicons-arrow-path',
    5: 'i-heroicons-check-circle',
    6: 'i-heroicons-pause-circle',
    7: 'i-heroicons-x-circle',
    // 8: 'i-heroicons-clock',
    // 9: 'i-heroicons-eye',
    // 10: 'i-heroicons-check-badge',
    // 11: 'i-heroicons-x-mark',
    // 12: 'i-heroicons-ellipsis-horizontal-circle',
    // 13: 'mingcute:sad-line',
    // 14: 'i-heroicons-trophy',
    // 15: 'i-heroicons-archive-box',
    // 16: 'i-heroicons-trash',
    // 17: 'i-heroicons-document-text',
}
const activeFilters = computed(() => {
    const filters = [];

    // Helper to process values
    const processValue = (key, value, source) => {

        if (!value && key !== 'assigned_to__isnull') return;
        if (Array.isArray(value) && value.length === 0) return;
        if (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length) return;

        let displayValue = value;
        const arrayDisplayValue = []
        if (Array.isArray(value)) {
            // displayValue = value.map(item => item.name || item.username || item.title || item.label || item).join(', ');
            displayValue = value
        } else if (typeof value === 'object') {
            displayValue = value.name || value.username || value.title || JSON.stringify(value);
        }

        filters.push({
            key,
            label: filterLabels[key] || key,
            value: displayValue,
            rawValue: value,
            source // 'work' or 'main'
        });
    };

    // Process workFilter from store
    for (const key in workFilter.value) {
        processValue(key, workFilter.value[key], 'work');
    }

    return filters;
});

const removeFilter = (filter) => {
    // All filters come from workFilter store
    if (Array.isArray(workFilter.value[filter.key])) {
        workFilter.value[filter.key] = [];
    } else {
        workFilter.value[filter.key] = null;
        if (filter.key === 'priorities' || filter.key === 'progress_start' || filter.key === 'progress_end') {
            workFilter.value[filter.key] = '';
        }
    }
    reload.value = !reload.value;
};

const clearAllFilters = () => {
    clearFilter('works');
    reload.value = !reload.value;
};

const reload = ref(false);
const works = computedAsync(async () => {
    const processedAdditionalFilter = {};
    for (const key in workFilter.value) {
        if (Array.isArray(workFilter.value[key])) {
            processedAdditionalFilter[key] = workFilter.value[key].map(item => item.id || item).join(',');
        } else {
            processedAdditionalFilter[key] = workFilter.value[key];
        }
    }
    const data = await useAPI().$get('core/works/', {
        ...processedAdditionalFilter,
        reload: reload.value,
        search: search.value,
    })
    return data.results
})

// Local works array that can be mutated for instant updates
const localWorks = ref([])
const newlyCreatedWorks = ref([])

// Watch works and sync to localWorks, combining with newly created items
watch(works, (fetchedWorks) => {
    if (fetchedWorks) {
        // Combine newly created works with fetched works, avoiding duplicates
        const fetchedIds = new Set(fetchedWorks.map(w => w.id))
        const uniqueNewWorks = newlyCreatedWorks.value.filter(w => !fetchedIds.has(w.id))
        localWorks.value = [...uniqueNewWorks, ...fetchedWorks]
    }
}, { immediate: true })

// Handle Kanban status update
const handleStatusUpdate = async ({ taskId, oldStatus, newStatus }) => {
    try {
        await useAPI().patch(`core/works/${taskId}/`, {
            status: newStatus
        })
        // Reload tasks to reflect the change
        reload.value = !reload.value
    } catch (error) {
        console.error('Failed to update task status:', error)
        // Optionally show error notification to user
    }
}

// Handle task creation
const handleTaskCreate = () => {
    // Reload tasks to show the newly created task
    reload.value = !reload.value
}

// Handle work created from modal - fetch and add to array without full reload
const handleWorkCreated = async (workId) => {
    try {
        // Fetch the complete work item from API
        const { data: workItem } = await useAPI().get(`core/works/${workId}/`)

        if (workItem.value) {
            // Add to newly created works tracker
            newlyCreatedWorks.value.unshift(workItem.value)
            // Add to local works for immediate display
            localWorks.value.unshift(workItem.value)
            console.log('New work item added:', workItem.value)
        }
    } catch (error) {
        console.error('Failed to fetch created work item:', error)
        // Fallback to reload if fetch fails
        reload.value = !reload.value
    }
}
</script>
<style scoped>
.kanban-com {
    height: calc(100vh - 200px);
    /* adjust for header */
    display: flex;
    flex-direction: column;
}

html,
body {
    height: 100%;
    overflow: hidden;
}
</style>