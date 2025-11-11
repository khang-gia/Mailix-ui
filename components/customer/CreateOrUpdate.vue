<template>
    <UCard :ui="{
        base: viewMode === 'basic' ? 'lg:w-4/5 w-full h-full mx-4 my-6' : 'lg:w-full w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <UBreadcrumb
                    :ui="{ ol: 'gap-x-3', li: 'gap-x-3',active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Customer List'), to: '/customers' }, { label: props.isUpdate ? cloneCustomerInfo.name: $t('Create customer'), to: props.isUpdate ? `/customers/${useRoute().params.id}` : ''}, { label: props.isUpdate ? $t('Update') : '' }]">
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
                {{ $t('Customer Information') }}
            </h2>
            <UCard class="m-4" :ui="{
                rounded: 'rounded-3xl',
                background: 'bg-blue-100',
                shadow: 'shadow-lg'
            }">
                <div class="flex flex-row items-end">
                    <UForm :schema="schema" :state="customerInfo" class="mx-4 py-2">
                        <UFormGroup
                            name="avatar"
                            >
                            <CoreImageUpload 
                                :multiple="false" 
                                fileTypes=".png, .jpeg, .jpg, image/* "
                                v-model="customerInfo.avatar"
                                height="185px"
                                width="185px"
                                :rounded="true"
                            />
                        </UFormGroup>
                        
                    </UForm>
                    <UForm :schema="schema" :state="customerInfo" class="py-8 space-y-6 w-1/2">
                        <UFormGroup
                            v-slot="{error}"
                            name="name"
                            :error="errors.name"
                            required>
                            <UInput
                                variant="none" 
                                size="2xl"
                                v-model="customerInfo.name"
                                :placeholder="$t('Full Name')"
                                :ui="{ base: 'w-full rounded-lg',
                                    placeholder: error ? 'placeholder-red-500' : 'placeholder-gray-400'
                                }"/>
                        </UFormGroup>
                        <UFormGroup
                            v-slot="{ error }"
                            name="customer_code"
                            :error="errors.customer_code"
                            required>
                            <UInput
                                variant="none" 
                                size="lg"
                                v-model="customerInfo.customer_code"
                                :disabled="props.isUpdate"
                                :placeholder="$t('Customer Code')"
                                :ui="{ 
                                    base: 'w-full rounded-lg',
                                    placeholder: error ? 'placeholder-red-500' : 'placeholder-gray-400'
                                    }"/>
                        </UFormGroup>
                    </UForm>
                </div>
                
            </UCard>
            <UForm :schema="schema" :state="customerInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <!-- <UFormGroup
                    v-slot="{error}"
                    :label="$t('Full Name')" 
                    name="name"
                    :error="errors.name"

                    required>
                    <UInput
                        v-model="customerInfo.name"
                        :placeholder="$t('Full Name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Customer Code')"
                    name="customer_code"
                    :error="errors.customer_code"
                    required>
                    <UInput
                        v-model="customerInfo.customer_code"
                        :disabled="props.isUpdate"
                        :placeholder="$t('Customer Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup> -->
                <UFormGroup
                    :label="$t('Dob')"
                    name='dob'>
                    <BaseDatePicker
                        v-model="customerInfo.dob"
                        ref="dobpicker"
                        :required="true"
                        class="w-full"
                        buttonType="outline"
                        :place-holder="$t('Dob')"
                    />
                </UFormGroup>
                
                <UFormGroup
                    :label="$t('Gender')"
                    name='gender'>
                    <USelectMenu
                        class="w-full"
                        v-model="customerInfo.gender"
                        :options="genders"
                        :placeholder="$t('Gender')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>

                <UFormGroup
                    :label="$t('Phone')"
                    name="phone">
                    <UInput
                        v-model="customerInfo.phone"
                        :placeholder="$t('Phone')"
                        icon="i-heroicons-phone"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    label="Email"
                    name="email">
                    <UInput
                        v-model="customerInfo.email"
                        placeholder="Email"
                        type="email"
                        icon="i-heroicons-envelope"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Tax Code')"
                    name="tax_code"
                    :error="errors.tax_code"
                    >
                    <UInput
                        v-model="customerInfo.tax_code"
                        :placeholder="$t('Tax Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Id Number')"
                    name="id_number"
                    :error="errors.id_number"
                    >
                    <UInput
                        v-model="customerInfo.id_number"
                        :placeholder="$t('Id Number')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Address')"
                    name="address">
                    <UInput
                        v-model="customerInfo.address"
                        icon="i-heroicons-map"
                        :placeholder="$t('Address')"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Curators')"
                    name="curators">
                    <CustomerUserSelect v-model="customerInfo.curators" :placeholder="$t('Curators')" :multiple="true"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Type of customer')"
                    name="type_of_customer">
                    <USelectMenu
                        class="w-full"
                        v-model="customerInfo.type_of_customer"
                        :options="type_of_customers"
                        :placeholder="$t('Type of customer')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Customer Group')"
                    name="customer_group">
                    <USelectMenu
                        class="w-full"
                        v-model="customerInfo.customer_group"
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
                        v-model="customerInfo.customer_source"
                        :options="customer_sources"
                        :placeholder="$t('Customer Source')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
            </UForm>
        </UCard>
        <UCard v-if="customerInfo.type_of_customer === 2" :ui="{
            base: ' my-6',
            rounded: 'rounded-sm',
        }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Company Information') }}
            </h2>
            <UForm :schema="schema" :state="customerInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup
                    v-slot="{error}"
                    :label="$t('Company Name')" 
                    name="company_name"
                    :error="errors.name"

                    required>
                    <UInput
                        v-model="customerInfo.company_name"
                        :placeholder="$t('Company Name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Phone')"
                    name="company_phone">
                    <UInput
                        v-model="customerInfo.company_phone"
                        :placeholder="$t('Phone')"
                        icon="i-heroicons-phone"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    label="Email"
                    name="company_email">
                    <UInput
                        v-model="customerInfo.company_email"
                        placeholder="Email"
                        type="email"
                        icon="i-heroicons-envelope"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    v-slot="{ error }"
                    :label="$t('Tax Code')"
                    name="company_tax_code"
                    :error="errors.tax_code"
                    >
                    <UInput
                        v-model="customerInfo.company_tax_code"
                        :placeholder="$t('Tax Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Address')"
                    name="company_address">
                    <UInput
                        v-model="customerInfo.company_address"
                        icon="i-heroicons-map"
                        :placeholder="$t('Address')"
                        :ui="{ base: 'w-full rounded-lg' }"/>
                </UFormGroup>
                <UFormGroup
                    :label="$t('Company Type')"
                    name="company_type">
                    <USelectMenu
                        class="w-full"
                        v-model="customerInfo.company_type"
                        :options="company_types"
                        :placeholder="$t('Company Type')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
                <UFormGroup
                    :label="$t('Line of business')"
                    name="line_of_business">
                    <USelectMenu
                        class="w-full"
                        v-model="customerInfo.line_of_business"
                        :options="LINE_OF_BUSINESS_CHOICES"
                        :placeholder="$t('Line of business')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
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
const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    customer_code: yup.string()
        .required(t('This field is required'))
        .test('check-employee-code-exists', t('Employee code already exists'), async (value) => {
            if (!value || props.isUpdate) return true;
            try {
                const { data: exists } = await useAPI().get('core/customers/', { customer_code: value });
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
const defaultUserInfo = {
    avatar: '',
    name: '',
    customer_code: '',
    gender: '',
    email: '',
    phone: '',
    dob: '',
    phone:'',
    email:'',
    address:'',
    type_of_customer: 1,
    customer_group: 5, 
    customer_source: 7, 
    stage: 2,
    status: 1,
    curators: [],
}
const customerInfo = ref(defaultUserInfo)
const genders = [
    {label: t('Male'), value: 'Male'},
    {label: t('Female'), value: 'Female'},
    {label: t('Other'), value: 'Other'},
]
const titles = ref([])
const departments = ref([])
const cloneCustomerInfo = ref({})

const loadData = async () => {
    try {
        if (props.isUpdate){
            const {data: response} = await useAPI().get(`core/customers/${useRoute().params.id}/`);
            customerInfo.value = response.value
            customerInfo.value.dob = customerInfo.value.dob ? new Date(customerInfo.value.dob) : null
            customerInfo.value.avatar = customerInfo.value.avatar 
                ? [{ 
                    preview: customerInfo.value.avatar, 
                }] 
                : '';
            cloneCustomerInfo.value = JSON.parse(JSON.stringify(customerInfo.value))
            console.log('response', customerInfo.value)
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
const customer_groups = [
    {label: t('Loyal Customer'), value: 1},
    {label: t('Former Customer'), value: 2},
    {label: t('Potential Customer'), value: 3},
    {label: t('Casual Customer'), value: 4},
    {label: t('Newly acquired lead'), value: 5},
    {label: t('Nurturing customer lead'), value: 6},
    {label: 'VIP', value: 7},
    {label: 'VVIP', value: 8},
]
const customer_sources = [
    {label: 'Facebook', value: 1},
    {label: 'Instagram', value: 2},
    {label: 'Google', value: 3},
    {label: t('Old customer referral'), value: 4},
    {label: t('Website'), value: 5},
    {label: t('Self-searching'), value: 6},
    {label: t('Switchboard'), value: 7},
    {label: t('Broker'), value: 8},
    {label: t('Sale data'), value: 9},
]
const company_types = [
    { label: t('Limited Liability Company'), value: t('Limited Liability Company') },
    { label: t('Joint Stock Company'), value: t('Joint Stock Company') },
    { label: t('Partnership'), value: t('Partnership') },
    { label: t('Sole Proprietorship'), value: t('Sole Proprietorship') },
    { label: t('State-owned Enterprise'), value: t('State-owned Enterprise') },
    { label: t('Foreign Enterprise'), value: t('Foreign Enterprise') },
    { label: t('Cooperative'), value: t('Cooperative') },
    { label: t('Non-profit Organization'), value: t('Non-profit Organization') },
];
const LINE_OF_BUSINESS_CHOICES = [
    { value: t('Retail') , label: t('Retail') },
    { value: t('Wholesale') , label: t('Wholesale') },
    { value: t('Manufacturing') , label: t('Manufacturing') },
    { value: t('Service') , label: t('Service') },
    { value: t('Technology') , label: t('Technology') },
    { value: t('Healthcare') , label: t('Healthcare') },
    { value: t('Education') , label: t('Education') },
    { value: t('Finance') , label: t('Finance') },
    { value: t('Real Estate') , label: t('Real Estate') },
    { value: t('Transportation') , label: t('Transportation') },
    { value: t('Construction') , label: t('Construction') },
    { value: t('Hospitality') , label: t('Hospitality') },
    { value: t('Entertainment') , label: t('Entertainment') },
    { value: t('Agriculture') , label: t('Agriculture') },
    { value: t('Other') , label: t('Other') },
];
const formatData = () => {
    const formData = new FormData();

    customerInfo.value.additional_infos = customerInfo.value.additional_infos.filter(
        (item) => item.type_of_contact !== null
    );
    Object.entries(customerInfo.value).forEach(([key, value]) => {
        if (!value) return;
        if (['curators'].includes(key)){
            if (value.length == 0) return;
            value.forEach((curator) => {
                formData.append('curators', curator.id || curator);
            });
        }
        else if(['additional_infos'].includes(key)){ 
            if (value.length == 0) return;
            formData.append(key, JSON.stringify(value));
        }
        else if (['dob'].includes(key)) {
            formData.append(key, dayjs(value).format('YYYY-MM-DD'));
        } else if (['avatar'].includes(key)) {
            if (value[0] instanceof File) {
                formData.append(key, value[0])
            }
            else if (value.length == 0){
                formData.append(key, '')
            }
        } else {
            formData.append(key, value);
        }
    });
    return formData;
};

const createCustomer = async () => {
    const profileData = formatData()
    try {
        const {data: response} = await useAPI().post(`core/customers/`, profileData);
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
const updateCustomer = async () => {
    const profileData = formatData()
    try {
        const {data: response} = await useAPI().put(`core/customers/${useRoute().params.id}/`, profileData);
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
        await schema.validate(customerInfo.value, { abortEarly: false });
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
                    description: t('The customer was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'customers' });
            }
        } else {
            const isCreated = await createCustomer();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The customer was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'customers' });
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while processing the customer. Please try again later.'),
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