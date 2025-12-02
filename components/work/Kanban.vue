<template>
    <div class="kanban-board">
        <div class="flex gap-4 overflow-x-auto pb-4">
            <!-- To Do Column -->
            <div class="kanban-column flex-shrink-0 w-80">
                <div class="kanban-column-header bg-gray-100 dark:bg-gray-800 rounded-t-xl p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon name="material-symbols:circle-outline" class="w-5 h-5 text-gray-600" />
                            <h3 class="font-semibold text-gray-800 dark:text-gray-100">{{ $t('Not Started') }}</h3>
                            <span class="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {{ todoTasks.length }}
                            </span>
                        </div>
                        <UButton icon="i-heroicons-plus" size="xs" color="gray" variant="ghost" />
                    </div>
                </div>
                <div class="kanban-column-content bg-gray-50 dark:bg-gray-900 rounded-b-xl p-4 min-h-[500px] space-y-3"
                    :class="{ 'drag-over': isDraggingOver === 1 }" @drop="onDrop($event, 1)"
                    @dragover="onDragOver($event, 1)" @dragleave="onDragLeave" @dragenter.prevent>
                    <WorkKanbanCard v-for="task in todoTasks" :key="task.id" :task="task"
                        @dragstart="onDragStart($event, task)" />
                    <div v-if="todoTasks.length === 0" class="text-center text-gray-400 py-8">
                        {{ $t('No tasks') }}
                    </div>
                </div>
            </div>

            <!-- In Progress Column -->
            <div class="kanban-column flex-shrink-0 w-80">
                <div class="kanban-column-header bg-blue-100 dark:bg-blue-900 rounded-t-xl p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon name="material-symbols:progress-activity" class="w-5 h-5 text-blue-600" />
                            <h3 class="font-semibold text-blue-800 dark:text-blue-100">{{ $t('Backlog') }}</h3>
                            <span class="text-sm text-blue-600 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-full">
                                {{ inProgressTasks.length }}
                            </span>
                        </div>
                        <UButton icon="i-heroicons-plus" size="xs" color="blue" variant="ghost" />
                    </div>
                </div>
                <div class="kanban-column-content bg-blue-50 dark:bg-blue-950 rounded-b-xl p-4 min-h-[500px] space-y-3"
                    :class="{ 'drag-over': isDraggingOver === 2 }" @drop="onDrop($event, 2)"
                    @dragover="onDragOver($event, 2)" @dragleave="onDragLeave" @dragenter.prevent>
                    <WorkKanbanCard v-for="task in inProgressTasks" :key="task.id" :task="task"
                        @dragstart="onDragStart($event, task)" />
                    <div v-if="inProgressTasks.length === 0" class="text-center text-gray-400 py-8">
                        {{ $t('No tasks') }}
                    </div>
                </div>
            </div>

            <!-- Done Column -->
            <div class="kanban-column flex-shrink-0 w-80">
                <div class="kanban-column-header bg-green-100 dark:bg-green-900 rounded-t-xl p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon name="material-symbols:check-circle-outline" class="w-5 h-5 text-green-600" />
                            <h3 class="font-semibold text-green-800 dark:text-green-100">{{ $t('Todo') }}</h3>
                            <span class="text-sm text-green-600 bg-green-200 dark:bg-green-800 px-2 py-1 rounded-full">
                                {{ doneTasks.length }}
                            </span>
                        </div>
                        <UButton icon="i-heroicons-plus" size="xs" color="green" variant="ghost" />
                    </div>
                </div>
                <div class="kanban-column-content bg-green-50 dark:bg-green-950 rounded-b-xl p-4 min-h-[500px] space-y-3"
                    :class="{ 'drag-over': isDraggingOver === 3 }" @drop="onDrop($event, 3)"
                    @dragover="onDragOver($event, 3)" @dragleave="onDragLeave" @dragenter.prevent>
                    <WorkKanbanCard v-for="task in doneTasks" :key="task.id" :task="task"
                        @dragstart="onDragStart($event, task)" />
                    <div v-if="doneTasks.length === 0" class="text-center text-gray-400 py-8">
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

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['update:status'])

// Separate tasks by status
const todoTasks = computed(() => {
    if (!props.tasks) return []
    return props.tasks.filter(task => task.status === 1)
})

const inProgressTasks = computed(() => {
    if (!props.tasks) return []
    return props.tasks.filter(task => task.status === 2)
})

const doneTasks = computed(() => {
    if (!props.tasks) return []
    return props.tasks.filter(task => task.status === 3)
})

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
