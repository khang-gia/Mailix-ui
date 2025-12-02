<template>
    <div class="kanban-board">
        <div class="flex gap-4 overflow-x-auto pb-4">
            <!-- Dynamic Kanban Columns based on workKanbanColumn store -->
            <div v-for="column in visibleColumns" :key="column.key" class="kanban-column flex-shrink-0 w-80">
                <div class="kanban-column-header rounded-t-xl p-4" :class="getColumnHeaderClass(column.key)">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon :name="getColumnIcon(column.key)" class="w-5 h-5"
                                :class="getColumnIconClass(column.key)" />
                            <h3 class="font-semibold" :class="getColumnTitleClass(column.key)">
                                {{ $t(column.label) }}
                            </h3>
                            <span class="text-sm px-2 py-1 rounded-full" :class="getColumnBadgeClass(column.key)">
                                {{ getTasksByStatus(column.key).length }}
                            </span>
                        </div>
                        <UButton icon="i-heroicons-plus" size="xs" variant="ghost"
                            :color="getColumnColor(column.key)" />
                    </div>
                </div>
                <div class="kanban-column-content rounded-b-xl p-4 min-h-[500px] space-y-3"
                    :class="[getColumnContentClass(column.key), { 'drag-over': isDraggingOver === getStatusId(column.key) }]"
                    @drop="onDrop($event, getStatusId(column.key))"
                    @dragover="onDragOver($event, getStatusId(column.key))" @dragleave="onDragLeave" @dragenter.prevent>
                    <WorkKanbanCard v-for="task in getTasksByStatus(column.key)" :key="task.id" :task="task"
                        @dragstart="onDragStart($event, task)" />
                    <div v-if="getTasksByStatus(column.key).length === 0" class="text-center text-gray-400 py-8">
                        {{ $t('No tasks') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useDisplayColStore } from '@/stores/column'
import { storeToRefs } from 'pinia'

const columnStore = useDisplayColStore()
const { workKanbanColumn } = storeToRefs(columnStore)

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['update:status'])

// Map column keys to status IDs
const statusMap = {
    'not_started': 1,
    'backlog': 2,
    'todo': 3,
    'in_progress': 4,
    'completed': 5,
    'on_hold': 6,
    'cancelled': 7,
    'deferred': 8,
    'waiting_for_review': 9,
    'approved': 10,
    'rejected': 11,
    'pending': 12,
    'failed': 13,
    'success': 14,
    'archived': 15,
    'deleted': 16,
    'draft': 17
}

// Get visible columns from store
const visibleColumns = computed(() => {
    return workKanbanColumn.value.filter(col => col.is_show === true)
})

// Get status ID from column key
const getStatusId = (columnKey) => {
    return statusMap[columnKey] || 1
}

// Get tasks by column key
const getTasksByStatus = (columnKey) => {
    if (!props.tasks) return []
    const statusId = getStatusId(columnKey)
    return props.tasks.filter(task => task.status === statusId)
}

// Column styling configuration
const columnStyles = {
    'not_started': {
        header: 'bg-gray-100 dark:bg-gray-800',
        content: 'bg-gray-50 dark:bg-gray-900',
        icon: 'material-symbols:circle-outline',
        iconClass: 'text-gray-600',
        titleClass: 'text-gray-800 dark:text-gray-100',
        badgeClass: 'text-gray-500 bg-gray-200 dark:bg-gray-700',
        color: 'gray'
    },
    'backlog': {
        header: 'bg-blue-100 dark:bg-blue-900',
        content: 'bg-blue-50 dark:bg-blue-950',
        icon: 'mdi:archive-outline',
        iconClass: 'text-blue-600',
        titleClass: 'text-blue-800 dark:text-blue-100',
        badgeClass: 'text-blue-600 bg-blue-200 dark:bg-blue-800',
        color: 'blue'
    },
    'todo': {
        header: 'bg-green-100 dark:bg-green-900',
        content: 'bg-green-50 dark:bg-green-950',
        icon: 'mdi:format-list-bulleted',
        iconClass: 'text-green-600',
        titleClass: 'text-green-800 dark:text-green-100',
        badgeClass: 'text-green-600 bg-green-200 dark:bg-green-800',
        color: 'green'
    },
    'in_progress': {
        header: 'bg-yellow-100 dark:bg-yellow-900',
        content: 'bg-yellow-50 dark:bg-yellow-950',
        icon: 'i-heroicons-arrow-path',
        iconClass: 'text-yellow-600',
        titleClass: 'text-yellow-800 dark:text-yellow-100',
        badgeClass: 'text-yellow-600 bg-yellow-200 dark:bg-yellow-800',
        color: 'yellow'
    },
    'completed': {
        header: 'bg-emerald-100 dark:bg-emerald-900',
        content: 'bg-emerald-50 dark:bg-emerald-950',
        icon: 'i-heroicons-check-circle',
        iconClass: 'text-emerald-600',
        titleClass: 'text-emerald-800 dark:text-emerald-100',
        badgeClass: 'text-emerald-600 bg-emerald-200 dark:bg-emerald-800',
        color: 'emerald'
    },
    'on_hold': {
        header: 'bg-orange-100 dark:bg-orange-900',
        content: 'bg-orange-50 dark:bg-orange-950',
        icon: 'i-heroicons-pause-circle',
        iconClass: 'text-orange-600',
        titleClass: 'text-orange-800 dark:text-orange-100',
        badgeClass: 'text-orange-600 bg-orange-200 dark:bg-orange-800',
        color: 'orange'
    },
    'cancelled': {
        header: 'bg-red-100 dark:bg-red-900',
        content: 'bg-red-50 dark:bg-red-950',
        icon: 'i-heroicons-x-circle',
        iconClass: 'text-red-600',
        titleClass: 'text-red-800 dark:text-red-100',
        badgeClass: 'text-red-600 bg-red-200 dark:bg-red-800',
        color: 'red'
    }
}

// Default style for columns not in the map
const defaultStyle = {
    header: 'bg-gray-100 dark:bg-gray-800',
    content: 'bg-gray-50 dark:bg-gray-900',
    icon: 'i-heroicons-circle',
    iconClass: 'text-gray-600',
    titleClass: 'text-gray-800 dark:text-gray-100',
    badgeClass: 'text-gray-500 bg-gray-200 dark:bg-gray-700',
    color: 'gray'
}

// Helper functions to get column styles
const getColumnHeaderClass = (columnKey) => {
    return columnStyles[columnKey]?.header || defaultStyle.header
}

const getColumnContentClass = (columnKey) => {
    return columnStyles[columnKey]?.content || defaultStyle.content
}

const getColumnIcon = (columnKey) => {
    return columnStyles[columnKey]?.icon || defaultStyle.icon
}

const getColumnIconClass = (columnKey) => {
    return columnStyles[columnKey]?.iconClass || defaultStyle.iconClass
}

const getColumnTitleClass = (columnKey) => {
    return columnStyles[columnKey]?.titleClass || defaultStyle.titleClass
}

const getColumnBadgeClass = (columnKey) => {
    return columnStyles[columnKey]?.badgeClass || defaultStyle.badgeClass
}

const getColumnColor = (columnKey) => {
    return columnStyles[columnKey]?.color || defaultStyle.color
}

// Drag and drop functionality
const draggedTask = ref(null)
const isDraggingOver = ref(null)

const onDragStart = (event, task) => {
    draggedTask.value = task
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', event.target.innerHTML)
}

const onDragOver = (event, status) => {
    event.preventDefault()
    isDraggingOver.value = status
}

const onDragLeave = () => {
    isDraggingOver.value = null
}

const onDrop = (event, newStatus) => {
    event.preventDefault()
    isDraggingOver.value = null

    if (draggedTask.value && draggedTask.value.status !== newStatus) {
        emit('update:status', {
            taskId: draggedTask.value.id,
            oldStatus: draggedTask.value.status,
            newStatus: newStatus
        })
    }
    draggedTask.value = null
}
</script>

<style scoped>
.kanban-board {
    width: 100%;
}

.kanban-column {
    display: flex;
    flex-direction: column;
}

.kanban-column-content {
    flex: 1;
    transition: all 0.2s ease;
}

.kanban-column-content.drag-over {
    background-color: rgba(59, 130, 246, 0.1) !important;
    border: 2px dashed rgba(59, 130, 246, 0.5);
}
</style>
