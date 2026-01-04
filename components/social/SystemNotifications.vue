<template>
    <div v-if="loading || notifications.length > 0">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{{ t('Company Announcements') }}
        </h3>

        <!-- Loading state -->
        <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        </div>

        <!-- Notifications list -->
        <div v-else class="space-y-4">
            <div v-for="notif in notifications" :key="notif.id"
                class="flex gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                @click="handleNotificationClick(notif)">
                <div
                    class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-megaphone" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="flex-1 min-w-0">
                    <p
                        class="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {{ notif.title }}
                    </p>
                    <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <UIcon name="i-heroicons-clock" class="w-3 h-3 flex-shrink-0" />
                        <span class="truncate">{{ formatTime(notif.created_at) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useAPI()

const notifications = ref([])
const loading = ref(false)
const error = ref(null)

const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
        return diffMins <= 1 ? t('Just now') : t('{mins} minutes ago', { mins: diffMins })
    } else if (diffHours < 24) {
        return t('{hours} hours ago', { hours: diffHours })
    } else if (diffDays < 7) {
        return t('{days} days ago', { days: diffDays })
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
}

const handleNotificationClick = (notif) => {
    if (notif.link_to) {
        // Navigate to the link if it exists
        navigateTo(notif.link_to)
    }
}

const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await api.$get('core/system_notifications/', {
            ordering: '-created_at',
            page_size: 5
        })

        notifications.value = response.results || response || []
    } catch (err) {
        console.error('Failed to fetch system notifications:', err)
        error.value = err
        notifications.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchNotifications()
})
</script>
