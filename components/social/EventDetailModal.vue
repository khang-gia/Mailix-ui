<template>
    <BaseModal size="md" :modalOpen="eventDetailModal" :closeOnClick="false" :overlay="false" :closeOnEsc="true" @close-modal="setEventDetailModal(false)">
        <UForm v-if="event" class="mx-4 py-2 space-y-4">
            <UFormGroup name="title">
                <UInput
                    variant="none"
                    size="xl"
                    :model-value="event.title"
                    :placeholder="$t('Add calendar title')"
                    disabled
                    :ui="{ base: 'w-full focus:ring-0 focus:border-b-2 border-b', rounded:'rounded-none', variant:{ none: 'focus:ring-0'}}" />
            </UFormGroup>

            <div class="space-y-6">
                <!-- Date display -->
                <UButton variant="soft" color="gray" size="lg" disabled>
                    {{ dateLabel }}
                </UButton>

                <!-- Participants -->
                <CustomerUserSelect
                    v-if="event.participants"
                    :model-value="event.participants"
                    :placeholder="$t('Participants')"
                    :multiple="true"
                    disabled />

                <UDivider />

                <!-- Notification type + reminder -->
                <div class="grid grid-cols-2 space-x-4">
                    <USelectMenu
                        class="w-full"
                        :model-value="event.notification_type"
                        :options="notification_types"
                        valueAttribute="value"
                        option-attribute="label"
                        disabled />
                    <div v-if="event.notification_type !== 9" class="flex space-x-2">
                        <UInput
                            class="w-full"
                            :model-value="event.reminder_time_value"
                            type="number"
                            disabled
                            :ui="{ base: 'rounded-lg' }" />
                        <USelectMenu
                            class="w-full"
                            :model-value="event.reminder_time_unit"
                            :options="reminder_time_units"
                            valueAttribute="value"
                            option-attribute="label"
                            disabled />
                    </div>
                </div>

                <UFormGroup v-if="event.notification_type === 1">
                    <UInput
                        class="w-full"
                        :model-value="event.reminder_email"
                        type="text"
                        disabled
                        :ui="{ base: 'rounded-lg' }" />
                </UFormGroup>

                <UFormGroup v-if="event.notification_type === 1">
                    <div class="space-x-4 flex items-center">
                        <UToggle :model-value="event.is_send_participants" color="blue" disabled />
                        <span class="text-sm italic text-gray-500 dark:text-gray-400">
                            {{ $t('Also send to all participants ?') }}
                        </span>
                    </div>
                </UFormGroup>

                <UDivider />

                <!-- Color + Priority -->
                <div class="grid grid-cols-2 space-x-4">
                    <UFormGroup :label="$t('Tag')">
                        <ColorPicker class="h-full" :model-value="event.color" disabled />
                    </UFormGroup>
                    <UFormGroup :label="$t('Priority')">
                        <PrioritySelect :model-value="event.priority" :placeholder="$t('Priority')" disabled />
                    </UFormGroup>
                </div>

                <!-- Description -->
                <UFormGroup :label="$t('Description')">
                    <UTextarea
                        class="w-full"
                        :model-value="event?.description"
                        autoresize
                        disabled
                        :rows="3"
                        :ui="{ base: 'disabled:opacity-100 disabled:cursor-auto' }"
                    />
                </UFormGroup>
            </div>
        </UForm>

        <!-- Footer — same as DateSelectModal -->
        <div v-if="event" class="flex justify-between gap-2 p-4 border-t dark:border-gray-800">
            <div>
                <UButton color="gray" variant="outline" icon="i-heroicons-calendar" @click="viewInCalendar">
                    {{ $t('View in Calendar') }}
                </UButton>
            </div>
            <div class="flex space-x-2">
                <UButton :disabled="!event?.work_detail" color="gray" variant="outline" icon="i-heroicons-briefcase" class="ml-2" @click="viewWorkRelate">
                    {{ $t('View work relate') }}
                </UButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const router = useRouter()
const dayjs = useDayjs()
const modalStore = useModalStore()
const { eventDetailModal, eventDetailData } = storeToRefs(modalStore)
const { setEventDetailModal, setCalendarCreateModal } = modalStore

const event = computed(() => eventDetailData.value?.raw ?? null)

const notification_types = [
    { label: t('Email'), value: 1 },
    { label: t('Push notification'), value: 3 },
    { label: t('No notification'), value: 9 },
]
const reminder_time_units = [
    { label: t('Minutes'), value: 'minutes' },
    { label: t('Hours'), value: 'hours' },
    { label: t('Days'), value: 'days' },
    { label: t('Weeks'), value: 'weeks' },
]

const dateLabel = computed(() => {
    if (!event.value) return ''
    if (event.value.is_all_day) {
        return `${dayjs(event.value.start_datetime).format('ddd, MMM D')} — ${t('All Day')}`
    }
    return `${dayjs(event.value.start_datetime).format('ddd MMM D, HH:mm')} - ${dayjs(event.value.end_datetime).format('ddd MMM D, HH:mm')}`
})

const viewInCalendar = () => {
    setEventDetailModal(false)
    router.push('/schedules')
}

const viewWorkRelate = () => {
    const workId = event.value?.work_detail?.id || event.value?.work
    if (!workId) return
    setEventDetailModal(false)
    router.push(`/works/${workId}`)
}

const editEvent = () => {
    if (!event.value) return
    setEventDetailModal(false)
    setCalendarCreateModal(true, 'updateEvent', {
        ...event.value,
        startStr: dayjs(event.value.start_datetime).format('ddd MMM D, HH:mm'),
        endStr: dayjs(event.value.end_datetime).format('ddd MMM D, HH:mm'),
    })
}
</script>
