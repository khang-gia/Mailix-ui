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
                <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-3 gap-4">
                    <UFormGroup
                        v-slot="{ error }"
                        :label="$t('Employee Code')"
                        name="employee_code"
                        :error="errors.employee_code"
                        required>
                        <UInput
                            v-model="userInfo.employee_code"
                            :disabled="props.isUpdate"
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
                            v-model="userInfo.full_name"
                            :placeholder="$t('Full Name')"
                            :ui="{ base: 'w-full rounded-lg' }"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Gender')"
                        name='gender'>
                        <USelectMenu
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
                            v-model="userInfo.years_of_experience"
                            :placeholder="$t('Years of experience')"
                            :ui="{ base: 'w-full rounded-lg' }"
                        />
                    </UFormGroup>
                    <UFormGroup
                        :label="$t('Direct manager')"
                        name="direct_manager">
                        <!-- <CoreUserSelect v-model="userInfo.direct_manager" :placeholder="$t('Direct manager')"/> -->
                        <CustomerUserSelect v-model="userInfo.direct_manager" :placeholder="$t('Direct manager')"/>

                    </UFormGroup>
                    
                    
                </UForm>
            </template>
            <template #id-card-info>
                <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-3 gap-4 ">
                    <UFormGroup
                        :label="$t('Id no')"
                        name="id_number">
                        <UInput
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
                                v-model="userInfo.front_id_card"
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
                                v-model="userInfo.back_id_card"
                                ref="fileSelectors"
                                width="inherit"
                            />
                        </UFormGroup>
                    </div>
                    
                </UForm>
            </template>
            <template #contact-info>
                <div class="flex">
                    <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-2 gap-4 ">
                        <UFormGroup
                            :label="$t('Phone')"
                            name="phone">
                            <UInput
                                v-model="userInfo.phone"
                                :placeholder="$t('Phone')"
                                icon="i-heroicons-phone"
                                :ui="{ base: 'w-full rounded-lg' }"/>
                        </UFormGroup>
                        <UFormGroup
                            v-if="userInfo.authen_email"
                            :label="$t('Authentication email')"
                            name="email"
                            >
                            <template #label>
                                <span class="mr-1">
                                    {{ $t('Authentication email') }}
                                </span>
                                <UTooltip :text="$t('Authentication email tooltip')" :popper="{ placement: 'right' }">
                                    <UIcon name="i-heroicons-exclamation-circle" class="text-yellow-500"/>
                                </UTooltip>
                                
                            </template>
                            <UInput
                                v-model="userInfo.authen_email"
                                :placeholder="$t('Authentication email')"
                                icon="i-heroicons-phone"
                                :ui="{ base: 'w-full rounded-lg' }"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Permanent address')"
                            name="permanent_address"
                            class="col-span-2">
                            <UInput
                                v-model="userInfo.permanent_address"
                                :placeholder="$t('Permanent address')"
                                :ui="{ base: 'w-full rounded-lg' }"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Current address')"
                            name="current_address"
                            class="col-span-2">
                            <UInput
                                v-model="userInfo.current_address"
                                :placeholder="$t('Current address')"
                                :ui="{ base: 'w-full rounded-lg' }"/>
                        </UFormGroup>
                    </UForm>
                    <UForm :schema="schema" :state="userInfo" class="py-2 lg:w-2/5 grid grid-cols-2">
                        <UFormGroup
                            :label="$t('Avatar')"
                            name="avatar"
                            >
                            <CoreImageUpload 
                                :multiple="false" 
                                fileTypes=".png, .jpeg, .jpg, image/* "
                                v-model="userInfo.avatar"
                                height="185px"
                                width="210px"
                            />
                        </UFormGroup>
                    </UForm>
                </div>
                
            </template>
            <template #contract-info>
                <div class="flex">
                    <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 lg:w-3/5 grid grid-cols-3 gap-4 ">
                        <UFormGroup
                            :label="$t('Title')"
                            name="title">
                            <CoreTitleSelectCreate v-model="userInfo.title" :placeholder="$t('Title')"/>
                        </UFormGroup>
                         <UFormGroup
                            :label="$t('Department')"
                            name="department">
                            <CoreDeparmentSelectCreate v-model="userInfo.department" :placeholder="$t('Department')"/>
                        </UFormGroup>
                        <UFormGroup
                            :label="$t('Type of labour')"
                            name="department">
                            <USelectMenu
                                class="w-full"
                                v-model="userInfo.type_of_labor"
                                :options="type_of_labors"
                                :placeholder="$t('Type of labour')"
                                valueAttribute="value"
                                option-attribute="label"
                                :is-dark="colorMode.value === 'dark'"
                            />
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
                </div>
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
    employee_code: yup.string()
        .required(t('This field is required'))
        .test('check-employee-code-exists', t('Employee code already exists'), async (value) => {
            if (!value || props.isUpdate) return true;
            try {
                const { data: exists } = await useAPI().get('core/profile_hrs/', { employee_code: value });
                console.log('data', exists.value.results);
                return exists.value.results.length == 0;
            } catch (error) {
                console.error('Error checking employee code:', error);
                return false;
            }
        }),
    email: yup.string().email(t('Invalid email format')).required(t('This field is required')),
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
    {
        label: t('Contract Information'),
        slot: 'contract-info',
    },
    // {
    //     label: t('Salary & Allowance'),
    //     slot: 'salary-allowance',
    // },
    // {
    //     label: t('Insurance Information'),
    //     slot: 'insurance-info',
    // }
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
    full_name: '',
    avatar:'',
    employee_code: '',
    marital_status: '',
    gender: '',
    id_card: '',
    authen_email: '',
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
    permanent_address:'',
    current_address:'',
    title: '',
}
const userInfo = ref(defaultUserInfo)
const genders = [
    {label: t('Male'), value: 'Male'},
    {label: t('Female'), value: 'Female'},
    {label: t('Other'), value: 'Other'},
]
const titles = ref([])
const departments = ref([])
const loadData = async () => {
    try {
        // const {data:titleData}= await useAPI().get("core/titles/",{});
        // titles.value = titleData.value.results
        // const {data:departmentData}= await useAPI().get("system/departments/",{});
        // departments.value = departmentData.value.results
        if (props.isUpdate){
            const {data: response} = await useAPI().get(`core/profile_hrs/${useRoute().params.id}/`);
            userInfo.value = response.value
            userInfo.value.join_date = userInfo.value.join_date ? new Date(userInfo.value.join_date) : null
            userInfo.value.actual_sign_date = userInfo.value.actual_sign_date ? new Date(userInfo.value.actual_sign_date) : null
            userInfo.value.dob = userInfo.value.dob ? new Date(userInfo.value.dob) : null
            userInfo.value.date_of_issue = userInfo.value.date_of_issue ? new Date(userInfo.value.date_of_issue) : null
            userInfo.value.front_id_card = userInfo.value.front_id_card 
                ? [{ 
                    preview: userInfo.value.front_id_card, 
                }] 
                : '';
            userInfo.value.back_id_card = userInfo.value.back_id_card 
                ? [{ 
                    preview: userInfo.value.back_id_card, 
                }] 
                : '';
            userInfo.value.avatar = userInfo.value.avatar 
                ? [{ 
                    preview: userInfo.value.avatar, 
                }] 
                : '';

            // userInfo.value.direct_manager = userInfo.value.direct_manager ? userInfo.value.direct_manager.id: '',
            // userInfo.value.department = userInfo.value.department ? userInfo.value.department.id: '',
            console.log('response', userInfo.value)
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
loadData()
// const departmentLabels = computed({
//   get: () => userInfo.value.department,
//   set: async (label) => {  
//     if (label?.id) {
//       userInfo.value.department = label
//       return
//     }
//     // console.log('label', label)
//     const response = {
//       id: departments.value.length + 1,
//       name: label.name,
//     }

//     departments.value.push(response)
//     userInfo.value.department = response
//   }
// })
const type_of_labors = [
    {label: t('Full-time'), value: 'Full-time'},
    {label: t('Part-time'), value: 'Part-time'},
    {label: t('Internship'), value: 'Internship'},
    {label: t('Temporary'), value: 'Temporary'},
]
    
// const titles = [
//     {label: t('Specialist'), value: 'Specialist'},
//     {label: t('Apprentice'), value: 'Apprentice'},
//     {label: t('Intern'), value: 'Intern'},
//     {label: t('Staff'), value: 'Staff'},
//     {label: t('Manager'), value: 'Manager'},
//     {label: t('Director'), value: 'Director'},
//     {label: t('Collaborator'), value: 'Collaborator'},
//     {label: t('Leader'), value: 'Leader'},
//     {label: t('Team Leader'), value: 'Team Leader'},
//     {label: t('Deputy'), value: 'Deputy'},
//     {label: t('Vice'), value: 'Vice'},
//     {label: t('Chief'), value: 'Chief'},
//     {label: t('Head'), value: 'Head'},
//     {label: t('Head clerk'), value: 'Head clerk'},
// ]
// const positions = [
//     {label: t('Manager'), value: 'Manager'},
//     {label: t('Staff'), value: 'Staff'},
//     {label: t('Intern'), value: 'Intern'},
// ]
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
    { label: t('Elementary'), value: 'Elementary' },
    { label: t('Intermediate'), value: 'Intermediate' },
    { label: t('College'), value: 'College' },
    { label: t('Master’s Degree'), value: 'Master’s Degree' },
    { label: t('PhD'), value: 'PhD' },
    { label: t('Other'), value: 'Other' },
    { label: t('Doctor of Science'), value: 'Doctor of Science' },
    { label: t('Engineer'), value: 'Engineer' },
    { label: t('University'), value: 'University' },
    { label: t('Vocational Intermediate'), value: 'Vocational Intermediate' },
    { label: t('Vocational College'), value: 'Vocational College' },
    { label: t('High School'), value: 'High School' },
    { label: t('Professional Intermediate'), value: 'Professional Intermediate' },
    { label: t('Vocational Elementary'), value: 'Vocational Elementary' },
    { label: t('Junior High School'), value: 'Junior High School' },
    { label: t('Professional Certificate'), value: 'Professional Certificate' },
    { label: t('Specialist Level 1'), value: 'Specialist Level 1' },
    { label: t('Specialist Level 2'), value: 'Specialist Level 2' },
    { label: t('Primary School'), value: 'Primary School' }
]
// const onUploadImage = (files, key) => {
//     if (!files.value || !files.value.length) return;
//     userInfo.value[key] = files.value[0];

//     console.log('key', userInfo.value[key])
// };
const formatData = () => {
    const formData = new FormData();
    Object.entries(userInfo.value).forEach(([key, value]) => {
        if (!value) return;
        if (['front_id_card', 'back_id_card'].includes(key)) {
            console.log('value',value)
            if (value[0] instanceof File) {
                formData.append(key, value[0])
            }
            else if (value.length == 0){
                formData.append(key, '')
            }
        } else if (['dob', 'join_date', 'actual_sign_date', 'date_of_issue'].includes(key)) {
            formData.append(key, dayjs(value).format('YYYY-MM-DD'));
        } else if (typeof value === 'object' && value !== null && value.id) {
            formData.append(key, value.id)
        } else if(['pob','place_of_origin', 'nationality'].includes(key)) {
            if (!value ) {
                formData.append(key, '');
            }
            else if (value) {
                formData.append(key, value.name? value.name : value);
            }
        }else if (['avatar'].includes(key)) {
            console.log('ava',value)
            if (value[0] instanceof File) {
                formData.append(key, value[0])
            }
            else if (value.length == 0){
                formData.append(key, '')
            }
        }else if(['direct_manager'].includes(key))  {
            formData.append(key, value ? value.id : '');
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
const updateProfile = async () => {
    const profileData = formatData()
    console.log('update profile Data', profileData)
    try {
        const {data: response} = await useAPI().put(`core/profile_hrs/${useRoute().params.id}/`, profileData);
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
const onSubmit = async () => {
    const isValid = await validateSchema(); 
    console.log('isValid',isValid)
    if (!isValid) return;
    try {
        busy.value = true;
        if (props.isUpdate) {
            const isUpdated = await updateProfile();
            if (isUpdated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The profile was successfully updated.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'hr' });
            }
        } else {
            const isCreated = await createProfile();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The profile was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'hr' });
            }
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while processing the profile. Please try again later.'),
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