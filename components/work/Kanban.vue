<template>
    <div class="kanban-board">
        <div class="flex gap-4 overflow-x-auto pb-4">
            <!-- Dynamic Kanban Columns based on workKanbanColumn store -->
            <div v-for="column in visibleColumns" :key="column.key"
                class="kanban-column flex-shrink-0 w-80 flex flex-col">
                <!-- Column Header -->
                <div class="rounded-t-xl p-4 bg-gray-100 dark:bg-gray-800">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon :name="getColumnIcon(column.key)" class="w-5 h-5 text-gray-600" />
                            <h3 class="font-semibold text-gray-800 dark:text-gray-100">
                                {{ $t(column.label) }}
                            </h3>
                            <span class="text-sm px-2 py-1 rounded-full text-gray-600">
                                {{ getTasksByStatus(column.key).length }}
                            </span>
                        </div>
                        <UButton icon="i-heroicons-plus" size="xs" variant="ghost" color="gray"
                            @click="openCreateModal(column.key)" />
                    </div>
                </div>

                <!-- Column Content - Scrollable -->
                <div class="kanban-column-content rounded-b-xl bg-gray-50 dark:bg-gray-900 flex flex-col">
                    <div class="overflow-y-auto flex-1 p-4 pb-0 space-y-3"
                        :class="{ 'drag-over': isDraggingOver === getStatusId(column.key) }"
                        @drop="onDrop($event, getStatusId(column.key))"
                        @dragover="onDragOver($event, getStatusId(column.key))" @dragleave="onDragLeave"
                        @dragenter.prevent>

                        <!-- Task Cards -->
                        <WorkKanbanCard v-for="task in getTasksByStatus(column.key)" :key="task.id" :task="task"
                            @dragstart="onDragStart($event, task)" />

                        <!-- Inline Creation Card -->
                        <div v-if="isCreating[column.key]"
                            class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                            <UInput v-model="newTaskTitle[column.key]" :placeholder="$t('Enter title')" size="sm"
                                autofocus @keyup.enter="createTask(column.key)" @keyup.esc="cancelCreate(column.key)"
                                @blur="cancelCreate(column.key)" />
                        </div>

                        <!-- New Item Button - Flows with content, sticky when scrolling -->
                        <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-900 py-2 w-full">
                            <UButton v-if="!isCreating[column.key]" icon="i-heroicons-plus" size="sm" color="gray"
                                variant="ghost" block class="justify-start text-gray-500"
                                @click="startCreate(column.key)">
                                {{ $t('New Work Item') }}
                            </UButton>
                        </div>

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

const emit = defineEmits(['update:status', 'create:task'])

// Inline creation state
const isCreating = ref({})
const newTaskTitle = ref({})

// Start creating a new task in a column
const startCreate = (columnKey) => {
    isCreating.value[columnKey] = true
    newTaskTitle.value[columnKey] = ''
}

// Cancel task creation
const cancelCreate = (columnKey) => {
    // Small delay to allow Enter key to process first
    setTimeout(() => {
        isCreating.value[columnKey] = false
        newTaskTitle.value[columnKey] = ''
    }, 100)
}

// Create a new task
const createTask = async (columnKey) => {
    const title = newTaskTitle.value[columnKey]?.trim()
    if (!title) {
        cancelCreate(columnKey)
        return
    }

    const statusId = getStatusId(columnKey)

    try {
        // Call API to create work
        const { data } = await useAPI().post('core/works/', {
            name: title,
            status: statusId
        })

        if (data.value) {
            useToast().add({
                title: t('Success'),
                description: t('The work was successfully created.'),
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })

            // Emit event to refresh tasks
            emit('create:task', data.value)
        }
    } catch (error) {
        console.error('Failed to create task:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to create work item'),
            icon: 'i-heroicons-x-circle',
            color: 'red'
        })
    } finally {
        isCreating.value[columnKey] = false
        newTaskTitle.value[columnKey] = ''
    }
}

// Open create modal with pre-filled status
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setWorkKanbanModal } = modalStore

const openCreateModal = (columnKey) => {
    const statusId = getStatusId(columnKey)
    setWorkKanbanModal(true, statusId)
}

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
    icon: 'material-symbols:circle-outline',
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
    flex: 1;
    display: flex;
    gap: 16px;
    min-height: 0;
}

.kanban-column {
    display: flex;

}

.kanban-column-content {
    flex: 1;
    transition: all 0.2s ease;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
}

.kanban-column-content.drag-over {
    background-color: rgba(59, 130, 246, 0.1) !important;
    border: 2px dashed rgba(59, 130, 246, 0.5);
}
</style>
