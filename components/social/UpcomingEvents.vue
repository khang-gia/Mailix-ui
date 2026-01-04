<template>
    <div>
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{{ t('Upcoming Events') }}</h3>

        <!-- Loading state -->
        <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="flex gap-3">
                    <div class="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Events list -->
        <div v-else class="space-y-3">
            <div v-for="event in upcomingEvents" :key="event.id"
                class="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors">
                <div class="flex gap-3">
                    <!-- Date badge -->
                    <div
                        class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg flex flex-col items-center justify-center border border-orange-200 dark:border-orange-800">
                        <span class="text-xs font-bold text-orange-600 dark:text-orange-400">{{ event.month }}</span>
                        <span class="text-lg font-bold text-orange-700 dark:text-orange-300">{{ event.day }}</span>
                    </div>

                    <!-- Event details -->
                    <div class="flex-1 min-w-0">
                        <h4
                            class="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {{ event.title }}
                        </h4>
                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                            <span>{{ event.time }}</span>
                        </div>
                        <div v-if="event.location"
                            class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
                            <span>{{ event.location }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && upcomingEvents.length === 0" class="text-center py-6">
            <UIcon name="i-heroicons-calendar-days" class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('No upcoming events') }}</p>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useAPI()

const upcomingEvents = ref([])
const loading = ref(false)
const error = ref(null)

const transformEvent = (event) => {
    const startDate = new Date(event.start_datetime)
    const endDate = new Date(event.end_datetime)

    return {
        id: event.id,
        title: event.title,
        day: startDate.getDate().toString().padStart(2, '0'),
        month: startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        time: event.is_all_day
            ? t('All Day')
            : `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        location: event.location || '',
        date: event.start_datetime,
        color: event.color
    }
}

const fetchUpcomingEvents = async () => {
    loading.value = true
    error.value = null
    try {
        const now = new Date().toISOString()
        const response = await api.$get('system/schedule-events/', {
            start_datetime__gte: now,
            ordering: 'start_datetime',
            page_size: 5
        })

        upcomingEvents.value = response.results.map(transformEvent)
    } catch (err) {
        console.error('Failed to fetch upcoming events:', err)
        error.value = err
        upcomingEvents.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchUpcomingEvents()
})
</script>
