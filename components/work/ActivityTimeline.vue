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
                    <span class="rounded-full w-10 h-10 justify-center flex items-center bg-blue-100 dark:bg-blue-900">
                        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </span>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {{ $t('Recent Activity') }}
                    </h2>
                </div>
                <UBadge color="gray" variant="subtle" size="sm">
                    {{ activities.length }} {{ $t('activities') }}
                </UBadge>
            </div>
        </template>

        <!-- Timeline Content -->
        <div v-if="activities.length > 0" class="space-y-6">
            <!-- Time Group -->
            <div v-for="(group, groupName) in groupedActivities" :key="groupName" class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {{ $t(groupName) }}
                </h3>

                <!-- Activity Items -->
                <div class="space-y-3">
                    <div v-for="(activity, index) in group" :key="activity.id" class="flex gap-4 relative group/item">
                        <!-- Timeline Line -->
                        <div class="relative flex flex-col items-center">
                            <!-- Icon Circle -->
                            <div class="rounded-full p-2 z-10" :class="getActivityStyle(activity.type).bg">
                                <UIcon :name="getActivityStyle(activity.type).icon" class="w-4 h-4"
                                    :class="getActivityStyle(activity.type).iconColor" />
                            </div>
                            <!-- Connector Line -->
                            <div v-if="index < group.length - 1" class="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2"
                                style="min-height: 20px;">
                            </div>
                        </div>

                        <!-- Activity Content -->
                        <div class="flex-1 pb-4">
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 
                                hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors
                                border border-gray-200 dark:border-gray-700">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                            {{ activity.title }}
                                        </p>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">
                                            {{ activity.description }}
                                        </p>
                                    </div>
                                    <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {{ formatTime(activity.timestamp) }}
                                    </span>
                                </div>

                                <!-- Additional Info -->
                                <div v-if="activity.metadata" class="mt-3 flex flex-wrap gap-2">
                                    <UBadge v-if="activity.metadata.priority"
                                        :color="getPriorityColor(activity.metadata.priority)" variant="subtle"
                                        size="xs">
                                        {{ $t(activity.metadata.priority) }}
                                    </UBadge>
                                    <UBadge v-if="activity.metadata.status" color="gray" variant="subtle" size="xs">
                                        {{ $t(activity.metadata.status) }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <UIcon name="i-heroicons-inbox" class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p class="text-gray-500 dark:text-gray-400 text-sm">
                {{ $t('No recent activity') }}
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

// Activity type styling
const activityStyles = {
    created: {
        icon: 'i-heroicons-plus-circle',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900'
    },
    status_changed: {
        icon: 'i-heroicons-arrow-path',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900'
    },
    completed: {
        icon: 'i-heroicons-check-circle',
        iconColor: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900'
    },
    deadline: {
        icon: 'i-heroicons-clock',
        iconColor: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-100 dark:bg-orange-900'
    },
    assigned: {
        icon: 'i-heroicons-user-plus',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-100 dark:bg-purple-900'
    }
}

const getActivityStyle = (type) => {
    return activityStyles[type] || activityStyles.created
}

const getPriorityColor = (priority) => {
    const colors = {
        'Low': 'green',
        'Medium': 'yellow',
        'High': 'orange',
        'Urgent': 'red',
        'Critical': 'red'
    }
    return colors[priority] || 'gray'
}

// Process tasks into activities
const activities = computed(() => {
    if (!props.tasks || props.tasks.length === 0) return []

    const result = []
    const now = new Date()

    props.tasks.forEach(task => {
        // Created activity
        if (task.created_at) {
            result.push({
                id: `created-${task.id}`,
                type: 'created',
                title: task.name || t('New work item'),
                description: t('Work item was created'),
                timestamp: new Date(task.created_at),
                metadata: {
                    priority: getPriorityLabel(task.priority),
                    status: getStatusLabel(task.status)
                }
            })
        }

        // Completed activity
        if (task.status === 5) { // Completed status
            result.push({
                id: `completed-${task.id}`,
                type: 'completed',
                title: task.name || t('Work completed'),
                description: t('Work item was marked as completed'),
                timestamp: task.updated_at ? new Date(task.updated_at) : new Date(task.created_at),
                metadata: {
                    priority: getPriorityLabel(task.priority)
                }
            })
        }

        // Deadline activity (upcoming deadlines within 7 days)
        if (task.end_date) {
            const endDate = new Date(task.end_date)
            const daysUntil = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))

            if (daysUntil >= 0 && daysUntil <= 7 && task.status !== 5) {
                result.push({
                    id: `deadline-${task.id}`,
                    type: 'deadline',
                    title: task.name || t('Upcoming deadline'),
                    description: daysUntil === 0
                        ? t('Due today')
                        : daysUntil === 1
                            ? t('Due tomorrow')
                            : t('Due in {days} days', { days: daysUntil }),
                    timestamp: endDate,
                    metadata: {
                        priority: getPriorityLabel(task.priority),
                        status: getStatusLabel(task.status)
                    }
                })
            }
        }
    })

    // Sort by timestamp (newest first)
    return result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20)
})

// Group activities by time period
const groupedActivities = computed(() => {
    const groups = {
        'Today': [],
        'Yesterday': [],
        'This Week': [],
        'Earlier': []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    activities.value.forEach(activity => {
        const activityDate = new Date(activity.timestamp)
        const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())

        if (activityDay.getTime() === today.getTime()) {
            groups['Today'].push(activity)
        } else if (activityDay.getTime() === yesterday.getTime()) {
            groups['Yesterday'].push(activity)
        } else if (activityDate >= weekAgo) {
            groups['This Week'].push(activity)
        } else {
            groups['Earlier'].push(activity)
        }
    })

    // Remove empty groups
    return Object.fromEntries(
        Object.entries(groups).filter(([_, items]) => items.length > 0)
    )
})

// Format timestamp
const formatTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('Just now')
    if (diffMins < 60) return t('{mins} minutes ago', { mins: diffMins })
    if (diffHours < 24) return t('{hours} hours ago', { hours: diffHours })
    if (diffDays < 7) return t('{days} days ago', { days: diffDays })

    return date.toLocaleDateString()
}

// Helper functions
const getPriorityLabel = (priority) => {
    const labels = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Urgent',
        5: 'Critical',
        6: 'None'
    }
    return labels[priority] || 'None'
}

const getStatusLabel = (status) => {
    const labels = {
        1: 'Not Started',
        2: 'Backlog',
        3: 'Todo',
        4: 'In Progress',
        5: 'Completed',
        6: 'On Hold',
        7: 'Cancelled'
    }
    return labels[status] || 'Unknown'
}
</script>
