<template>
    <div>
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{{ t('Today\'s Events') }}</h3>

        <!-- Loading state -->
        <div v-if="loading" class="space-y-3">
            <div v-for="i in 2" :key="i" class="animate-pulse">
                <div class="flex gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Events list -->
        <div v-else class="space-y-3">
            <div v-for="event in todayEvents" :key="event.id"
                class="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                <div class="flex gap-3">
                    <!-- Time badge -->
                    <div
                        class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800">
                        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <!-- Event details -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <!-- Pulsing dot for happening now -->
                            <span v-if="event.isHappening" class="relative flex h-2 w-2 flex-shrink-0">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <h4
                                class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {{ event.title }}
                            </h4>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <UIcon name="i-heroicons-clock" class="w-3 h-3 flex-shrink-0" />
                            <span class="truncate">{{ event.time }}</span>
                        </div>
                        <div v-if="event.location"
                            class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <UIcon name="i-heroicons-map-pin" class="w-3 h-3 flex-shrink-0" />
                            <span class="truncate">{{ event.location }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && todayEvents.length === 0" class="text-center py-6">
            <UIcon name="i-heroicons-calendar" class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('No events today') }}</p>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useAPI()

const todayEvents = ref([])
const loading = ref(false)
const error = ref(null)

const transformEvent = (event) => {
    const startDate = new Date(event.start_datetime)
    const endDate = new Date(event.end_datetime)
    const now = new Date()

    return {
        id: event.id,
        title: event.title,
        time: event.is_all_day
            ? t('All Day')
            : `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        location: event.location || '',
        date: event.start_datetime,
        color: event.color,
        isHappening: now >= startDate && now <= endDate
    }
}

const fetchTodayEvents = async () => {
    loading.value = true
    error.value = null
    try {
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

        const response = await api.$get('system/schedule-events/', {
            start_datetime__lte: endOfDay,
            end_datetime__gte: startOfDay,
            ordering: 'start_datetime'
        })

        todayEvents.value = response.results.map(transformEvent)
    } catch (err) {
        console.error('Failed to fetch today\'s events:', err)
        error.value = err
        todayEvents.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchTodayEvents()
})
</script>
