<template>
    <BaseModal size="md" :modalOpen="calendarCreateModal" :closeOnClick="false" :closeOnEsc="true" @close-modal="onCloseModal">
        <UForm v-if="calendarCreateInfo" :schema="schema" :state="calendarCreateInfo" class="mx-4 py-2 space-y-4">
            <UFormGroup
                v-slot="{ error }"
                name="title"
                :error="errors.title"
                required>
                <UInput
                    variant="none"
                    size="xl"
                    autofocus
                    v-model="calendarCreateInfo.title"
                    :placeholder="$t('Add calendar title')"
                    :ui="{ base: 'w-full forcus:ring-0 focus:border-b-2 border-b', rounded:'rounded-none', variant:{ none: 'forcus:ring-0'}}"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            
            <div class="space-y-6">
                <UButton v-if="!expandDateConfig" variant="soft" color="gray" size="lg" @click="expandDateConfig = true">
                    <!-- {{ calendarCreateInfo.start_datetime  +' - '+ calendarCreateInfo.end_datetime }} -->
                      {{ calendarCreateInfo.startStr +' - '+ calendarCreateInfo.endStr }}
                </UButton>
                <div v-else class="space-y-2">
                    <div class="flex space-x-2">
                        <BaseDatePicker
                            v-model="calendarCreateInfo.start_datetime"
                            ref="startdatepicker"
                            :required="true"
                            class="w-full"
                            :mode="dateMode"
                            buttonType="outline"
                        />
                        <!-- <Timepicker v-if="!calendarCreateInfo.is_all_day" v-model="calendarCreateInfo.start_time"/> -->
                        <span class="py-2 px-2">
                            <UIcon name="fluent:subtract-24-filled"/>
                        </span>
                        <!-- <Timepicker v-if="!calendarCreateInfo.is_all_day" v-model="calendarCreateInfo.end_time"/> -->
                        <BaseDatePicker
                            v-model="calendarCreateInfo.end_datetime"
                            ref="enddatepicker"
                            :required="true"
                            class="w-full"
                            :mode="dateMode"
                            buttonType="outline"
                        />
                    </div>
                    <div class="space-x-4 flex items-center">
                        <UToggle v-model="calendarCreateInfo.is_all_day" color="blue"/>
                        <span>{{ $t('All day') }}</span>
                    </div>
                </div>
                <CustomerUserSelect v-if="calendarCreateInfo.participants" v-model="calendarCreateInfo.participants" :placeholder="$t('Participants')" :multiple="true"/>
                <UDivider/>
                <div class="grid grid-cols-2 space-x-4 "> 
                        <USelectMenu
                            class="w-full"
                            v-model="calendarCreateInfo.notification_type"
                            :options="notification_types"
                            valueAttribute="value"
                            option-attribute="label"
                            :is-dark="colorMode.value === 'dark'">
                        </USelectMenu>
                        <div v-if=" calendarCreateInfo.notification_type !==9" class="flex space-x-2">
                            <UInput
                                class="w-full"
                                v-model="calendarCreateInfo.reminder_time_value"
                                type="number"
                                min="5"
                                :disabled="calendarCreateInfo.notification_type === 9"
                                :ui="{ base: 'rounded-lg' }"/>
                            <USelectMenu
                                class="w-full"
                                v-model="calendarCreateInfo.reminder_time_unit"
                                :options="reminder_time_units"
                                valueAttribute="value"
                                option-attribute="label"
                                :disabled="calendarCreateInfo.notification_type === 9"
                                :is-dark="colorMode.value === 'dark'">
                            </USelectMenu>
                        </div>
                        
                    </div>
                    <UFormGroup
                        v-if="calendarCreateInfo.notification_type === 1"
                        >
                        <UInput
                            class="w-full"
                            v-model="calendarCreateInfo.reminder_email"
                            :placeholder="userInfo?.email || ''"
                            type="text"
                            :disabled="calendarCreateInfo.notification_type === 9"
                            :ui="{ base: 'rounded-lg' }"/>
                    </UFormGroup>
                    <UFormGroup
                        v-if="calendarCreateInfo.notification_type === 1"
                        
                        name="is_create_schedule">
                        <div class="space-x-4 flex items-center">
                            <UToggle v-model="calendarCreateInfo.is_send_participants" 
                                :disabled="calendarCreateInfo.notification_type === 9"
                            />
                            <span class="text-sm italic text-gray-500 dark:text-gray-400">
                                {{ $t('Also send to all participants ?') }}
                            </span>
                        </div>
                    </UFormGroup>
                    <UDivider/>

                    <div class="grid grid-cols-2 space-x-4">
                        <UFormGroup
                            :label="$t('Choose event color')">
                            <template #label>
                                <span class="mr-1">
                                    {{ $t('Tag') }}
                                </span>
                                <UTooltip :text="$t('Event tag tooltip')" :popper="{ placement: 'right' }" 
                                :ui="{
                                    base: 'text-xs font-normal overflow-x-visible',
                                }">
                                    <UIcon name="i-heroicons-exclamation-circle" class="text-yellow-500"/>
                                </UTooltip>
                                
                            </template>
                            <ColorPicker class="h-full" v-model="calendarCreateInfo.color"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Priority')">
                            <PrioritySelect v-model="calendarCreateInfo.priority" :placeholder="$t('Priority')"/>
                        </UFormGroup>
                    </div>
                <client-only>
                    <RickTextEditor v-model="calendarCreateInfo.description" />
                </client-only>
            </div>
        </UForm>
        <div class="flex justify-between gap-2 p-4">
            <div>
                <UButton v-if="calendarCreateType === 'updateEvent'" color="red" variant="outline" @click="onDelete">{{ $t('Delete') }}</UButton>

            </div>
            <div class="flex space-x-2">
                <UButton color="gray" variant="outline" @click="setCalendarCreateModal(false, '', {})">{{ $t('Cancel') }}</UButton>
                <UButton color="primary" @click="onSubmit">{{ $t('Save') }}</UButton>
            </div>

        </div>
    </BaseModal>
    
</template>

<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const colorMode = useColorMode()
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const modalStore = useModalStore()
const { calendarCreateModal, calendarCreateType, calendarCreateInfo } = storeToRefs(modalStore)
const { setCalendarCreateModal } = modalStore
const busy= ref(false)
const props = defineProps(['id'])
const emit = defineEmits(['close-modal', 'change-mode'])
const {  data: userInfo } = useAuth()
const dayjs = useDayjs()

const viewAllow = ref({
    createEvent:['title',],
    // department:['name','code','description','parent','department_type', 'company', 'business_unit'],
})
const checkView = (key) => {
    return viewAllow.value[calendarCreateType.value]?.includes(key);

}
const expandDateConfig = ref(false)
const dateMode = computed(() => {
    return calendarCreateInfo.value.is_all_day ? 'date' : 'datetime'
})
const onCloseModal = () => {
    expandDateConfig.value = false
    setCalendarCreateModal(false, '', {})

}
const errors = ref({})
const schema = yup.object({
    // title: checkView('title') ? yup.string().required(t('This field is required')) : yup.mixed().notRequired(),
})
const localTz = 'Asia/Ho_Chi_Minh';
const updateEvent = async () => {
    console.log('update event Data', calendarCreateInfo.value)
    try {
        const {data: response} = await useAPI().put(`system/schedule-events/${calendarCreateInfo.value.id}/`, {
            ...calendarCreateInfo.value,
            start_datetime: calendarCreateInfo.value.is_all_day 
                ? dayjs(calendarCreateInfo.value.start_datetime).startOf('day').tz(localTz).format() 
                : dayjs(calendarCreateInfo.value.start_datetime).tz(localTz).format(),
            end_datetime: calendarCreateInfo.value.is_all_day 
                ? dayjs(calendarCreateInfo.value.end_datetime).endOf('day').tz(localTz).format() 
                : dayjs(calendarCreateInfo.value.end_datetime).tz(localTz).format(),
            participants: calendarCreateInfo.value.participants.map(p => p.id),
            user: calendarCreateInfo.value.user.id,
        });
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
const createEvent = async () => {
    const data = {
        ...calendarCreateInfo.value,
        start_datetime: calendarCreateInfo.value.is_all_day 
            ? dayjs(calendarCreateInfo.value.start_datetime).startOf('day').tz(localTz).format() 
            : dayjs(calendarCreateInfo.value.start_datetime).tz(localTz).format(),
        end_datetime: calendarCreateInfo.value.is_all_day 
            ? dayjs(calendarCreateInfo.value.end_datetime).endOf('day').tz(localTz).format() 
            : dayjs(calendarCreateInfo.value.end_datetime).tz(localTz).format(),
        // start_datetime: dayjs(calendarCreateInfo.value.start_datetime).tz(localTz).format(),
        // end_datetime: dayjs(calendarCreateInfo.value.end_datetime).tz(localTz).format(),
        participants: calendarCreateInfo.value.participants.map(p => p.id),
        user: userInfo.value.id,
    }
    console.log('create event Data', data)
    try {
        const {data: response} = await useAPI().post(`system/schedule-events/`, data);
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
// const validateForm = async () => {
//     try {
//         await schema.validate(calendarCreateInfo.value, { abortEarly: false });
//         errors.value = {};
//         return true;
//     } catch (err) {
//         if (err instanceof yup.ValidationError) {
//             errors.value = {};
//             err.inner.forEach(error => {
//                 errors.value[error.path] = error.message;
//             });
//         } else {
//             console.error(err);
//         }
//         return false;
//     }
// }
const priorities = [
    {label: t('Low'), value: 1},
    {label: t('Medium'), value: 2},
    {label: t('High'), value: 3},
    {label: t('Urgent'), value: 4},
    {label: t('Critical'), value: 5},
    {label: t('None'), value: 6},
]
const notification_types = [
    {label: t('Email'), value: 1},
    {label: t('Push notification'), value: 3},
    {label: t('No notification'), value: 9},
]
const reminder_time_units = [
    {label: t('Minutes'), value: 'minutes'},
    {label: t('Hours'), value:'hours'},
    {label: t('Days'), value: 'days'},
    {label: t('Weeks'), value: 'weeks'},

]

const onSubmit = async () => {
    // const isValid = await validateForm(); 
    // console.log('isValid', isValid);
    // if (!isValid) return;
    try {
        busy.value = true;
        let isSuccess = false;

        if (calendarCreateType.value === 'createEvent') {
            isSuccess = await createEvent();
            if (isSuccess) {
                useToast().add({
                    title: t('Success'),
                    description: t('The event was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                setCalendarCreateModal(false, 'created', {});
            }
        } else if (calendarCreateType.value === 'updateEvent') {
            isSuccess = await updateEvent();
            if (isSuccess) {
                useToast().add({
                    title: t('Success'),
                    description: t('The event was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                setCalendarCreateModal(false, 'updated', {});
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while saving the event. Please try again later.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        });
    } finally {
        busy.value = false;
    }
};
const deleteEvent = async () => {
    try {
        const {data: response} = await useAPI().del(`system/schedule-events/${calendarCreateInfo.value.id}/`);
        return true;
        // if (response.status === 204) {
        //     return true;
        // } else {
        //     throw new Error(t('Unexpected response status'));
        // }
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}
const onDelete = async () => {
    try {
        busy.value = true;
        const isSuccess = await deleteEvent();
        if (isSuccess) {
            useToast().add({
                title: t('Success'),
                description: t('The event was successfully deleted.'),
                icon: 'i-heroicons-check-circle',
                color: 'green',     
                duration: 5000,
                position: 'top-right',
            });
            setCalendarCreateModal(false, 'removed', {});
        }   
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while deleting the event. Please try again later.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        });
    } finally {
        busy.value = false;
    }
}
</script>
