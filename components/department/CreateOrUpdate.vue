<template>
    <UCard :ui="{
        base: viewMode === 'basic' ? 'lg:w-4/5 w-full h-full mx-4 my-6' : 'lg:w-full w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <UBreadcrumb
                    :ui="{ ol: 'gap-x-3', li: 'gap-x-3',active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Department List'), to: '/departments' }, { label: props.isUpdate ? departmentInfo.name : $t('Create department') }]">
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
                {{ $t('Department Information') }}
            </h2>
            <UForm :schema="schema" :state="departmentInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup
                    v-slot="{error}"
                    :label="$t('Department name')" 
                    name="name"
                    :error="errors.name"

                    required>
                    <UInput
                        v-model="departmentInfo.name"
                        :placeholder="$t('Department name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Department code')"
                    name="code"
                    :error="errors.code"
                    required>
                    <UInput
                        v-model="departmentInfo.code"
                        :disabled="props.isUpdate"
                        :placeholder="$t('Department code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Location')">
                    <UInput
                        v-model="departmentInfo.location"
                        icon="i-heroicons-map"
                        :placeholder="$t('Location')"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>

                <UFormGroup
                    :label="$t('Belonging to') +' ('+ $t('Department parent')+ ')'">
                    <CoreDeparmentSelectCreate v-model="departmentInfo.parent" :placeholder="$t('Belonging to')"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Department type')">
                    <USelectMenu
                        class="w-full"
                        v-model="departmentInfo.department_type"
                        :options="department_types"
                        :placeholder="$t('Department type')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />

                </UFormGroup>
                <UFormGroup
                    :label="$t('Business unit')">
                    <SystemBUSelectCreate v-model="departmentInfo.business_unit" :placeholder="$t('Business unit')"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Description')">
                    <client-only>
                        <RickTextEditor v-model="departmentInfo.description" />
                    </client-only>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Resources')"
                    name="resources"
                    :error="errors.resources">
                    <SystemResourceSelectMulti v-model="departmentInfo.resources" :placeholder="$t('Resources')" :multiple="true"/>
                </UFormGroup>
               
                
            </UForm>
        </UCard>
        <template #footer>
            <div class="flex justify-end items-center space-x-2">
                <UButton color="white" variant="solid" icon="i-heroicons-x-mark" :label="$t('Cancel')" size="sm" @click="useRouter().back()"/>
                <UButton color="primary" variant="solid" icon="i-heroicons-check-circle" :label="$t('Save')" size="sm" @click="onSubmit"/>
            </div>
        </template>
    </UCard>
</template>
<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const busy = ref(false)
const colorMode = useColorMode()
const dayjs = useDayjs()
const { data: userInfo } = useAuth()
const errors = ref({})
const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    code: yup.string()
        .required(t('This field is required'))
        .test('check-department-code-exists', t('Department code already exists'), async (value) => {
            if (!value || props.isUpdate) return true;
            try {
                const { data: exists } = await useAPI().get('system/departments/', { code: value });
                console.log('data', exists.value.results);
                return exists.value.results.length == 0;
            } catch (error) {
                console.error('Error checking department code:', error);
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
const defaultUserInfo = {
    name: '',
    code: '',
    location:'',
    description:'',
    parent:null,
    business_unit: '',
    department_type: 2,
    resources: [],
}
const departmentInfo = ref(defaultUserInfo)

const loadData = async () => {
    try {
        if (props.isUpdate){
            const {data: response} = await useAPI().get(`system/departments/${useRoute().params.id}/`);
            departmentInfo.value = response.value
            departmentInfo.value.dob = departmentInfo.value.dob ? new Date(departmentInfo.value.dob) : null
            console.log('response', departmentInfo.value)
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
loadData()
const department_types = [
    {label: t('Company branch'), value: 1},
    {label: t('Department'), value: 2},
]
const formatData2 = () => {
    const formattedData = {};
    Object.entries(departmentInfo.value).forEach(([key, value]) => {
        if (!value) return;
        if (Array.isArray(value)) {
            formattedData[key] = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return item.id || item;
                }
                return item;
            });
        } else if (typeof value === 'object' && value !== null && value.id) {
            formattedData[key] = value.id !== -1 ? value.id : null;
        } else if (['dob'].includes(key)) {
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

const createDepartment = async () => {
    const profileData = formatData2()
    try {
        const {data: response} = await useAPI().post(`system/departments/`, profileData);
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}
const updateDepartment = async () => {
    const profileData = formatData2()
    try {
        const {data: response} = await useAPI().put(`system/departments/${useRoute().params.id}/`, profileData);
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}

const validateSchema = async () => {
    try {
        await schema.validate(departmentInfo.value, { abortEarly: false });
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
            const isUpdated = await updateDepartment();
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The department was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'departments' });
            }
        } else {
            const isCreated = await createDepartment();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The department was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'departments' });
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while processing the department. Please try again later.'),
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