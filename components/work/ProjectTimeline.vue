<template>
    <UCard :ui="{
        rounded: 'rounded-xl',
        divide: '',
        body: { padding: 'p-6' },
        header: { padding: 'pb-4' }
    }" class="w-full">
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span
                        class="rounded-full w-10 h-10 justify-center flex items-center bg-purple-100 dark:bg-purple-900">
                        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </span>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {{ $t('Timeline') }}
                    </h2>
                </div>
                <div class="flex items-center gap-2">
                    <!-- <UBadge color="gray" variant="subtle" size="sm">
                        {{ scheduledTasks.length }} {{ $t('tasks') }}
                    </UBadge> -->
                    <UButton size="xs" color="gray" variant="ghost" @click="currentWeek = 0">
                        {{ $t('This Week') }}
                    </UButton>
                </div>
            </div>
        </template>

        <!-- Timeline Content -->
        <div v-if="scheduledTasks.length > 0" class="space-y-4">
            <!-- Week Navigation -->
            <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <UButton icon="i-heroicons-chevron-left" size="xs" color="gray" variant="ghost"
                    @click="currentWeek--" />
                <div class="text-center">
                    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ formatWeekRange(weekStart, weekEnd) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatMonthYear(weekStart) }}
                    </p>
                </div>
                <UButton icon="i-heroicons-chevron-right" size="xs" color="gray" variant="ghost"
                    @click="currentWeek++" />
            </div>

            <!-- Calendar Header (Days) -->
            <div class="grid grid-cols-8 gap-2">
                <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {{ $t('Task') }}
                </div>
                <div v-for="day in weekDays" :key="day.date" class="text-center">
                    <div class="text-xs font-medium"
                        :class="isToday(day.date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'">
                        {{ day.dayName }}
                    </div>
                    <div class="text-sm font-semibold mt-1"
                        :class="isToday(day.date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'">
                        {{ day.dayNum }}
                    </div>
                </div>
            </div>

            <!-- Tasks Timeline -->
            <div class="space-y-2">
                <div v-for="task in visibleTasks" :key="task.id" class="grid grid-cols-8 gap-2 items-center group">
                    <!-- Task Name -->
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate pr-2">
                        {{ task.name }}
                    </div>

                    <!-- Timeline Grid -->
                    <div class="col-span-7 relative h-10">
                        <div class="absolute inset-0 grid grid-cols-7 gap-2">
                            <!-- Background grid -->
                            <div v-for="day in weekDays" :key="day.date"
                                class="border-l border-gray-200 dark:border-gray-700"
                                :class="{ 'bg-blue-50 dark:bg-blue-950': isToday(day.date) }">
                            </div>
                        </div>

                        <!-- Task Bar -->
                        <div v-if="getTaskPosition(task)" class="absolute top-1 h-8 rounded-lg flex items-center px-3 cursor-pointer
                                transition-all hover:shadow-lg hover:scale-105 z-10" :style="getTaskBarStyle(task)"
                            :class="getTaskBarClass(task)">
                            <div class="flex items-center gap-2 min-w-0">
                                <UIcon :name="getStatusIcon(task.status)" class="w-4 h-4 flex-shrink-0" />
                                <span class="text-xs font-medium truncate">
                                    {{ task.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <UIcon name="i-heroicons-calendar" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p class="text-gray-500 dark:text-gray-400 text-sm">
                {{ $t('No scheduled tasks') }}
            </p>
        </div>
    </UCard>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    tasks: {
        type: Array,
        default: () => []
    }
})

const currentWeek = ref(0) // 0 = this week, -1 = last week, 1 = next week

// Calculate week start and end
const weekStart = computed(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Start from Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + (currentWeek.value * 7))
    monday.setHours(0, 0, 0, 0)
    return monday
})

const weekEnd = computed(() => {
    const end = new Date(weekStart.value)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return end
})

// Generate week days
const weekDays = computed(() => {
    const days = []
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart.value)
        date.setDate(date.getDate() + i)
        days.push({
            date: date,
            dayName: dayNames[i],
            dayNum: date.getDate()
        })
    }
    return days
})

// Filter tasks that have dates
const scheduledTasks = computed(() => {
    return props.tasks.filter(task => task.start_date || task.end_date)
})

// Get tasks visible in current week
const visibleTasks = computed(() => {
    return scheduledTasks.value.filter(task => {
        const taskStart = task.start_date ? new Date(task.start_date) : null
        const taskEnd = task.end_date ? new Date(task.end_date) : null

        if (!taskStart && !taskEnd) return false

        const start = taskStart || taskEnd
        const end = taskEnd || taskStart

        // Check if task overlaps with current week
        return start <= weekEnd.value && end >= weekStart.value
    }).slice(0, 10) // Limit to 10 tasks for better visibility
})

// Calculate task position on timeline
const getTaskPosition = (task) => {
    const taskStart = task.start_date ? new Date(task.start_date) : null
    const taskEnd = task.end_date ? new Date(task.end_date) : null

    if (!taskStart && !taskEnd) return null

    const start = taskStart || taskEnd
    const end = taskEnd || taskStart

    // Calculate position relative to week
    const weekStartMs = weekStart.value.getTime()
    const weekDuration = 7 * 24 * 60 * 60 * 1000

    const startOffset = Math.max(0, (start - weekStart.value) / weekDuration)
    const endOffset = Math.min(1, (end - weekStart.value) / weekDuration)

    return {
        left: startOffset * 100,
        width: (endOffset - startOffset) * 100
    }
}

// Get task bar style
const getTaskBarStyle = (task) => {
    const position = getTaskPosition(task)
    if (!position) return {}

    return {
        left: `${position.left}%`,
        width: `${Math.max(position.width, 5)}%` // Minimum 5% width
    }
}

// Get task bar color based on status
const getTaskBarClass = (task) => {
    const statusColors = {
        1: 'bg-gray-500 text-white', // Not Started
        2: 'bg-blue-500 text-white', // Backlog
        3: 'bg-green-500 text-white', // Todo
        4: 'bg-yellow-500 text-white', // In Progress
        5: 'bg-emerald-600 text-white', // Completed
        6: 'bg-orange-500 text-white', // On Hold
        7: 'bg-red-500 text-white' // Cancelled
    }
    return statusColors[task.status] || 'bg-gray-500 text-white'
}

// Get status icon
const getStatusIcon = (status) => {
    const icons = {
        1: 'material-symbols:circle-outline',
        2: 'i-heroicons-archive-box',
        3: 'i-heroicons-list-bullet',
        4: 'i-heroicons-arrow-path',
        5: 'i-heroicons-check-circle',
        6: 'i-heroicons-pause-circle',
        7: 'i-heroicons-x-circle'
    }
    return icons[status] || 'material-symbols:circle-outline'
}

// Check if date is today
const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}

// Format week range
const formatWeekRange = (start, end) => {
    const startDay = start.getDate()
    const endDay = end.getDate()
    const startMonth = start.toLocaleString('default', { month: 'short' })
    const endMonth = end.toLocaleString('default', { month: 'short' })

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}`
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

// Format month and year
const formatMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}
</script>
