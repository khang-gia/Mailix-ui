<template>
    <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-4xl' }">
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: { padding: 'p-0' }
        }" class="font-averta">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ $t('Create work') }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
                </div>
            </template>

            <!-- Work Creation Form -->
            <div class="p-6 max-h-[70vh] overflow-y-auto">
                <UForm :schema="schema" :state="workInfo" class="grid grid-cols-2 gap-4">
                    <UFormGroup v-slot="{ error }" :label="$t('Work Name')" name="name" :error="errors.name" required>
                        <UInput v-model="workInfo.name" :placeholder="$t('Work Name')"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                    </UFormGroup>

                    <UFormGroup v-slot="{ error }" :label="$t('Work Code')" name="code" :error="errors.code">
                        <UInput v-model="workInfo.code" :placeholder="$t('Work Code')"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                    </UFormGroup>

                    <UFormGroup :label="$t('Work assigned to')" name="assigned_to">
                        <CustomerUserSelect v-model="workInfo.assigned_to" :placeholder="$t('Work assigned to')"
                            :multiple="true" />
                    </UFormGroup>

                    <UFormGroup :label="$t('Work assigned by')" name="assigned_by">
                        <CustomerUserSelect v-model="workInfo.assigned_by" :placeholder="$t('Work assigned by')"
                            :multiple="true" />
                    </UFormGroup>

                    <!-- <UFormGroup :label="$t('Status')" name="status">
                        <USelectMenu class="w-full" v-model="workInfo.status" :options="statuses"
                            :placeholder="$t('Status')" valueAttribute="value" option-attribute="label" />
                    </UFormGroup> -->

                    <UFormGroup :label="$t('Start date')" name='start_date'>
                        <BaseDatePicker v-model="workInfo.start_date" class="w-full" buttonType="outline"
                            :place-holder="$t('Start date')" />
                    </UFormGroup>

                    <UFormGroup :label="$t('End date')" name='end_date'>
                        <BaseDatePicker v-model="workInfo.end_date" class="w-full" buttonType="outline"
                            :place-holder="$t('End date')" />
                    </UFormGroup>
                    <UFormGroup :label="$t('Priority')" name="priority">
                        <USelectMenu class="w-full" v-model="workInfo.priority" :options="priorities"
                            :placeholder="$t('Priority')" valueAttribute="value" option-attribute="label" />
                    </UFormGroup>
                    <UFormGroup :label="$t('Description')" class="col-span-2">
                        <UTextarea v-model="workInfo.description" :placeholder="$t('Add work description...')"
                            :rows="3" />
                    </UFormGroup>
                </UForm>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="gray" variant="ghost" @click="closeModal">
                        {{ $t('Cancel') }}
                    </UButton>
                    <UButton color="primary" @click="onSubmit" :loading="busy">
                        {{ $t('Save') }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import * as yup from 'yup'
const { t } = useI18n();
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { workKanbanModal, workKanbanInitialStatus } = storeToRefs(modalStore)
const { setWorkKanbanModal } = modalStore

const { data: userInfo } = useAuth()
const busy = ref(false)
const errors = ref({})

// Emit to notify parent component of new item
const emit = defineEmits(['workCreated'])

// Computed property to control modal visibility
const isOpen = computed({
    get: () => workKanbanModal.value,
    set: (value) => {
        if (!value) {
            setWorkKanbanModal(false, 1)
        }
    }
})

const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    code: yup.string()
        .test('check-work-code-exists', t('Work code already exists'), async (value) => {
            if (!value) return true;
            try {
                const { data: exists } = await useAPI().get('core/works/', { code: value });
                return exists.value.results.length == 0;
            } catch (error) {
                console.error('Error checking work code:', error);
                return false;
            }
        }),
})

const priorities = [
    { label: t('Low'), value: 1 },
    { label: t('Medium'), value: 2 },
    { label: t('High'), value: 3 },
    { label: t('Urgent'), value: 4 },
    { label: t('Critical'), value: 5 },
]

const statuses = [
    { label: t('Not Started'), value: 1 },
    { label: t('Backlog'), value: 2 },
    { label: t('Todo'), value: 3 },
    { label: t('In Progress'), value: 4 },
    { label: t('Completed'), value: 5 },
    { label: t('On Hold'), value: 6 },
    { label: t('Cancelled'), value: 7 },
]

const defaultWorkInfo = {
    name: '',
    code: '',
    assigned_to: [],
    assigned_by: [],
    status: 1,
    priority: 2,
    start_date: '',
    end_date: '',
    description: '',
    created_by: userInfo.value.id,
}

const workInfo = ref({ ...defaultWorkInfo })

// Watch for modal open and reset form with initial status
watch(workKanbanModal, (isOpen) => {
    if (isOpen) {
        workInfo.value = {
            ...defaultWorkInfo,
            status: workKanbanInitialStatus.value
        }
        errors.value = {}
    }
})

const closeModal = () => {
    setWorkKanbanModal(false, 1)
    workInfo.value = { ...defaultWorkInfo }
    errors.value = {}
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

const formatData = () => {
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
        } else if (['start_date', 'end_date'].includes(key)) {
            formattedData[key] = useDayjs()(value).format('YYYY-MM-DD');
        } else {
            formattedData[key] = value;
        }
    });
    return formattedData;
};

const onSubmit = async () => {
    const isValid = await validateSchema();
    if (!isValid) return;

    try {
        busy.value = true;
        const profileData = formatData()
        const { data: response } = await useAPI().post(`core/works/`, profileData);

        if (response.value && response.value.id) {
            useToast().add({
                title: t('Success'),
                description: t('The work was successfully created.'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
            });

            // Emit only the work ID to parent
            emit('workCreated', response.value.id)

            closeModal()
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while creating the work.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
        });
    } finally {
        busy.value = false;
    }
};
</script>
