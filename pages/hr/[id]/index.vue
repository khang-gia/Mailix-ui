<template>
    <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
        <div class="flex items-center">
        </div>
        <div class="flex justify-end">
            <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" :label="$t('Update')" size="sm"
                :to="{ name: 'hr-id-update' }" />
            <UButton color="gray" variant="ghost" icon="ph:user-circle-plus-light" :label="$t('Create account')"
                size="sm" @click="setCreateModal(true, 'account')" v-if="!userInfo.user" />
            <UButton v-else color="gray" variant="ghost" icon="i-heroicons-envelope" :label="$t('Change Email')"
                size="sm" @click="showChangeEmailModal = true" />
        </div>
        
        <ModalChangeEmail v-model="showChangeEmailModal" @email-changed="handleEmailChanged" />

    </div>
    <div class="p-4 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
            <div class="lg:col-span-4 space-y-4">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200">
                            {{ $t('Personal Information') }}
                        </h3>
                        <div class="">

                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-2 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Ethnicity')
                        }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.ethnicity ? userInfo.ethnicity : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Religion')
                        }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.religion ? userInfo.religion : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Nationality')
                        }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.nationality ? userInfo.nationality : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Employee Code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.employee_code ? userInfo.employee_code : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Profile code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.profile_code ? userInfo.profile_code : '--' }}
                        </p>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Pob') }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.pob ? userInfo.pob : '--' }}
                        </p>
                    </div>


                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Personal tax code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.tax_code ? userInfo.tax_code : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Education level')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.educaional_level ? userInfo.educaional_level + '/12' : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Highest Professional Qualification')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.highest_qualification ? $t(userInfo.highest_qualification) : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Years of experience')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.years_of_experience ? userInfo.years_of_experience : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Direct manager')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                            <NuxtLink v-if="userInfo.direct_manager" :to="`/hr/${userInfo.direct_manager.id}`"
                                class="text-blue-500 hover:underline">
                                {{ userInfo.direct_manager.full_name }}
                            </NuxtLink>
                            <span v-else>
                                {{ userInfo.direct_manager ? userInfo.direct_manager.full_name : '--' }}
                            </span>
                        </p>
                    </div>


                </div>
            </UCard>

            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200">
                            {{ $t('Id Card Information') }}
                        </h3>
                        <div class="">

                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-3 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Id no') }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.id_number ? userInfo.id_number : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Date of issue')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.date_of_issue ? userInfo.date_of_issue : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Place of issue')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.place_of_issue ? userInfo.place_of_issue : '--' }}
                        </p>
                    </div>
                    <div class="col-span-3 grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Front id card')}}</label>
                            <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <img v-if="userInfo.front_id_card" :src="userInfo.front_id_card" alt="Front ID Card"
                                    class="object-cover w-full h-full cursor-pointer"
                                    @click="showImageModal(userInfo.front_id_card, 'Front id card')" />
                                <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Back id card')}}</label>
                            <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <img v-if="userInfo.back_id_card" :src="userInfo.back_id_card" alt="Back ID Card"
                                    class="object-cover w-full h-full cursor-pointer"
                                    @click="showImageModal(userInfo.back_id_card, 'Back id card')" />
                                <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200">
                            {{ $t('Job') }}
                        </h3>
                        <div class="">

                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-2 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Department')
                        }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.department ? userInfo.department.name : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Title') }}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.title ? userInfo.title_name : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Join date')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.join_date ? userInfo.join_date : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Actual sign date')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.actual_sign_date ? userInfo.actual_sign_date : '--' }}
                        </p>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Type of labour')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.type_of_labor_name ? $t(userInfo.type_of_labor_name) : '--' }}
                        </p>
                    </div>
                    <!-- <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Group user')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.type_of_labor_name? $t(userInfo.type_of_labor_name):'--' }}
                        </p>
                    </div> -->
                </div>
            </UCard>
        </div>

        <UCard class="lg:col-span-2">
            <div class="h-full -m-2">
                <div class="rounded-lg w-full h-1/2 bg-blue-100 flex items-center justify-center py-16">
                    <div class="flex flex-col items-center justify-center w-full">
                        <div class="w-32 h-32 rounded-full overflow-hidden border-3 border-slate-300 mx-auto"> 
                            <img :src="userInfo.avatar ? userInfo.avatar : '/images/default-user-img.png'" alt="Avatar"
                            class="w-full h-full object-cover" />
                        </div>
                        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-200 p-2">
                            {{ userInfo.full_name }}
                        </h3>
                        <p class=" text-gray-600 dark:text-gray-400 px-2">
                            {{ userInfo.title ? userInfo.title_name : '' }} {{ userInfo.department ? '- ' +
                                userInfo.department.name : '' }}
                        </p>

                        <!-- Status Badge with Popover -->
                        <UPopover :popper="{ placement: 'bottom' }">
                            <UBadge v-if="userInfo.status !== undefined" class="mt-2 cursor-pointer"
                                :color="getStatusColor(userInfo.status)" variant="solid">
                                {{ getStatusLabel(userInfo.status) }}
                                <template #trailing>
                                    <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1" />
                                </template>
                            </UBadge>

                            <template #panel>
                                <div class="p-4 w-80">
                                    <h3 class="text-lg font-semibold mb-4">{{ $t('Update Status') }}</h3>

                                    <!-- Status Radio Group -->
                                    <URadioGroup v-model="selectedStatus" :options="statusOptions" class="mb-4">
                                        <template #label="{ option }">
                                            <div class="flex items-center gap-2">
                                                <div class="w-3 h-3 rounded-full"
                                                    :class="getStatusDotClass(option.value)"></div>
                                                <span>{{ option.label }}</span>
                                            </div>
                                        </template>
                                    </URadioGroup>

                                    <!-- Date Fields -->
                                    <div class="space-y-3 mb-4">
                                        <UFormGroup :label="$t('Start Date')" required>
                                            <UInput v-model="statusStartDate" type="date" icon="i-heroicons-calendar" />
                                        </UFormGroup>

                                        <UFormGroup v-if="selectedStatus === 1" :label="$t('End Date')" required>
                                            <UInput v-model="statusEndDate" type="date" icon="i-heroicons-calendar"
                                                :min="statusStartDate" />
                                        </UFormGroup>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="flex justify-end gap-2">
                                        <UButton color="gray" variant="ghost" @click="cancelStatusUpdate">
                                            {{ $t('Cancel') }}
                                        </UButton>
                                        <UButton color="primary" @click="updateStatus" :disabled="!canUpdateStatus"
                                            :loading="isUpdatingStatus">
                                            {{ $t('Update Status') }}
                                        </UButton>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                    </div>

                </div>
                <div class="space-y-10 pt-6">
                    <div class="flex gap-2">
                        <UBadge icon="icons8:gender" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Username')
                            }}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.username ? $t(userInfo.username) : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="icons8:gender" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Gender')
                            }}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.gender ? $t(userInfo.gender) : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="i-heroicons-calendar" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Dob')
                            }}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.dob ? userInfo.dob : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="i-heroicons-envelope" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Email')
                            }}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.personal_email ? userInfo.personal_email : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="i-heroicons-phone" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('Phone')
                            }}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.phone ? userInfo.phone : '--' }}
                            </p>
                        </div>
                    </div>
                    <!-- <div class="flex gap-2">
                        <UBadge
                            icon="ph:phone-plus"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Email')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.email_verified ? userInfo.email_verified : '--' }}
                            </p>
                        </div>
                    </div> -->

                    <div class="flex gap-2">
                        <UBadge icon="ic:outline-place" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Place of origin')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.place_of_origin ? userInfo.place_of_origin : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="tabler:address-book" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Permanent address')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.permanent_address ? userInfo.permanent_address : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="carbon:location-current" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Current address')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.current_address ? userInfo.current_address : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge icon="mingcute:love-line" size="md" color="blue" variant="soft" class="my-1" />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Marital Status')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.marital_status ? $t(userInfo.marital_status) : '--' }}
                            </p>
                        </div>
                    </div>

                </div>
            </div>



        </UCard>
        </div>
    </div>
</template>
<script setup>

import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setExpandImageModal, setCreateModal } = modalStore
const userInfo = ref({});
const userData = await useAPI().get(`core/profile_hrs/${useRoute().params.id}/`);
userInfo.value = userData.data.value;
console.log('userInfo', userData.data)

const showChangeEmailModal = ref(false)
const handleEmailChanged = (newEmail) => {
    userInfo.value.email = newEmail
}

definePageMeta({
    title: userInfo.value.full_name || 'Hồ sơ nhân sự',
    // header: userInfo.value.full_name || '',
});
const showImageModal = (image, type) => {
    const imageData = {
        src: image,
        title: t(type),
        imageWidth: 1000,
        imageHeight: 600,
    }
    setExpandImageModal(true, imageData);
}

// Status Update State
const selectedStatus = ref(userInfo.value.status || 0)
const statusStartDate = ref(userInfo.value.status_start_date || '')
const statusEndDate = ref(userInfo.value.status_end_date || '')
const isUpdatingStatus = ref(false)

// Status Options
const statusOptions = computed(() => [
    { value: 0, label: t('Working') },
    { value: 1, label: t('Temporary absent') },
    { value: 2, label: t('Resigned') },
    { value: 3, label: t('Providing service') },
    { value: 4, label: t('Pending for recruitment') },
])

// Helper Functions
const getStatusLabel = (status) => {
    const statusMap = {
        0: t('Working'),
        1: t('Temporary absent'),
        2: t('Resigned'),
        3: t('Providing service'),
        4: t('Pending for recruitment'),
    }
    return statusMap[status] || t('Unknown')
}

const getStatusColor = (status) => {
    const colorMap = {
        0: 'green',    // Working
        1: 'yellow',   // Temporary absent
        2: 'red',      // Resigned
        3: 'blue',     // Providing service
        4: 'gray',     // Pending for recruitment
    }
    return colorMap[status] || 'gray'
}

const getStatusDotClass = (status) => {
    const classMap = {
        0: 'bg-green-500',
        1: 'bg-yellow-500',
        2: 'bg-red-500',
        3: 'bg-blue-500',
        4: 'bg-gray-500',
    }
    return classMap[status] || 'bg-gray-500'
}

// Validation
const canUpdateStatus = computed(() => {
    if (!statusStartDate.value) return false
    if (selectedStatus.value === 1 && !statusEndDate.value) return false
    if (selectedStatus.value === 1 && statusEndDate.value && statusStartDate.value) {
        return new Date(statusEndDate.value) > new Date(statusStartDate.value)
    }
    return true
})

// Actions
const updateStatus = async () => {
    if (!canUpdateStatus.value) return

    isUpdatingStatus.value = true
    try {
        const payload = {
            status: selectedStatus.value,
            status_start_date: statusStartDate.value,
            status_end_date: selectedStatus.value === 1 ? statusEndDate.value : null,
        }

        const response = await useAPI().patch(`core/profile_hrs/${userInfo.value.id}/`, payload)

        if (response.status.value === 'success') {
            // Update local data
            userInfo.value.status = selectedStatus.value
            userInfo.value.status_start_date = statusStartDate.value
            userInfo.value.status_end_date = selectedStatus.value === 1 ? statusEndDate.value : null

            // Show success notification
            useToast().add({
                title: t('Success'),
                description: t('Status updated successfully'),
                color: 'green',
            })
        }
    } catch (error) {
        console.error('Error updating status:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to update status'),
            color: 'red',
        })
    } finally {
        isUpdatingStatus.value = false
    }
}

const cancelStatusUpdate = () => {
    // Reset to current values
    selectedStatus.value = userInfo.value.status || 0
    statusStartDate.value = userInfo.value.status_start_date || ''
    statusEndDate.value = userInfo.value.status_end_date || ''
}
</script>