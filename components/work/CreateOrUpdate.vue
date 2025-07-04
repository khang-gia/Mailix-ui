<template>
    <UCard :ui="{
        base: viewMode === 'basic' ? 'lg:w-4/5 w-full h-full mx-4 my-6' : 'lg:w-full w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <UBreadcrumb
                    :ui="{ ol: 'gap-x-3', li: 'gap-x-3',active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Work List'), to: '/works' }, { label: props.isUpdate ? workInfo.name : $t('Create work') }]">
                    <!-- <template #divider>
                        <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    </template> -->
                </UBreadcrumb>
                <div class="flex items-center space-x-2">
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
                    :error="errors.code"
                    required>
                    <UInput
                        v-model="workInfo.code"
                        :disabled="props.isUpdate"
                        :placeholder="$t('Work Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Description')"
                    name="description">
                    <UTextarea
                        v-model="workInfo.description"
                        :placeholder="$t('Description')"
                        rows="1"
                        resize
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Work assigned to')"
                    name="assigned_to">
                    <CustomerUserSelect v-model="workInfo.assigned_to" :placeholder="$t('Work assigned to')" :multiple="true"/>
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
                    <USelectMenu
                        class="w-full"
                        v-model="workInfo.priority"
                        :options="priorities"
                        :placeholder="$t('Priority')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Related Work') + ' (' + $t('Parent work') + ')'"
                    name="Related Work">
                    <WorkRelatedSelect v-model="workInfo.related_work" :placeholder="$t('Related Work')"/>
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
        
        <template #footer>
            <div class="flex justify-end items-center space-x-2">
                <UButton color="white" variant="solid" icon="i-heroicons-x-mark" :label="$t('Cancel')" size="sm" @click="useRouter().back()"/>
                <UButton color="primary" variant="solid" icon="i-heroicons-check-circle" :label="$t('Save')" size="sm" @click="onSubmit"/>
            </div>
        </template>
    </UCard>
    <!-- <UserProfileStepFooter @on-submit="onSubmit"/> -->
</template>
<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const busy = ref(false)
const colorMode = useColorMode()
const dayjs = useDayjs()
const errors = ref({})
const { data: userInfo } = useAuth()

const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    code: yup.string()
        .required(t('This field is required'))
        .test('check-employee-code-exists', t('Employee code already exists'), async (value) => {
            if (!value || props.isUpdate) return true;
            try {
                const { data: exists } = await useAPI().get('core/works/', { code: value });
                console.log('data', exists.value.results);
                return exists.value.results.length == 0;
            } catch (error) {
                console.error('Error checking employee code:', error);
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
    assigned_by:[],
    status: 1,
    managers: [],
    start_date: '',
    end_date: '',
    actual_start_date: '',
    priority: 2,
    related_work:'',
    created_by: userInfo.value.id,
    description: ''
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
            workInfo.value.related_work = workInfo.value.related_work ? workInfo.value.related_work.id : '',
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
const priorities = [
    {label: t('Low'), value: 1},
    {label: t('Medium'), value: 2},
    {label: t('High'), value: 3},
    {label: t('Urgent'), value: 4},
    {label: t('Critical'), value: 5},
]
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
        } else if (typeof value === 'object' && value !== null && value.id) {
            formattedData[key] = value.id;
        } else if (['start_date','end_date','actual_start_date'].includes(key)) {
            formattedData[key] = dayjs(value).format('YYYY-MM-DD');
        }else if (['avatar'].includes(key)){
            if (value[0] instanceof File) {
                formattedData[key] = value[0];
            } else if (value.length == 0) {
                formattedData[key] = '';
            }
        } else {
            formattedData[key] = value;
        }
    });
    return formattedData;
};

const createCustomer = async () => {
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
const updateCustomer = async () => {
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
            const isUpdated = await updateCustomer();
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
            const isCreated = await createCustomer();
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
</script>