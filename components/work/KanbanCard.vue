<template>
    <div class="kanban-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move border border-gray-200 dark:border-gray-700"
        draggable="true" @dragstart="$emit('dragstart', $event)">

        <!-- Priority Badge -->
        <div class="flex items-center justify-between mb-2">
            <span v-if="task.priority >= 3" class="text-xs px-2 py-1 rounded-full font-medium" :class="{
                'bg-yellow-100 text-yellow-700': task.priority === 3,
                'bg-orange-100 text-orange-700': task.priority === 4,
                'bg-red-100 text-red-700': task.priority === 5
            }">
                {{ getPriorityLabel(task.priority) }}
            </span>
            <span v-else class="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                {{ getPriorityLabel(task.priority) }}
            </span>

            <UIcon v-if="task.priority >= 4" name="fluent:alert-urgent-16-filled" class="w-4 h-4 text-red-600" />
        </div>

        <!-- Task Code -->
        <p v-if="task.code" class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ task.code }}</p>

        <!-- Task Name -->
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {{ task.name }}
        </h4>

        <!-- Task Brief -->
        <div v-if="task.brief" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2" v-html="task.brief">
        </div>

        <!-- Progress Bar -->
        <UProgress v-if="task.progress !== undefined" :value="task.progress" size="sm" class="mb-3" />

        <!-- Footer -->
        <div class="flex items-center justify-between">
            <!-- Assigned Users -->
            <UAvatarGroup size="xs" :max="3" v-if="task.assigned_to && task.assigned_to.length" :ui="{ ring: '' }">
                <UAvatar v-for="user in task.assigned_to" :key="user.id" :src="user.avatar" :alt="user.display_name" />
            </UAvatarGroup>
            <div v-else class="w-1"></div>

            <!-- Due Date -->
            <div v-if="task.end_date" class="flex items-center gap-1 text-xs" :class="{
                'text-red-600': isOverdue(task.end_date),
                'text-orange-600': isDueSoon(task.end_date),
                'text-gray-500': !isOverdue(task.end_date) && !isDueSoon(task.end_date)
            }">
                <UIcon name="material-symbols:calendar-today" class="w-3 h-3" />
                <span>{{ formatDate(task.end_date) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs();

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
})

defineEmits(['dragstart'])

const getPriorityLabel = (priority) => {
    const labels = {
        1: t('Low'),
        2: t('Medium'),
        3: t('High'),
        4: t('Urgent'),
        5: t('Critical')
    }
    return labels[priority] || t('Normal')
}

const formatDate = (date) => {
    return dayjs(date).format('MMM DD')
}

const isOverdue = (date) => {
    return dayjs(date).isBefore(dayjs(), 'day')
}

const isDueSoon = (date) => {
    const daysUntilDue = dayjs(date).diff(dayjs(), 'day')
    return daysUntilDue >= 0 && daysUntilDue <= 3
}
</script>

<style scoped>
.kanban-card {
    user-select: none;
}

.kanban-card:active {
    opacity: 0.8;
    cursor: grabbing;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
