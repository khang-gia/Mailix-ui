<template>
    <BaseModal size="md" :modalOpen="calendarCreateModal" :closeOnClick="false" :closeOnEsc="true" @close-modal="onCloseModal">
        <UForm :schema="schema" :state="eventInfo" class="mx-4 py-2 space-y-4">
            <UFormGroup
                v-if="checkView('title')"
                v-slot="{ error }"
                name="title"
                :error="errors.title"
                required>
                <UInput
                    variant="none"
                    size="xl"
                    v-model="eventInfo.title"
                    :placeholder="$t('Add calendar title')"
                    :ui="{ base: 'w-full forcus:ring-0 border-b', rounded:'rounded-none', variant:{ none: 'forcus:ring-0'}}"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            
            <div class="space-y-6">
                <UButton v-if="!expandDateConfig" variant="soft" color="gray" size="lg" @click="expandDateConfig = true">
                    <!-- {{ eventInfo.start_datetime  +' - '+ eventInfo.end_datetime }} -->
                      {{ calendarCreateInfo.startStr +' - '+ calendarCreateInfo.endStr }}
                </UButton>
                <div v-else class="space-y-2">
                    <div class="flex space-x-2">
                        <BaseDatePicker
                            v-model="eventInfo.start_datetime"
                            ref="startdatepicker"
                            :required="true"
                            class="w-full"
                            buttonType="outline"
                        />
                        <Timepicker v-if="!eventInfo.is_all_day" v-model="eventInfo.start_time"/>
                        <span class="py-2 px-2">
                            <UIcon name="fluent:subtract-24-filled"/>
                        </span>
                        <Timepicker v-if="!eventInfo.is_all_day" v-model="eventInfo.end_time"/>
                        <BaseDatePicker
                            v-model="eventInfo.end_datetime"
                            ref="enddatepicker"
                            :required="true"
                            class="w-full"
                            buttonType="outline"
                        />
                    </div>
                    <div class="space-x-4 flex items-center">
                        <UToggle v-model="eventInfo.is_all_day" color="blue"/>
                        <span>{{ $t('All day') }}</span>
                    </div>
                </div>
                <CustomerUserSelect v-model="eventInfo.participants" :placeholder="$t('Participants')" :multiple="true"/>
                <UDivider/>
                <UTextarea
                    v-model="eventInfo.description"
                    :placeholder="$t('Description')"
                    rows="1"
                    resize
                />
            </div>
        </UForm>
        <div class="flex justify-end gap-2 p-4">
            <UButton color="gray" variant="outline" @click="setCalendarCreateModal(false, '', {})">{{ $t('Cancel') }}</UButton>
            <UButton color="primary" @click="onSubmit">{{ $t('Save') }}</UButton>
        </div>
    </BaseModal>
    
</template>

<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const colorMode = useColorMode()
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
const modalStore = useModalStore()
const { calendarCreateModal, calendarCreateType, calendarCreateInfo } = storeToRefs(modalStore)
const { setCalendarCreateModal } = modalStore
const busy= ref(false)
const props = defineProps(['id'])
const emit = defineEmits(['close-modal', 'change-mode'])
const viewAllow = ref({
    schedules:['title','password','confirm_password','email','phone'],
    department:['name','code','description','parent','department_type', 'company', 'business_unit'],
})
const checkView = (key) => {
    return viewAllow.value[calendarCreateType.value]?.includes(key);

}
const expandDateConfig = ref(false)
const eventInfo = computed(() => ({
    name:'',
    title: calendarCreateInfo.value.title,
    start_time:'00:00',
    end_time:'00:00',
    start_datetime: calendarCreateInfo.value.start,
    end_datetime: calendarCreateInfo.value.end,
    is_all_day: true,
    participants:[],
    password: '',
    confirm_password: '',
    email: '',
    phone: '',
    description: '',
    department_type: '',
}))
const onCloseModal = () => {
    expandDateConfig.value = false
    setCalendarCreateModal(false, '', {})

}
const department_types = [
    {label: t('Company branch'), value: 1},
    {label: t('Department'), value: 2},
]
const errors = ref({})
const schema = yup.object({
    // title: checkView('title') ? yup.string().required(t('This field is required')) : yup.mixed().notRequired(),
    email: checkView('email') ? yup.string().email(t('Invalid email format')).required(t('This field is required')) : yup.mixed().notRequired(),
})
const createAccount = async () => {
    console.log('create account Data', eventInfo.value)
    try {
        const {data: response} = await useAPI().post(`core/profile_hrs/${useRoute().params.id}/create_account/`, {
            name: eventInfo.value.name,
            code: eventInfo.value.code,
            description: eventInfo.value.description,
        });
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
const createTitle = async () => {
    console.log('create title Data', eventInfo.value)
    try {
        const {data: response} = await useAPI().post(`core/titles/`, {
            name: eventInfo.value.name,
            code: eventInfo.value.code,
            description: eventInfo.value.description,
        });
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
const createDepartment= async () => {
    console.log('create department Data', eventInfo.value)
    try {
        const {data: response} = await useAPI().post(`system/departments/`, {
            name: eventInfo.value.name,
            code: eventInfo.value.code,
            description: eventInfo.value.description,
            department_type: eventInfo.value.department_type,

        });
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}
const validateForm = async () => {
    try {
        await schema.validate(eventInfo.value, { abortEarly: false });
        errors.value = {};
        return true;
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            errors.value = {};
            err.inner.forEach(error => {
                errors.value[error.path] = error.message;
            });
        } else {
            console.error(err);
        }
        return false;
    }
}
const onSubmit = async () => {
    const isValid = await validateForm(); 
    console.log('isValid', isValid);
    if (!isValid) return;
    try {
        busy.value = true;
        let isCreated = false;

        if (calendarCreateType.value === 'account') {
            isCreated = await createAccount();
        } else if (calendarCreateType.value === 'title') {
            isCreated = await createTitle();
        } else if (calendarCreateType.value === 'department') {
            isCreated = await createDepartment();
        }

        if (isCreated) {
            useToast().add({
                title: t('Success'),
                description: t('The entity was successfully created.'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
                duration: 5000,
                position: 'top-right',
            });
            setCalendarCreateModal(false, '', {});
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while creating the entity. Please try again later.'),
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
