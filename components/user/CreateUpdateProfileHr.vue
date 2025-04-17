<template>
    <UCard :ui="{
        base: 'w-full',
        rounded: 'rounded-none',
    }">
        <UAccordion
            default-open
            color="blue"
            variant="soft"
            size="sm"
            multiple
            :items="items"
            :ui="{
                base: 'w-full',
                wrapper: 'pb-4'
            }">
            <template #personal-info>
                <div class="flex">
                    <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-3 gap-4">
                        <UFormGroup
                            v-slot="{ error }"
                            :label="$t('Employee Code')"
                            name="employee_code"
                            :error="errors.employee_code"
                            required>
                            <UInput
                                v-model="userInfo.employee_code"
                                :disabled="busy"
                                :placeholder="$t('Employee Code')"
                                :ui="{ base: 'w-full rounded-lg' }"
                                :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Profile code')"
                            name="profile_code"
                            >
                            <template #label>
                                <span class="mr-1">
                                    {{ $t('Profile code') }}
                                </span>
                                <UTooltip :text="$t('Profile code tooltip')" :popper="{ placement: 'right' }" 
                                :ui="{
                                    base: 'text-xs font-normal overflow-x-visible',
                                }">
                                    <UIcon name="i-heroicons-exclamation-circle" class="text-yellow-500"/>
                                </UTooltip>
                                
                            </template>
                            <UInput
                                :disabled="busy"
                                v-model="userInfo.profile_code"
                                :placeholder="$t('Profile code')"
                                :ui="{ base: 'w-full rounded-lg' }"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Dob')"
                            name='dob'>
                            <BaseDatePicker
                                v-model="userInfo.dob"
                                ref="dobpicker"
                                :required="true"
                                class="w-full"
                                buttonType="outline"
                                :place-holder="$t('Dob')"
                            />
                        </UFormGroup>
                        <UFormGroup
                            v-slot="{error}"
                            class="col-span-2"
                            :label="$t('Full Name')" 
                            name="full_name"
                            :error="errors.full_name"

                            required>
                            <UInput
                                :disabled="busy"
                                v-model="userInfo.full_name"
                                :placeholder="$t('Full Name')"
                                :ui="{ base: 'w-full rounded-lg' }"
                                :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Gender')"
                            name='gender'>
                            <USelectMenu
                                :disabled="busy"
                                class="w-full"
                                v-model="userInfo.gender"
                                :options="genders"
                                :placeholder="$t('Gender')"
                                valueAttribute="value"
                                option-attribute="label"
                                :is-dark="colorMode.value === 'dark'"
                            />
                        </UFormGroup>
                        
                        <UFormGroup
                            class="col-span-2"
                            :label="$t('Pob')"
                            name='pob'>
                            <CoreLocationSelect
                                v-model="userInfo.pob" :placeholder="$t('Pob')"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Marital Status')"
                            name="marital_status">
                            <USelectMenu
                                class="w-full"
                                :disabled="busy"
                                v-model="userInfo.marital_status"
                                :options="MaritalStatus"
                                :placeholder="$t('Marital Status')"
                                valueAttribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>
                        <UFormGroup
                            class="col-span-2"
                            :label="$t('Place of origin')"
                            name="place_of_origin">
                            <CoreLocationSelect
                                v-model="userInfo.place_of_origin" :placeholder="$t('Place of origin')"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Nationality')"
                            name="nationality">
                            <CoreNationalitySelect
                                v-model="userInfo.nationality" :placeholder="$t('Nationality')"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Personal tax code')"
                            name="tax_code">
                            <UInput
                                :disabled="busy"
                                v-model="userInfo.tax_code"
                                :placeholder="$t('Personal tax code')"
                                :ui="{ base: 'w-full rounded-lg' }"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Ethnicity')"
                            name="ethnicity">
                            <CoreEthnicitySelect
                                v-model="userInfo.ethnicity" :placeholder="$t('Ethnicity')"/>
                        </UFormGroup>
                        
                        <UFormGroup
                            :label="$t('Education level')"
                            name="educaional_level">
                            <USelectMenu
                                :disabled="busy"
                                class="w-full"
                                v-model="userInfo.educaional_level"
                                :options="EducationLevel"
                                :placeholder="$t('Education level')"
                                valueAttribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Highest Professional Qualification')"
                            name="highest_qualification">
                            <USelectMenu
                                :disabled="busy"
                                class="w-full"
                                v-model="userInfo.highest_qualification"
                                :options="HighestProfessionalQualification"
                                :placeholder="$t('Highest Professional Qualification')"
                                valueAttribute="value"
                                option-attribute="label"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Years of experience')"
                            name="years_of_experience">
                            <UInput
                                :disabled="busy"
                                v-model="userInfo.years_of_experience"
                                :placeholder="$t('Years of experience')"
                                :ui="{ base: 'w-full rounded-lg' }"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Direct manager')"
                            name="direct_manager">
                            <CoreUserSelect v-model="userInfo.direct_manager" :placeholder="$t('Direct manager')"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Join date')"
                            name='join_date'>
                            <BaseDatePicker
                                v-model="userInfo.join_date"
                                ref="dobpicker"
                                :required="true"
                                class="w-full"
                                buttonType="outline"
                                />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Actual sign date')"
                            name='actual_sign_date'>
                            <BaseDatePicker
                                v-model="userInfo.actual_sign_date"
                                ref="dobpicker"
                                :required="true"
                                class="w-full"
                                buttonType="outline"
                                />
                        </UFormGroup>
                        
                    </UForm>
                    <UForm :schema="schema" :state="userInfo" class="py-2 lg:w-2/5 grid grid-cols-2 gap-4">
                        <UFormGroup
                            :label="$t('Avatar')"
                            name="avatar"
                            >
                            <CoreImageUpload 
                                :multiple="false" 
                                fileTypes=".png, .jpeg, .jpg, image/* "
                                @on-select="onUploadImage($event, 'avatar')"
                                height="185px"
                                width="210px"
                            />
                        </UFormGroup>
                    </UForm>
                </div>
                
            </template>
            <template #id-card-info>
                <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-3 gap-4 ">
                    <UFormGroup
                        :label="$t('Id no')"
                        name="id_number">
                        <UInput
                            :disabled="busy"
                            v-model="userInfo.id_number"
                            :placeholder="$t('Id no')"
                            :ui="{ base: 'w-full rounded-lg' }"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Date of issue')"
                        name="date_of_issue">
                        <BaseDatePicker
                            v-model="userInfo.date_of_issue"
                            ref="date_of_issue"
                            :required="true"
                            class="w-full"
                            buttonType="outline"
                            :place-holder="$t('Date of issue')"
                            />
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Place of issue')"
                        name="place_of_issue">
                        <CorePlaceOfIssueSelect
                            v-model="userInfo.place_of_issue" :placeholder="$t('Place of issue')"/>
                    </UFormGroup>
                    <div class="col-span-3 grid grid-cols-2 gap-4">
                        <UFormGroup
                            :label="$t('Front id card')"
                            name="front_id_card"
                            >
                            <CoreImageUpload 
                                :multiple="false" 
                                fileTypes=".png, .jpeg, .jpg, image/* "
                                @on-select="onUploadImage($event,'front_id_card')"
                                ref="fileSelectors"
                                width="inherit"
                            />
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Back id card')"
                            name="back_id_card"
                            >
                            <CoreImageUpload 
                                :multiple="false" 
                                fileTypes=".png, .jpeg, .jpg, image/* "
                                @on-select="onUploadImage($event, 'back_id_card')"
                                ref="fileSelectors"
                                width="inherit"
                            />
                        </UFormGroup>
                    </div>
                    
                </UForm>
            </template>
            <template #contact-info>
                <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-2 gap-4 ">
                    <UFormGroup
                        :label="$t('Phone')"
                        name="phone">
                        <UInput
                            :disabled="busy"
                            v-model="userInfo.phone"
                            :placeholder="$t('Phone')"
                            icon="i-heroicons-phone"
                            :ui="{ base: 'w-full rounded-lg' }"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Phone other')"
                        name="phone_other"
                        >
                        <template #label>
                            <span class="mr-1">
                                {{ $t('Phone other') }}
                            </span>
                            <UTooltip :text="$t('Phone other tooltip')" :popper="{ placement: 'right' }">
                                <UIcon name="i-heroicons-exclamation-circle" class="text-yellow-500"/>
                            </UTooltip>
                            
                        </template>
                        <UInput
                            :disabled="busy"
                            v-model="userInfo.phone_other"
                            :placeholder="$t('Phone other')"
                            icon="i-heroicons-phone"
                            :ui="{ base: 'w-full rounded-lg' }"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Permanent address')"
                        name="permanent_address"
                        class="col-span-2">
                        <UInput
                            :disabled="busy"
                            v-model="userInfo.permanent_address"
                            :placeholder="$t('Permanent address')"
                            :ui="{ base: 'w-full rounded-lg' }"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Current address')"
                        name="current_address"
                        class="col-span-2">
                        <UInput
                            :disabled="busy"
                            v-model="userInfo.current_address"
                            :placeholder="$t('Current address')"
                            :ui="{ base: 'w-full rounded-lg' }"/>
                    </UFormGroup>
                </UForm>
            </template>
            </UAccordion>
        <!-- <template #footer>
            <div class="flex justify-end items-center space-x-2">
                <UButton color="white" variant="solid" icon="i-heroicons-x-mark" :label="$t('Cancel')" size="sm" @click="useRouter().back()"/>
                <UButton color="primary" variant="solid" icon="i-heroicons-check-circle" :label="$t('Save')" size="sm" @click="onSubmit"/>
            </div>
        </template> -->
    </UCard>
    <UserProfileStepFooter @on-submit="onSubmit"/>
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
    full_name: yup.string().required(t('This field is required')),
    employee_code: yup.string().required(t('This field is required')),
    // id_number: yup.string().required(t('This field is required')),
    // place_of_issue: yup.string().required(t('This field is required')),
})
const items = [
    {
        label: t('Personal Information'),
        slot: 'personal-info',
    },
    {
        label: t('Id Card Information'),
        slot: 'id-card-info',
    },
    {
        label: t('Contact Information'),
        slot: 'contact-info',
    },
    // {
    //     label: t('Contract Information'),
    //     slot: 'contract-info',
    // },
    // {
    //     label: t('Salary & Allowance'),
    //     slot: 'salary-allowance',
    // },
    // {
    //     label: t('Insurance Information'),
    //     slot: 'insurance-info',
    // }
]
const userInfo = ref({
    full_name: '',
    avatar:'',
    employee_code: '',
    marital_status: '',
    gender: '',
    id_card: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    dob: '',
    pob: '',
    place_of_origin: '',
    ethnicity: '',
    tax_code: '',
    years_of_experience:'',
    join_date:new Date(),
    actual_sign_date: new Date(),
    highest_qualification: '',
    direct_manager: '',
    nationality: '',
    id_number:'',
    date_of_issue: '',
    place_of_issue: '',
    front_id_card:'',
    back_id_card: '',
    phone:'',
    email:'',
    permanent_address:'',
    current_address:''
})
const genders = [
    {label: t('Male'), value: 'Male'},
    {label: t('Female'), value: 'Female'},
    {label: t('Other'), value: 'Other'},
]
const MaritalStatus = [
    {label: t('Single'), value: 'Single'},
    {label: t('Married'), value: 'Married'},
    {label: t('Divorced'), value: 'Divorced'},
]
const EducationLevel = [
    {label: '1/12', value: 1},
    {label: '2/12', value: 2},
    {label: '3/12', value: 3},
    {label: '4/12', value: 4},
    {label: '5/12', value: 5},
    {label: '6/12', value: 6},
    {label: '7/12', value: 7},
    {label: '8/12', value: 8},
    {label: '9/12', value: 9},
    {label: '10/12', value: 10},
    {label: '11/12', value: 11},
    {label: '12/12', value: 12},
]
const HighestProfessionalQualification =  [
    { label: t('Elementary'), value: 'elementary' },
    { label: t('Intermediate'), value: 'intermediate' },
    { label: t('College'), value: 'college' },
    { label: t('Master’s Degree'), value: 'masters' },
    { label: t('PhD'), value: 'phd' },
    { label: t('Other'), value: 'other' },
    { label: t('Doctor of Science'), value: 'doctorOfScience' },
    { label: t('Engineer'), value: 'engineer' },
    { label: t('University'), value: 'university' },
    { label: t('Vocational Intermediate'), value: 'vocationalIntermediate' },
    { label: t('Vocational College'), value: 'vocationalCollege' },
    { label: t('High School'), value: 'highSchool' },
    { label: t('Professional Intermediate'), value: 'professionalIntermediate' },
    { label: t('Vocational Elementary'), value: 'vocationalElementary' },
    { label: t('Junior High School'), value: 'juniorHighSchool' },
    { label: t('Professional Certificate'), value: 'professionalCertificate' },
    { label: t('Specialist Level 1'), value: 'specialistLevel1' },
    { label: t('Specialist Level 2'), value: 'specialistLevel2' },
    { label: t('Primary School'), value: 'primarySchool' }
]
const onUploadImage = (files, key) => {
    if (!files.value || !files.value.length) return;
    userInfo.value[key] = files.value[0];
};
const formatData = () => {
    const formData = new FormData();
    Object.entries(userInfo.value).forEach(([key, value]) => {
        if (!value) return;

        if (['front_id_card', 'back_id_card'].includes(key)) {
            formData.append(key, value);
        } else if (['dob', 'join_date', 'actual_sign_date', 'date_of_issue'].includes(key)) {
            formData.append(key, dayjs(value).format('YYYY-MM-DD'));
        }else if(['pob','place_of_origin', 'nationality'].includes(key)) {
            formData.append(key, value.id)
        } else {
            formData.append(key, value);
        }
    });
    return formData;
};
const createProfile = async () => {
    const profileData = formatData()
    console.log('profile Data', profileData)
    try {
        const {data: response} = await useAPI().post(`core/profile_hrs/`, profileData);
        console.log('response', response.value)
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
        await schema.validate(userInfo.value, { abortEarly: false });
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
const onSubmit = async() => {
    const isValid = await validateSchema(); 
    if (!isValid) return;
    try{
        busy.value = true
        const isCreated = await createProfile()
        if (isCreated){
            useToast().add({
                title: t('Profile created'),
                description: t('Profile has been created successfully'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
            })
            useRouter().push({ name: 'hr' });
        }
    }catch (error){
        useToast().add({
            title: t('Error'),
            description: error.message || t('Failed to create profile'),
            icon: 'i-heroicons-x-circle',
            color: 'red',
        })
    }finally{
        busy.value = false
    }
    
}
</script>