<template>
    <USlideover v-model="isOpen" :ui="{ width: 'w-full max-w-4xl' }">
        <UCard class="flex flex-col flex-1 font-averta h-full"
            :ui="{ body: { base: 'flex-1 overflow-y-auto p-0' }, ring: '', divide: '' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                            <span class="text-primary-500">{{ workDetail?.name || $t('Work Details') }}</span>
                        </h3>
                    </div>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <div v-if="workDetail" class="p-6 space-y-6">
                <!-- General Information Card -->
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {{ $t('General Information') }}
                            </h2>
                            <UButton color="primary" size="xs" :to="`/works/${workDetail.id}`"
                                icon="i-heroicons-arrow-top-right-on-square">
                                {{ $t('View Full Details') }}
                            </UButton>
                        </div>
                    </template>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                        <WorkDetailItem label="Work Name" :value="workDetail.name" class="md:col-span-1" />
                        <WorkDetailItem label="Work Code" :value="workDetail.code" class="md:col-span-1" />

                        <WorkDetailItem label="Progress" :value="workDetail.progress">
                            <template #value>
                                <UProgress :value="workDetail.progress" indicator class="w-32" />
                            </template>
                        </WorkDetailItem>

                        <WorkDetailItem label="Start date"
                            :value="workDetail.start_date ? dayjs(workDetail.start_date).format('YYYY-MM-DD HH:mm') : ''" />
                        <WorkDetailItem label="End date"
                            :value="workDetail.end_date ? dayjs(workDetail.end_date).format('YYYY-MM-DD HH:mm') : ''" />
                        <WorkDetailItem label="Actual start date"
                            :value="workDetail.actual_start_date ? dayjs(workDetail.actual_start_date).format('YYYY-MM-DD') : ''" />

                        <WorkDetailItem v-if="workDetail.status" label="Status"
                            :value="workDetail.status_display" class="md:col-span-1">
                            <template #value>
                                <UBadge :color="statusMapping[workDetail.status]" variant="subtle"
                                    class="font-semibold">
                                    {{ workDetail.status_display }}
                                </UBadge>
                            </template>
                        </WorkDetailItem>

                        <WorkDetailItem v-if="workDetail.priority" label="Priority" :value="workDetail.priority"
                            class="md:col-span-1">
                            <template #value>
                                <UBadge :color="statusMapping[workDetail.priority]" variant="subtle"
                                    class="font-semibold">
                                    {{ $t(workDetail.priority_display) }}
                                </UBadge>
                            </template>
                        </WorkDetailItem>

                        <WorkDetailItem label="Assigned to" :value="workDetail.assigned_to_list" />
                        <WorkDetailItem label="Assigned by" :value="workDetail.assigned_by_list" />
                        <WorkDetailItem label="Work manage by" :value="workDetail.managers_list" />
                    </div>

                    <UDivider class="my-6" />

                    <h2 class="text-xl font-semibold border-b pb-3 mb-4 text-gray-800 dark:text-gray-100">
                        {{ $t('Description') }}
                    </h2>
                    <div
                        class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        <span v-if="workDetail.description" v-html="workDetail.description"></span>
                        <span v-else>{{ $t('No description for this work...') }}</span>
                    </div>
                </UCard>

                <!-- Tabs for Discussions and Activity Log -->
                <UCard :ui="{ footer: { base: 'border-none', padding: 'px-4 py-4 sm:px-6' } }">
                    <UTabs :items="tabs" class="w-full">
                        <template #item="{ item }">
                            <div class="mt-4">
                                <div v-if="item.key === 'discussions'" class="h-full overflow-x-hidden">
                                    <CommentsSection comment-type="works" :id="workDetail.id"/>
                                </div>
                                <div v-else-if="item.key === 'activity_log'"
                                    class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                    <div v-for="history in workHistory" :key="history.id"
                                        class="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                                        <ActivityLogItem :history="history" history-type="work" />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UTabs>
                </UCard>
            </div>
        </UCard>
    </USlideover>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs();

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    workId: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const statusMapping = [
    "none",
    "gray",
    "blue",
    "green",
    "amber",
    "slate",
    "indigo",
    "cyan",
    "emerald",
    "red",
    "yellow",
    "rose",
    "lime",
    "gray",
    "red",
    "purple"
]

const tabs = [{
    label: t('Discussion'),
    key: 'discussions',
}, {
    label: t('Activity Log'),
    key: 'activity_log',
}]

const workDetail = ref(null)
const workHistory = ref([])
const loading = ref(false)

// Watch for workId changes and fetch details
watch(() => props.workId, async (newWorkId) => {
    if (newWorkId && isOpen.value) {
        await fetchWorkDetail(newWorkId)
        await fetchHistory(newWorkId)
    }
}, { immediate: true })

// Also fetch when modal opens
watch(isOpen, async (newValue) => {
    if (newValue && props.workId) {
        await fetchWorkDetail(props.workId)
        await fetchHistory(props.workId)
    }
})

const fetchWorkDetail = async (workId) => {
    try {
        loading.value = true
        const { data } = await useAPI().get(`core/works/${workId}/`)
        if (data.value) {
            workDetail.value = data.value
        }
    } catch (error) {
        console.error('Failed to fetch work details:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to load work details'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
        })
    } finally {
        loading.value = false
    }
}

const fetchHistory = async (workId) => {
    try {
        const { data: response } = await useAPI().get(`core/works/${workId}/history/`)
        workHistory.value = response.value
    } catch (error) {
        console.error('Error loading history data:', error)
    }
}
</script>
