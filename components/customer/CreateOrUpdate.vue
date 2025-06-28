<template>
    <UCard :ui="{
        base: 'lg:w-4/5 w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <UCard :ui="{
        rounded: 'rounded-sm',
    }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Customer Information') }}
            </h2>
            <UForm :schema="schema" :state="customerInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup
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
                </UFormGroup>
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
const defaultUserInfo = {
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
const loadData = async () => {
    try {
        if (props.isUpdate){
            const {data: response} = await useAPI().get(`core/customers/${useRoute().params.id}/`);
            customerInfo.value = response.value
            customerInfo.value.dob = customerInfo.value.dob ? new Date(customerInfo.value.dob) : null
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
    { label: t('Limited Liability Company'), value: 1 },
    { label: t('Joint Stock Company'), value: 2 },
    { label: t('Partnership'), value: 3 },
    { label: t('Sole Proprietorship'), value: 4 },
    { label: t('State-owned Enterprise'), value: 5 },
    { label: t('Foreign Enterprise'), value: 6 },
    { label: t('Cooperative'), value: 7 },
    { label: t('Non-profit Organization'), value: 8 },
];
const LINE_OF_BUSINESS_CHOICES = [
    { value: 1, label: t('Retail') },
    { value: 2, label: t('Wholesale') },
    { value: 3, label: t('Manufacturing') },
    { value: 4, label: t('Service') },
    { value: 5, label: t('Technology') },
    { value: 6, label: t('Healthcare') },
    { value: 7, label: t('Education') },
    { value: 8, label: t('Finance') },
    { value: 9, label: t('Real Estate') },
    { value: 10, label: t('Transportation') },
    { value: 11, label: t('Construction') },
    { value: 12, label: t('Hospitality') },
    { value: 13, label: t('Entertainment') },
    { value: 14, label: t('Agriculture') },
    { value: 15, label: t('Other') },
];
// const formatData = () => {
//     const formData = new FormData();
//     Object.entries(customerInfo.value).forEach(([key, value]) => {
//         if (!value) return;
//         if (Array.isArray(value)) {
//             const ids = value.map(item => {
//                 if (typeof item === 'object' && item !== null) {
//                     return item.id || item;
//                 }
//                 return item;
//             });
//             formData.append(key, ids.join(','));
//         } else if (typeof value === 'object' && value !== null && value.id) {
//             formData.append(key, value.id);
//         }
//         else if (['dob'].includes(key)) {
//             formData.append(key, dayjs(value).format('YYYY-MM-DD'));
//         } else {
//             formData.append(key, value);
//         }
//     });
//     return formData;
// };
const formatData2 = () => {
    const formattedData = {};
    Object.entries(customerInfo.value).forEach(([key, value]) => {
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

const createCustomer = async () => {
    const profileData = formatData2()
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
    const profileData = formatData2()
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
                    curators: t('Success'),
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
                    curators: t('Success'),
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
            curators: t('Error'),
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