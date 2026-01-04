<template>
    <UCard v-if="is_correct_data" :ui="{
        base: viewMode === 'basic' ? 'lg:w-4/5 w-full h-full mx-4 my-6' : 'lg:w-full w-full h-full mx-4 my-6',
        rounded: 'rounded-sm',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <UBreadcrumb :ui="{ ol: 'gap-x-3', li: 'gap-x-3', active: 'text-[#0313B0] dark:text-[#E0E0E0]', }"
                    :links="[{ label: $t('Contact List'), to: '/contacts' }, { label: props.isUpdate ? cloneContactInfo.name : $t('Create contact'), to: props.isUpdate ? `/contacts/${useRoute().params.id}` : '' }, { label: props.isUpdate ? $t('Update') : '' }]">
                    <!-- <template #divider>
                    <span class="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                </template> -->
                </UBreadcrumb>
                <div class="flex items-center space-x-2">
                    <USelectMenu v-if="props.isUpdate" class="w-full" :options="contact_statuses"
                        :placeholder="$t('Change status')" valueAttribute="value" option-attribute="label"
                        @change="onChangeStatus($event)" icon="i-heroicons-arrow-path" />
                    <UButton v-if="props.isUpdate" color="gray" variant="solid"
                        icon="fluent:contact-card-ribbon-20-regular" :label="$t('Convert to Customer')" size="sm"
                        @click="onConvertCustomer" />
                    <UDropdown :items="props.isUpdate ? updateItemDropdown : createItemDropdown"
                        :popper="{ placement: 'bottom-start' }">
                        <UButton color="gray" variant="soft" icon="i-heroicons-ellipsis-vertical" />
                        <template #tip="{ item }">
                            <div class="text-left cursor-text">
                                <p>
                                    {{ $t('Choose view mode') }}
                                </p>
                            </div>
                        </template>
                        <template #item="{ item }">
                            <span class="truncate">{{ item.label }}</span>

                            <UIcon :name="item.icon"
                                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                        </template>
                    </UDropdown>
                </div>
            </div>
        </template>
        <UCard :ui="{
            rounded: 'rounded-sm',
        }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Contact Information') }}
            </h2>
            <!-- <UCard class="m-4" :ui="{
                rounded: 'rounded-3xl',
                background: 'bg-blue-100',
                shadow: 'shadow-lg'
            }">
            <div class="flex flex-row items-end">
                <UForm :schema="schema" :state="contactInfo" class="mx-4 py-2">
                    <UFormGroup
                        name="avatar"
                        >
                        <CoreImageUpload 
                            :multiple="false" 
                            fileTypes=".png, .jpeg, .jpg, image/* "
                            v-model="contactInfo.avatar"
                            height="185px"
                            width="185px"
                            :rounded="true"
                        />
                    </UFormGroup>
                    
                </UForm>
                <UForm :schema="schema" :state="contactInfo" class="py-8 space-y-6 w-1/2">
                    <UFormGroup
                        v-slot="{error}"
                        name="name"
                        :error="errors.name"
                        required>
                        <UInput
                            variant="none" 
                            size="2xl"
                            v-model="contactInfo.name"
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
                            v-model="contactInfo.customer_code"
                            :disabled="props.isUpdate"
                            :placeholder="$t('Customer Code')"
                            :ui="{ 
                                base: 'w-full rounded-lg',
                                placeholder: error ? 'placeholder-red-500' : 'placeholder-gray-400'
                                }"/>
                    </UFormGroup>
                </UForm>
            </div>
            
            </UCard> -->

            <UForm :schema="schema" :state="contactInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup v-slot="{ error }" :label="$t('Full Name')" name="name" :error="errors.name" required>
                    <UInput v-model="contactInfo.name" :placeholder="$t('Full Name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup v-slot="{ error }" :label="$t('Customer Code')" name="customer_code"
                    :error="errors.customer_code" required>
                    <UInput v-model="contactInfo.customer_code" :disabled="props.isUpdate"
                        :placeholder="$t('Customer Code')" :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup :label="$t('Dob')" name='dob'>
                    <BaseDatePicker v-model="contactInfo.dob" ref="dobpicker" :required="true" class="w-full"
                        buttonType="outline" :place-holder="$t('Dob')" />
                </UFormGroup>
                <UFormGroup :label="$t('Gender')" name='gender'>
                    <USelectMenu class="w-full" v-model="contactInfo.gender" :options="genders"
                        :placeholder="$t('Gender')" valueAttribute="value" option-attribute="label"
                        :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>

                <UFormGroup :label="$t('Phone')" name="phone">
                    <UInput v-model="contactInfo.phone" :placeholder="$t('Phone')" icon="i-heroicons-phone"
                        :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup label="Email" name="email">
                    <UInput v-model="contactInfo.email" placeholder="Email" type="email" icon="i-heroicons-envelope"
                        :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup v-slot="{ error }" :label="$t('Tax Code')" name="tax_code" :error="errors.tax_code">
                    <UInput v-model="contactInfo.tax_code" :placeholder="$t('Tax Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup v-slot="{ error }" :label="$t('Id Number')" name="id_number" :error="errors.id_number">
                    <UInput v-model="contactInfo.id_number" :placeholder="$t('Id Number')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup :label="$t('Address')" name="address">
                    <UInput v-model="contactInfo.address" icon="i-heroicons-map" :placeholder="$t('Address')"
                        :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup :label="$t('Curators')" name="curators">
                    <CustomerUserSelect v-model="contactInfo.curators" :placeholder="$t('Curators')" :multiple="true" />
                </UFormGroup>
                <UFormGroup :label="$t('Type of contact')" name="type_of_customer">
                    <USelectMenu class="w-full" v-model="contactInfo.type_of_customer" :options="type_of_customers"
                        :placeholder="$t('Type of contact')" valueAttribute="value" option-attribute="label"
                        :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>
                <UFormGroup :label="$t('Contact title')" name="title">
                    <USelectMenu class="w-full" v-model="contactInfo.title" :options="titles"
                        :placeholder="$t('Contact title')" valueAttribute="value" option-attribute="label"
                        :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>
                <UFormGroup :label="$t('Contact Source')" name="customer_source">
                    <USelectMenu class="w-full" v-model="contactInfo.customer_source" :options="customer_sources"
                        :placeholder="$t('Contact Source')" valueAttribute="value" option-attribute="label"
                        :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>
                <UFormGroup :label="$t('Note')" name="note">
                    <UTextarea v-model="contactInfo.note" :placeholder="$t('Note')" rows="1" resize />
                </UFormGroup>
            </UForm>
        </UCard>
        <UCard :ui="{
            base: ' my-6',
            rounded: 'rounded-sm',
        }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Additional Information') }}
            </h2>
            <div class="grid grid-cols-2 gap-4 mx-4 py-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('Source') }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('Note') }}
                </p>
            </div>
            <div v-for="(info, index) in contactInfo.additional_infos" :key="index"
                class="grid grid-cols-2 gap-4 mx-4 py-2">
                <USelectMenu class="w-full" v-model="info.type_of_contact" :options="type_of_contacts"
                    :placeholder="$t('Source')" valueAttribute="value" option-attribute="label"
                    :is-dark="colorMode.value === 'dark'" />
                <div class="flex items-center space-x-2">
                    <UTextarea v-model="info.description" :placeholder="$t('Note')" rows="1" resize />
                    <UButton color="white" size="xs" variant="ghost" icon="i-heroicons-trash"
                        @click="onDeleteItem(info)" :disabled="contactInfo.additional_infos.length <= 1" />
                </div>
            </div>
            <UButton size="sm" color="gray" variant="soft" class="mx-4 my-2" icon="i-heroicons-plus-circle"
                @click="onAddItem">
            </UButton>
        </UCard>
        <UCard v-if="contactInfo.type_of_customer === 2" :ui="{
            base: ' my-6',
            rounded: 'rounded-sm',
        }">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ $t('Company Information') }}
            </h2>
            <UForm :schema="schema" :state="contactInfo" class="mx-4 py-2  grid grid-cols-2 gap-4">
                <UFormGroup v-slot="{ error }" :label="$t('Company Name')" name="company_name" :error="errors.name"
                    required>
                    <UInput v-model="contactInfo.company_name" :placeholder="$t('Company Name')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup :label="$t('Phone')" name="company_phone">
                    <UInput v-model="contactInfo.company_phone" :placeholder="$t('Phone')" icon="i-heroicons-phone"
                        :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup label="Email" name="company_email">
                    <UInput v-model="contactInfo.company_email" placeholder="Email" type="email"
                        icon="i-heroicons-envelope" :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup v-slot="{ error }" :label="$t('Tax Code')" name="company_tax_code" :error="errors.tax_code">
                    <UInput v-model="contactInfo.company_tax_code" :placeholder="$t('Tax Code')"
                        :ui="{ base: 'w-full rounded-lg' }"
                        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                </UFormGroup>
                <UFormGroup :label="$t('Address')" name="company_address">
                    <UInput v-model="contactInfo.company_address" icon="i-heroicons-map" :placeholder="$t('Address')"
                        :ui="{ base: 'w-full rounded-lg' }" />
                </UFormGroup>
                <UFormGroup :label="$t('Company Type')" name="company_type">
                    <USelectMenu class="w-full" v-model="contactInfo.company_type" :options="company_types"
                        :placeholder="$t('Company Type')" valueAttribute="value" option-attribute="label"
                        :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>
                <UFormGroup :label="$t('Line of business')" name="line_of_business">
                    <USelectMenu class="w-full" v-model="contactInfo.line_of_business"
                        :options="LINE_OF_BUSINESS_CHOICES" :placeholder="$t('Line of business')" valueAttribute="value"
                        option-attribute="label" :is-dark="colorMode.value === 'dark'" />
                </UFormGroup>
            </UForm>
        </UCard>
        <template #footer>
            <div class="flex justify-end items-center space-x-2">
                <UButton color="white" variant="solid" icon="i-heroicons-x-mark" :label="$t('Cancel')" size="sm"
                    @click="useRouter().back()" />
                <UButton color="primary" variant="solid" icon="i-heroicons-check-circle" :label="$t('Save')" size="sm"
                    @click="onSubmit" />
            </div>
        </template>
    </UCard>
    <!-- <UserProfileStepFooter @on-submit="onSubmit"/> -->
</template>
<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
import { forEach } from 'lodash';
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
const defaultInfo = {
    avatar: '',
    name: '',
    customer_code: '',
    gender: '',
    email: '',
    phone: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    type_of_customer: 1,
    customer_source: null,
    customer_group: null,
    title: null,
    stage: 1,
    status: 1,
    curators: [],
    attachment: [],
    note: '',
    additional_infos: [{
        type_of_contact: null,
        description: '',
    }],
}
const contactInfo = ref(defaultInfo)
const genders = [
    { label: t('Male'), value: 'Male' },
    { label: t('Female'), value: 'Female' },
    { label: t('Other'), value: 'Other' },
]
const is_correct_data = ref(true)
const cloneContactInfo = ref({})
const loadData = async () => {
    try {
        if (props.isUpdate) {
            is_correct_data.value = false
            const { data: response } = await useAPI().get(`core/customers/${useRoute().params.id}/`);
            contactInfo.value = response.value
            contactInfo.value.dob = contactInfo.value.dob ? new Date(contactInfo.value.dob) : null
            contactInfo.value.avatar = contactInfo.value.avatar
                ? [{
                    preview: contactInfo.value.avatar,
                }]
                : '';
            // Format attachment for FileUpload component
            contactInfo.value.attachment = contactInfo.value.attachment
                ? [{
                    preview: contactInfo.value.attachment,
                    name: contactInfo.value.attachment.split('/').pop(),
                }]
                : [];
            const stage = contactInfo.value.stage
            if (contactInfo.value.additional_infos.length == 0) {
                onAddItem()
            }
            if (stage === 1) {
                is_correct_data.value = true
            }
            cloneContactInfo.value = JSON.parse(JSON.stringify(contactInfo.value))
            console.log('currentStage', currentStage)
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
loadData()
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
    }, {
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
    }, {
        label: t('Standard'),
        icon: 'ant-design:fullscreen-outlined',
        click: () => {
            viewMode.value = 'standard'
        }
    }]
])
const type_of_customers = [
    { label: t('Personal'), value: 1 },
    { label: t('Organization'), value: 2 },
]
const customer_sources = [
    { label: 'Facebook', value: 1 },
    { label: 'Instagram', value: 2 },
    { label: 'Google', value: 3 },
    { label: t('Old customer referral'), value: 4 },
    { label: t('Website'), value: 5 },
    { label: t('Self-searching'), value: 6 },
    { label: t('Switchboard'), value: 7 },
    { label: t('Broker'), value: 8 },
    { label: t('Sale data'), value: 9 },
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
const titles = [
    { label: 'Ông', value: 1 },
    { label: 'Bà', value: 2 },
    { label: 'Cô', value: 3 },
    { label: 'Anh', value: 4 },
    { label: 'Chị', value: 5 },
    { label: 'Tiến sĩ', value: 6 },
    { label: 'Giáo sư', value: 7 },
    { label: t('Mr.'), value: 8 },
    { label: t('Ms.'), value: 9 },
    { label: t('Mrs.'), value: 10 },
    { label: t('Dr.'), value: 11 },
    { label: t('Prof.'), value: 12 },
    { label: t('Sir'), value: 13 },
    { label: t('Madam'), value: 14 },
    { label: t('Lord'), value: 15 },
    { label: t('Lady'), value: 16 },
];
const type_of_contacts = [
    { value: 1, label: t('Email') },
    { value: 2, label: t('Phone') },
    { value: 3, label: t('Address') },
    { value: 4, label: t('Website') },
    { value: 5, label: t('Facebook') },
    { value: 6, label: t('LinkedIn') },
    { value: 7, label: t('Twitter') },
    { value: 8, label: t('Instagram') },
    { value: 9, label: t('Skype') },
    { value: 10, label: t('WhatsApp') },
    { value: 11, label: t('Telegram') },
    { value: 12, label: t('Viber') },
    { value: 13, label: t('Zalo') },
    { value: 14, label: t('WeChat') },
    { value: 15, label: t('Other') },
];
const contact_statuses = [
    { value: 1, label: t('New') },
    { value: 2, label: t('1st Contacted') },
    { value: 3, label: t('2nd Contacted') },
    { value: 4, label: t('Consulting') },
    { value: 5, label: t('Negotiating') },
    { value: 6, label: t('Contracted') },
    { value: 7, label: t('Quoted') },
    { value: 8, label: t('Old Customer') },
    { value: 10, label: t('Others') },
];
const onAddItem = () => {
    contactInfo.value.additional_infos.push({
        type_of_contact: null,
        description: '',
    });
}
const onDeleteItem = (info) => {
    contactInfo.value.additional_infos = contactInfo.value.additional_infos.filter(item => item !== info);
};

const formatData = () => {
    const formData = new FormData();

    // Remove invalid additional_infos
    contactInfo.value.additional_infos = contactInfo.value.additional_infos.filter(
        (item) => item.type_of_contact !== null
    );

    Object.entries(contactInfo.value).forEach(([key, value]) => {
        // Handle file fields first (before null check)
        if (['avatar'].includes(key)) {
            if (value && value[0] instanceof File) {
                formData.append(key, value[0])
            }
            else if (value && value.length == 0) {
                formData.append(key, '')
            }
            return;
        }

        if (['attachment'].includes(key)) {
            // CoreFileUpload returns an array
            if (value && value.length > 0 && value[0] instanceof File) {
                formData.append(key, value[0])
            }
            return;
        }

        // Skip null/undefined values for other fields
        if (!value) return;

        if (['curators'].includes(key)) {
            if (value.length == 0) return;
            value.forEach((curator) => {
                formData.append('curators', curator.id || curator); // Append each ID
            });
        }
        else if (['additional_infos'].includes(key)) {
            if (value.length == 0) return;
            formData.append(key, JSON.stringify(value));
        }
        else if (['dob'].includes(key)) {
            // Format date fields
            formData.append(key, dayjs(value).format('YYYY-MM-DD'));
        } else {
            formData.append(key, value);
        }
    });

    return formData;
};

const createContact = async () => {
    const profileData = formatData()
    try {
        const { data: response } = await useAPI().post(`core/customers/`, profileData);
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
const updateContact = async () => {
    const profileData = formatData()
    try {
        const { data: response } = await useAPI().put(`core/customers/${useRoute().params.id}/`, profileData);
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

const convertToCustomer = async () => {
    const profileData = formatData()
    try {
        const { data: response } = await useAPI().post(`core/customers/${useRoute().params.id}/convert_to_customer/`, profileData);
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
const changeStatus = async (contact_status) => {
    try {
        const { data: response } = await useAPI().post(`core/customers/${useRoute().params.id}/contact_change_status/`, {
            status: contact_status,
        });
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
        await schema.validate(contactInfo.value, { abortEarly: false });
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
    console.log('isValid', isValid)
    if (!isValid) return;
    try {
        busy.value = true;
        if (props.isUpdate) {
            const isUpdated = await updateContact();
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The customer was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'contacts' });
            }
        } else {
            const isCreated = await createContact();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The customer was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'contacts' });
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
const onConvertCustomer = async () => {
    try {
        busy.value = true;
        if (props.isUpdate) {
            const isUpdated = await convertToCustomer();
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The contact was successfully converted to customer.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
            }
            useRouter().push({ name: 'customers' });
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while converting the contact to customer. Please try again later.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        });
    } finally {
        busy.value = false;
    }
};
const onChangeStatus = async (contact_status) => {
    if (!contact_status) {
        useToast().add({
            title: t('Error'),
            description: t('Please select a contact status.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 5000,
            position: 'top-right',
        });
        return;
    }
    try {
        busy.value = true;
        if (props.isUpdate) {
            const isUpdated = await changeStatus(contact_status);
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The contact status was successfully changed.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while changing the contact status. Please try again later.'),
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