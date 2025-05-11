<template>
    <div class="flex w-full">
        <div class="m-4 w-4/6 space-y-4">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200">
                            {{$t('Personal Information')}}
                        </h3>
                        <div class="">
                            
                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-2 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Ethnicity')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.ethnicity? userInfo.ethnicity:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Religion')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.religion? userInfo.religion:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Nationality')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.nationality? userInfo.nationality:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Employee Code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.employee_code? userInfo.employee_code:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Profile code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.profile_code? userInfo.profile_code:'--' }}
                        </p>
                    </div>
                    
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Pob')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.pob? userInfo.pob:'--' }}
                        </p>
                    </div>
                    
                    
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Personal tax code')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.tax_code? userInfo.tax_code:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Education level')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.educaional_level? userInfo.educaional_level:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Highest Professional Qualification')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.highest_qualification? userInfo.highest_qualification:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Years of experience')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.years_of_experience? userInfo.years_of_experience:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Direct manager')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                              <NuxtLink 
                                v-if="userInfo.direct_manager" 
                                :to="`/hr/${userInfo.direct_manager.id}`"
                                class="text-blue-500 hover:underline"
                            >
                                {{ userInfo.direct_manager.full_name }}
                            </NuxtLink>
                            <span v-else>
                                {{ userInfo.direct_manager? userInfo.direct_manager.full_name:'--' }}
                            </span>
                        </p>
                    </div>
                    
                    
                </div>
            </UCard>
            
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-md font-semibold text-gray-700 dark:text-gray-200">
                            {{$t('Id Card Information')}}
                        </h3>
                        <div class="">
                            
                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-3 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Id no')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.id_number? userInfo.id_number:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Date of issue')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.date_of_issue? userInfo.date_of_issue:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Place of issue')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.place_of_issue? userInfo.place_of_issue:'--' }}
                        </p>
                    </div>
                    <div class="col-span-3 grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Front id card')}}</label>
                            <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <img 
                                    v-if="userInfo.front_id_card" 
                                    :src="userInfo.front_id_card" 
                                    alt="Front ID Card" 
                                    class="object-cover w-full h-full cursor-pointer"
                                    @click="showImageModal(userInfo.front_id_card, 'Front id card')"
                                />
                                <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Back id card')}}</label>
                            <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <img 
                                    v-if="userInfo.back_id_card" 
                                    :src="userInfo.back_id_card" 
                                    alt="Back ID Card" 
                                    class="object-cover w-full h-full cursor-pointer"
                                    @click="showImageModal(userInfo.back_id_card, 'Back id card')"
                                />
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
                            {{$t('Job')}}
                        </h3>
                        <div class="">
                            
                        </div>
                    </div>
                </template>
                <div class="grid grid-cols-2 gap-8">
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Department')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.department ? userInfo.department.name : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Title')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.title ? userInfo.title_name : '--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Join date')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.join_date? userInfo.join_date:'--' }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Actual sign date')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.actual_sign_date? userInfo.actual_sign_date:'--' }}
                        </p>
                    </div>
                    
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Type of labour')}}</label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ userInfo.type_of_labor_name? $t(userInfo.type_of_labor_name):'--' }}
                        </p>
                    </div>
                </div>
            </UCard>
        </div>

        <UCard class="my-4 mr-4 w-2/6">
            <div class="h-full -m-2">
                <div class="rounded-lg w-full h-1/2 bg-blue-100 flex items-center py-16">
                    <div class="flex flex-col items-center">
                        <img 
                            :src="userInfo.avatar ? userInfo.avatar : '/images/default-user-img.png'" 
                            alt="Avatar" 
                            class="border-4 border-white w-1/2 h-1/2 rounded-full "
                        />
                        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-200 p-2">
                            {{ userInfo.full_name }} 
                        </h3>
                        <p class=" text-gray-600 dark:text-gray-400 px-2">
                            {{userInfo.title? userInfo.title_name:''  }} {{ userInfo.department? '- ' + userInfo.department.name:'' }}
                        </p>
                        <UBadge v-if="userInfo.status" class="mt-2" color="primary" variant="solid">{{$t(userInfo.status) }}</UBadge>
                    </div>
                    
                </div>
                <div class="space-y-10 pt-6">
                    <div class="flex gap-2">
                        <UBadge
                            icon="icons8:gender"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Gender')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.gender? userInfo.gender:'--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="i-heroicons-calendar"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Dob')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.dob ? userInfo.dob : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="i-heroicons-envelope"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />    
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Email')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.email ? userInfo.email : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="i-heroicons-phone"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"
                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Phone')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.phone ? userInfo.phone : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="ph:phone-plus"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Phone other')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.phone_other ? userInfo.phone_other : '--' }}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <UBadge
                            icon="ic:outline-place"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Place of origin')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.place_of_origin? userInfo.place_of_origin:'--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="tabler:address-book"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Permanent address')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.permanent_address ? userInfo.permanent_address : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="carbon:location-current"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Current address')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.current_address ? userInfo.current_address : '--' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <UBadge
                            icon="mingcute:love-line"
                            size="md"
                            color="blue"
                            variant="soft"
                            class="my-1"

                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{$t('Marital Status')}}</label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ userInfo.marital_status? $t(userInfo.marital_status):'--' }}
                            </p>
                        </div>
                    </div>  
                    
                </div>
            </div>
            
                    

        </UCard>
        
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setExpandImageModal } = modalStore
const props = defineProps({
    userInfo: {
        type: Boolean,
        default: false
    }
})

const showImageModal = (image, type) => {
    const imageData = {
        src: image,
        title: t(type),
        imageWidth: 1000,
        imageHeight: 600,
    }
    setExpandImageModal(true, imageData);
}
</script>