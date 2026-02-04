<template>
    <UCard
        :ui="{ rounded: 'rounded-xl', divide: '', body: { padding: 'py-0' }, footer: { padding: 'px-0' }, header: { padding: 'pb-0' } }"
        class="w-full overflow-hidden" :style="matchHeight ? `height: ${matchHeight}px` : 'auto'">
        <template #header>
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-center space-x-2">
                    <span class="rounded-full w-10 h-10 justify-center flex items-center bg-red-100">
                        <UIcon name="fluent:important-12-filled" class="w-5 h-5 text-red-600 inline-block shrink-0" />
                    </span>
                    <h2 class="text-xl font-semibold text-red-500 dark:text-gray-100">
                        {{ $t('Prioritize') }}
                    </h2>
                </div>

                <!-- <UButton v-if="todayTasks.length !== 0" :ui="{ rounded: 'rounded-full' }" :to="'/works'" color="white" variant="soft" size="sm"
                    class="text-slate-700 ring-1 ring-slate-400" icon="i-heroicons-chevron-double-right" trailing>
                    {{ $t('See All') }}
                </UButton> -->
            </div>
        </template>
        <div class="space-y-4">
            <!-- Fixed Tabs -->
            <div class="flex items-start justify-start gap-2">
                <UButton :ui="{ rounded: 'rounded-full' }" :color="selectedTab === 'high_priority' ? 'red' : 'gray'"
                    variant="solid" size="md" @click="selectedTab = 'high_priority'" class="p-3">
                    {{ $t('High Priority') }}
                </UButton>
                <UButton :ui="{ rounded: 'rounded-full' }" :color="selectedTab === 'time_sensitive' ? 'black' : 'gray'"
                    variant="solid" size="md" @click="selectedTab = 'time_sensitive'" class="p-3">
                    {{ $t('Time-sensitive') }}
                </UButton>
            </div>

            <!-- Scrollable Task Lists -->
            <div class="overflow-y-auto" :style="matchHeight ? `max-height: calc(${matchHeight}px - 180px)` : 'auto'">
                <div v-if="selectedTab === 'high_priority'">
                    <div v-for="task in highPriorityTasks" :key="task.id"
                        class="px-4 py-2 rounded-lg cursor-pointer bg-red-50 mb-3">
                        <div class="cursor-pointer" @click="navigateTo(`/works/${task.id}`)">
                            <div class="bg-red-50 flex items-center justify-between">
                                <UAvatarGroup size="xs" :max="3" v-if="task.assigned_to && task.assigned_to.length"
                                    :ui="{ ring: '' }" class="pt-2">
                                    <div v-for="user in task.assigned_to" :key="user.id">
                                        <NuxtLink v-if="user.profile_hr"
                                            :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                                        </NuxtLink>
                                    </div>
                                </UAvatarGroup>
                                <UIcon name="fluent:alert-urgent-16-filled"
                                    class=" w-5 h-5 text-red-600 inline-block shrink-0" />

                            </div>
                            <!-- <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.code }}</p> -->
                            <!-- <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-black dark:text-gray-100">{{ task.name }}</h3>
                                <UIcon name="fluent:alert-urgent-16-filled" class="w-5 h-6 text-red-600 inline-block shrink-0" />
                            </div> -->
                            <h3 class="text-lg font-semibold text-black dark:text-gray-100">{{ task.name }}</h3>

                            <span class="w-full truncate" v-html="task.brief"></span>


                        </div>
                    </div>
                    <div v-if="highPriorityTasks.length === 0" class="p-4 flex items-center justify-center">
                        {{ $t('No tasks found') }}
                    </div>
                </div>
                <div v-if="selectedTab === 'time_sensitive'">
                    <div v-for="task in timeSensitiveTasks" :key="task.id"
                        class="px-4 py-2 rounded-lg cursor-pointer bg-slate-100 mb-3">
                        <div class="cursor-pointer" @click="navigateTo(`/works/${task.id}`)">
                            <div class="bg-slate-100 flex items-center justify-between">
                                <UAvatarGroup size="xs" :max="3" v-if="task.assigned_to && task.assigned_to.length"
                                    :ui="{ ring: '' }" class="pt-2">
                                    <div v-for="user in task.assigned_to" :key="user.id">
                                        <NuxtLink v-if="user.profile_hr"
                                            :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                                        </NuxtLink>
                                    </div>
                                </UAvatarGroup>
                                <UIcon name="ic:round-alarm" class=" w-5 h-5  inline-block shrink-0" />

                            </div>
                            <!-- <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.code }}</p> -->
                            <!-- <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-black dark:text-gray-100">{{ task.name }}</h3>
                                <UIcon name="fluent:alert-urgent-16-filled" class="w-5 h-6 text-red-600 inline-block shrink-0" />
                            </div> -->
                            <h3 class="text-lg font-semibold text-black dark:text-gray-100">{{ task.name }}</h3>

                            <span class="w-full truncate" v-html="task.brief"></span>


                        </div>
                    </div>
                    <div v-if="timeSensitiveTasks.length === 0" class="p-4 flex items-center justify-center">
                        {{ $t('No tasks found') }}
                    </div>
                </div>
            </div>
        </div>



    </UCard>

</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

const selectedTab = ref('high_priority')
const props = defineProps({
    allTasks: {
        type: Array,
        required: true,
        default: () => []
    },
    matchHeight: {
        type: Number,
        default: 0
    }
})

// Filter high priority tasks (priority 3, 4, 5 = high, urgent, critical)
const highPriorityTasks = computed(() => {
    if (!props.allTasks) return []
    return props.allTasks.filter(task => task.priority >= 3 && task.priority <= 5)
})

// Sort tasks by end_date descending (closest deadlines first)
const timeSensitiveTasks = computed(() => {
    if (!props.allTasks) return []
    return [...props.allTasks].sort((a, b) => {
        if (!a.end_date) return 1
        if (!b.end_date) return -1
        return new Date(a.end_date) - new Date(b.end_date)
    })
})

const tabs = [{
    label: t('High Priority'),
    key: 'high_priority',
}, {
    label: t('Time-sensitive'),
    key: 'time_sensitive',
}]
</script>

<style scoped>
/* Add any necessary styles here */
</style>