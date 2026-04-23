<template>
    <UCard :ui="{
        base: viewMode === 'basic' ? 'lg:w-4/5 w-full h-full mx-4 my-6' : 'lg:w-full w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <!-- <UBreadcrumb
                    :ui="{ ol: 'gap-x-3', li: 'gap-x-3',active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Work List'), to: '/works' }, { label: props.isUpdate ? workInfo.name : $t('Create work') }]">
                </UBreadcrumb> -->
                <UBreadcrumb
                    :ui="{ ol: 'gap-x-3', li: 'gap-x-3',active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Work List'), to: '/works' }, { label: props.isUpdate ? workInfo.name: $t('Create work'), to: props.isUpdate ? `/works/${useRoute().params.id}` : ''}, { label: props.isUpdate ? $t('Update') : '' }]">
                </UBreadcrumb>
                <div class="flex items-center space-x-2">
                    <UButton
                        v-if="props.isUpdate"
                        color="primary"
                        variant="solid"
                        icon="i-heroicons-calendar-date-range"
                        :label="$t('Create schedule')"
                        size="sm"
                        @click="onCreateSchedule"/>
                    <UDropdown :items="props.isUpdate ? updateItemDropdown: createItemDropdown" :popper="{ placement: 'bottom-start' }">
                        <UButton color="gray" variant="soft" icon="i-heroicons-ellipsis-vertical" />
                        <template #tip="{ item }">
                            <div class="text-left cursor-text">
                                <p>
                                {{$t('Choose view mode')}}
                                </p>
                            </div>
                        </template>
                        <template #item="{ item }">
                            <span class="truncate">{{ item.label }}</span>

                            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                        </template>
                    </UDropdown>
                </div>
            </div>
        </template>
    
        <UCard :ui="{
            base: 'my-6',
            rounded: 'rounded-sm',
    }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Work Information') }}
            </h2>
            <UForm :schema="schema" :state="workInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup
                    v-slot="{error}"
                    :label="$t('Work Name')" 
                    name="name"
                    :error="errors.name"

                    required>
                    <UInput
                        v-model="workInfo.name"
                        :placeholder="$t('Work Name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Work Code')"
                    name="code"
                    :error="errors.code">
                    <UInput
                        v-model="workInfo.code"
                        :placeholder="$t('Work Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                
                <UFormGroup :label="$t('Assignees')">
                    <div class="flex items-center gap-2 flex-wrap">
                        <UButton icon="i-heroicons-plus" size="sm" color="gray" variant="soft" @click="isAssignModalOpen = true" :label="workInfo.assigned_groups.length + workInfo.assigned_to.length === 0 ? $t('Manage Assignees') : $t('Edit')"/>
                        <template v-for="(item, index) in visibleAssignees" :key="'assignee-'+index">
                            <div v-if="item.type === 'group'" class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 flex items-center ring-1 ring-gray-200 dark:ring-gray-700">
                                <UIcon name="i-heroicons-user-group" class="mr-1 h-4 w-4" />
                                <span class="text-sm font-medium">{{ item.data.name || $t('Group') }}</span>
                            </div>
                            <div v-else class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 flex items-center">
                                <UIcon name="i-heroicons-user" class="mr-1 h-4 w-4" />
                                <span class="text-sm font-medium">{{ item.data.full_name || item.data.username || item.data.name || $t('User') }}</span>
                            </div>
                        </template>
                        <div v-if="leftoverAssigneesCount > 0" class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full h-7 px-2 flex items-center justify-center text-xs font-bold ring-1 ring-gray-200 dark:ring-gray-700">
                            +{{ leftoverAssigneesCount }}
                        </div>
                    </div>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work assigned by')"
                    name="assigned_by">
                    <CustomerUserSelect v-model="workInfo.assigned_by" :placeholder="$t('Work assigned by')" :multiple="true"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work manage by')"
                    name="managers">
                    <CustomerUserSelect v-model="workInfo.managers" :placeholder="$t('Work manage by')" :multiple="true"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Start date')"
                    name='start_date'>
                    <BaseDatePicker
                        v-model="workInfo.start_date"
                        ref="startdatepicker"
                        :required="true"
                        class="w-full"
                        buttonType="outline"
                        :place-holder="$t('Start date')"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('End date')"
                    name='end_date'>
                    <BaseDatePicker
                        v-model="workInfo.end_date"
                        ref="enddatepicker"
                        :required="true"
                        class="w-full"
                        buttonType="outline"
                        :place-holder="$t('End date')"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Actual start date')"
                    name='actual_start_date'>
                    <BaseDatePicker
                        v-model="workInfo.actual_start_date"
                        ref="startdatepicker"
                        :required="true"
                        class="w-full"
                        buttonType="outline"
                        :place-holder="$t('Actual start date')"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Priority')"
                    name="priority">
                    <PrioritySelect
                        v-model="workInfo.priority"
                        :placeholder="$t('Priority')"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Related Work') + ' (' + $t('Parent work') + ')'"
                    name="Related Work">
                    <WorkRelatedSelect v-model="workInfo.related_work" :placeholder="$t('Related Work')" :exclude-id="useRoute().params.id" :parent-only="true"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Description')">
                    <client-only>
                        <RickTextEditor v-model="workInfo.description" :placeholder="$t('Add work description...')"/>
                    </client-only>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Brief')">
                    <client-only>
                        <RickTextEditor v-model="workInfo.brief" :placeholder="$t('Add work brief...')"/>
                    </client-only>
                </UFormGroup>
                <UFormGroup
                    v-if="!props.isUpdate"
                    :label="$t('Create schedule')"
                    name="is_create_schedule">
                    <div class="space-x-4 flex items-center">
                        <UToggle v-model="workInfo.is_create_schedule"/>
                        <span class="text-sm italic text-gray-500 dark:text-gray-400">
                            {{ $t('Turn on this option if you want to create a schedule for this work') }}
                        </span>
                    </div>
                </UFormGroup>
                
                <!--<UFormGroup
                    :label="$t('Customer Group')"
                    name="customer_group">
                    <USelectMenu
                        class="w-full"
                        v-model="workInfo.customer_group"
                        :options="customer_groups"
                        :placeholder="$t('Customer Group')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Customer Source')"
                    name="customer_source">
                    <USelectMenu
                        class="w-full"
                        v-model="workInfo.customer_source"
                        :options="customer_sources"
                        :placeholder="$t('Customer Source')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup> -->
            </UForm>
        </UCard>
        <UCard v-if="workInfo.is_create_schedule" :ui="{
            base: 'my-6',
            rounded: 'rounded-sm',
        }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Schedule Information') }}
            </h2>
            <UForm :schema="schema" :state="workInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup
                    :label="$t('Schedule title')" >
                    <UInput
                        v-model="workInfo.schedule.title"
                        :placeholder="$t('Schedule title')"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Participants')">
                    <CustomerUserSelect v-model="workInfo.schedule.participants" :placeholder="$t('Participants')" :multiple="true"/>
                </UFormGroup>
                <div class="grid grid-rows-2 items-start">
                    <div class="grid grid-cols-2 space-x-4">
                        <UFormGroup
                            :label="$t('Start date')">
                            <BaseDatePicker
                                v-model="workInfo.schedule.start_datetime"
                                rref="startdatepicker"
                                :required="true"
                                class="w-full"
                                :mode="dateMode"
                                buttonType="outline"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('End date')"
                            name='schedule.end_datetime'>
                            <BaseDatePicker
                                v-model="workInfo.schedule.end_datetime"
                                ref="enddatepicker"
                                :required="true"
                                class="w-full"
                                :mode="dateMode"
                                buttonType="outline"
                            />
                        </UFormGroup>
                    </div>
                    <div class="space-x-4 flex items-center pt-4">
                        <UToggle v-model="workInfo.schedule.is_all_day" color="blue"/>
                        <span>{{ $t('All day') }}</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-gray-700 pb-1">
                        {{ $t('Notification') }}
                    </label>
                    <div class="grid grid-cols-2 space-x-4 "> 
                        <USelectMenu
                            class="w-full"
                            v-model="workInfo.schedule.notification_type"
                            :options="notification_types"
                            valueAttribute="value"
                            option-attribute="label"
                            :is-dark="colorMode.value === 'dark'">
                        </USelectMenu>
                        <div v-if=" workInfo.schedule.notification_type !==9" class="flex space-x-2">
                            <UInput
                                class="w-full"
                                v-model="workInfo.schedule.reminder_time_value"
                                type="number"
                                min="5"
                                :disabled="workInfo.schedule.notification_type === 9"
                                :ui="{ base: 'rounded-lg' }"/>
                            <USelectMenu
                                class="w-full"
                                v-model="workInfo.schedule.reminder_time_unit"
                                :options="reminder_time_units"
                                valueAttribute="value"
                                option-attribute="label"
                                :disabled="workInfo.schedule.notification_type === 9"
                                :is-dark="colorMode.value === 'dark'">
                            </USelectMenu>
                        </div>
                        
                    </div>
                    
                </div>
                <UFormGroup
                    v-if="workInfo.schedule.notification_type === 1"
                    :label="$t('Event email')">
                    <UInput
                        class="w-full"
                        v-model="workInfo.schedule.reminder_email"
                        type="text"
                        :disabled="workInfo.schedule.notification_type === 9"
                        :ui="{ base: 'rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    v-if="workInfo.schedule.notification_type === 1"
                    :label="$t('Send to participants')"
                    name="is_create_schedule">
                    <div class="space-x-4 flex items-center">
                        <UToggle v-model="workInfo.schedule.is_send_participants" 
                            :disabled="workInfo.schedule.notification_type === 9"
                        />
                        <span class="text-sm italic text-gray-500 dark:text-gray-400">
                            {{ $t('Also send to all participants ?') }}
                        </span>
                    </div>
                </UFormGroup>
                <UDivider class="col-span-2 py-4" />
                <UFormGroup
                    :label="$t('Content')">
                    <client-only>
                        <RickTextEditor v-model="workInfo.schedule.description" :placeholder="$t('Add content...')"/>
                    </client-only>
                </UFormGroup>
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
                        <ColorPicker class="h-full" v-model="workInfo.schedule.color"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Priority')">
                        {{ workInfo.schedule.priority }}
                        <PrioritySelect v-model="workInfo.schedule.priority" :placeholder="$t('User')"/>
                    </UFormGroup>
                </div>
                
                
                
            </UForm>
        </UCard>
        <template #footer>
            <div class="flex justify-end items-center space-x-2">
                <UButton color="white" variant="solid" icon="i-heroicons-x-mark" :label="$t('Cancel')" size="sm" @click="useRouter().back()"/>
                <UButton color="primary" variant="solid" icon="i-heroicons-check-circle" :label="$t('Save')" size="sm" @click="onSubmit"/>
            </div>
        </template>
    </UCard>
    <!-- <UserProfileStepFooter @on-submit="onSubmit"/> -->
    <!-- Assignees Modal -->
    <WorkAssigneeModal 
        v-model="isAssignModalOpen" 
        v-model:assignedGroups="workInfo.assigned_groups" 
        v-model:assignedTo="workInfo.assigned_to" 
    />
</template>
<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const isAssignModalOpen = ref(false)

const maxVisibleAssignees = 3;
const visibleAssignees = computed(() => {
    const groups = (workInfo.value?.assigned_groups || []).map(g => ({ type: 'group', data: g }));
    const users = (workInfo.value?.assigned_to || []).map(u => ({ type: 'user', data: u }));
    const combined = [...groups, ...users];
    return combined.slice(0, maxVisibleAssignees);
});
const leftoverAssigneesCount = computed(() => {
    return ((workInfo.value?.assigned_groups || []).length + (workInfo.value?.assigned_to || []).length) - maxVisibleAssignees;
});

const busy = ref(false)
const colorMode = useColorMode()
const dayjs = useDayjs()
const errors = ref({})
const { data: userInfo } = useAuth()
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setCalendarCreateModal } = modalStore

const dateMode = computed(() => {
    return workInfo.value.schedule.is_all_day ? 'date' : 'datetime'
})
const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    code: yup.string()
    .nullable()
    .test('check-work-code-exists', t('Work code already exists'), async (value) => {
            if (props.isUpdate && value == workInfo.value.code) return true;
            if (!value) return true;
            try {
                const { data: exists } = await useAPI().get('core/works/', { code: value });
                console.log('data', exists.value.results);
                return exists.value.results.length == 0;
            } catch (error) {
                console.error('Error checking work code:', error);
                return false;
            }
        }),
})
const items = [
    {
        label: t('Customer Information'),
        slot: 'personal-info',
    },
    {
        label: t('Contact Information'),
        slot: 'contact-info',
    },
    {
        label: t('Company Information'),
        slot: 'contract-info',
    },
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
const props = defineProps({
    isUpdate: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Object,
        default: () => ({}),
    },
})
const viewMode = ref('basic')
const updateItemDropdown = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    [{
      label: t('Basic'),
      icon: 'bi:card-heading',
      click: () => {
        viewMode.value = 'basic'
      }
    },{
      label: t('Full'),
      icon: 'tdesign:frame-filled',
      click: () => {
        viewMode.value = 'full'
      }
    }]
])
const createItemDropdown = ref([
    [{
        slot: 'tip',
        disabled: true
    }],
    [{
      label: t('Basic'),
      icon: 'bi:card-heading',
      click: () => {
        viewMode.value = 'basic'
      }
    },{
      label: t('Standard'),
      icon: 'ant-design:fullscreen-outlined',
      click: () => {
        viewMode.value = 'standard'
      }
    }]
])
const defaultWorkInfo = {
    name: '',
    code: '',
    assigned_to: [],
    assigned_groups: [],
    assigned_by:[],
    status: 1,
    managers: [],
    start_date: '',
    end_date: '',
    actual_start_date: '',
    priority: 2,
    related_work:'',
    created_by: userInfo.value.id,
    description: '',
    brief: '',
    is_create_schedule: false,
    schedule: {
        title: '',
        start_datetime: new Date(),
        end_datetime: new Date(),
        is_all_day: false,
        participants: [],
        user: userInfo.value.id,
        description: '',
        color: '#039be5',
        priority: 2,
        has_reminder: false,
        notification_type: 3,
        reminder_time_value: 15,
        reminder_time_unit: 'minutes',
        reminder_email: userInfo.value.email,
        is_send_participants: false
    }
}  
const workInfo = ref(defaultWorkInfo)

const loadData = async () => {
    try {
        if (props.isUpdate){
            const {data: response} = await useAPI().get(`core/works/${useRoute().params.id}/`);
            workInfo.value = response.value
            workInfo.value.start_date = workInfo.value.start_date ? new Date(workInfo.value.start_date) : null
            workInfo.value.end_date = workInfo.value.end_date ? new Date(workInfo.value.end_date) : null
            workInfo.value.actual_start_date = workInfo.value.actual_start_date ? new Date(workInfo.value.actual_start_date) : null
            workInfo.value.related_work = workInfo.value.related_work || ''
            workInfo.value.assigned_groups = workInfo.value.assigned_groups || []
            console.log('response', workInfo.value)
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
loadData()
const type_of_customers = [
    {label: t('Personal'), value: 1},
    {label: t('Organization'), value: 2},
]
const localTz = 'Asia/Ho_Chi_Minh';

const formatData2 = () => {
    const formattedData = {};
    Object.entries(workInfo.value).forEach(([key, value]) => {
        if (!value) return;
        if (Array.isArray(value)) {
            formattedData[key] = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return item.id || item;
                }
                return item;
            });
        } else if (typeof value === 'object' && value !== null && value.id && key !== 'schedule') {
            formattedData[key] = value.id;
        } else if (['start_date','end_date','actual_start_date'].includes(key)) {
            formattedData[key] = dayjs(value).format('YYYY-MM-DD');
        }else if (['avatar'].includes(key)){
            if (value[0] instanceof File) {
                formattedData[key] = value[0];
            } else if (value.length == 0) {
                formattedData[key] = '';
            }
        } else if (key === 'schedule') {
            if ((!props.isUpdate && workInfo.value.is_create_schedule && value) || (props.isUpdate && value)) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    formattedData[key] = formattedData[key] || {};

                    if (subKey === 'start_datetime') {
                        formattedData[key][subKey] = dayjs(subValue).startOf('day').tz(localTz).format();
                    }
                    else if (subKey === 'end_datetime') {
                        formattedData[key][subKey] = dayjs(subValue).endOf('day').tz(localTz).format();
                    } else if (['participants'].includes(subKey)) {
                        formattedData[key][subKey] = (subValue || []).map(item => item.id || item);
                    } else if (subKey === 'has_reminder') {
                        let has_reminder = workInfo.value.schedule.notification_type !== 9 && workInfo.value.schedule.reminder_time_value > 0
                        formattedData[key][subKey] = has_reminder;
                    }
                    else {
                        formattedData[key][subKey] = subValue;
                    }
                });
            }
        }
         else {
            formattedData[key] = value;
        }
    });
    return formattedData;
};

const createWork = async () => {
    const profileData = formatData2()
    try {
        const {data: response} = await useAPI().post(`core/works/`, profileData);
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating work:', error);
        throw error;
    }
}
const updateWork = async () => {
    const profileData = formatData2()
    try {
        const {data: response} = await useAPI().put(`core/works/${useRoute().params.id}/`, profileData);
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error updating work:', error);
        throw error;
    }
}
const validateSchema = async () => {
    try {
        await schema.validate(workInfo.value, { abortEarly: false });
        errors.value = {};
        return true;
    } catch (validationError) {
        const validationErrors = {};
        validationError.inner.forEach((err) => {
            validationErrors[err.path] = err.message;
        });
        errors.value = validationErrors; 
        return false;
    }
};
const onSubmit = async () => {
    const isValid = await validateSchema(); 
    console.log('isValid',isValid)
    if (!isValid) return;
    try {
        busy.value = true;
        if (props.isUpdate) {
            const isUpdated = await updateWork();
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The work was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'works' });
            }
        } else {
            const isCreated = await createWork();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The work was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'works' });
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while processing the work. Please try again later.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        });
    } finally {
        busy.value = false;
    }
};
function formatDateInfo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday}, ${day} tháng ${month}`
}
const onCreateSchedule = () => {
    let startDate = new Date()
    let endDate = new Date()
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    let startStr = formatDateInfo(new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().split('T')[0]);
    let endStr = formatDateInfo(endDate.toISOString().split('T')[0]);
    setCalendarCreateModal(true, 'createEvent', { 
        title: workInfo.value.name,
        startStr: startStr,
        endStr: endStr,
        start_datetime: startDate,
        end_datetime: endDate,
        is_all_day: false,
    });
};
</script>