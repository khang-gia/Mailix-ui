<template>
    <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-2xl' }">
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            body: { padding: 'p-0' }
        }" class="font-averta">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ $t('Create Contact') }}
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
                </div>
            </template>

            <!-- Contact Creation Form -->
            <div class="p-6 max-h-[70vh] overflow-y-auto">
                <UForm :schema="schema" :state="contactInfo" class="grid grid-cols-2 gap-4">
                    <UFormGroup v-slot="{ error }" :label="$t('Full Name')" name="name" :error="errors.name" required class="col-span-2">
                        <UInput v-model="contactInfo.name" :placeholder="$t('Full Name')"
                            :ui="{ base: 'w-full rounded-lg' }"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                    </UFormGroup>

                    <UFormGroup v-slot="{ error }" :label="$t('Phone')" name="phone" :error="errors.phone">
                        <UInput v-model="contactInfo.phone" :placeholder="$t('Phone')"
                            :ui="{ base: 'w-full rounded-lg' }"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                    </UFormGroup>

                    <UFormGroup v-slot="{ error }" :label="$t('Email')" name="email" :error="errors.email">
                        <UInput v-model="contactInfo.email" :placeholder="$t('Email')" type="email"
                            :ui="{ base: 'w-full rounded-lg' }"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
                    </UFormGroup>

                    <UFormGroup :label="$t('Status')" name="status" class="col-span-2">
                        <USelectMenu class="w-full" v-model="contactInfo.status" :options="statusOptions"
                            value-attribute="value" option-attribute="label"
                            :placeholder="$t('Select status')" />
                    </UFormGroup>

                    <UFormGroup :label="$t('Note')" class="col-span-2">
                        <UTextarea v-model="contactInfo.note" :placeholder="$t('Add note...')"
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
const { contactKanbanModal, contactKanbanInitialStatus } = storeToRefs(modalStore)
const { setContactKanbanModal } = modalStore

const busy = ref(false)
const errors = ref({})

// Emit to notify parent component of new contact
const emit = defineEmits(['contactCreated'])

// Computed property to control modal visibility
const isOpen = computed({
    get: () => contactKanbanModal.value,
    set: (value) => {
        if (!value) {
            setContactKanbanModal(false)
        }
    }
})

const schema = yup.object({
    name: yup.string().required(t('This field is required')),
    phone: yup.string(),
    email: yup.string().email(t('Invalid email format')),
})

const statusOptions = [
    { value: 1, label: t('New') },
    { value: 2, label: t('1st Contacted') },
    { value: 3, label: t('2nd Contacted') },
    { value: 4, label: t('Consulting') },
    { value: 5, label: t('Negotiating') },
    { value: 6, label: t('Contracted') },
    { value: 7, label: t('Quoted') },
    { value: 8, label: t('Old Customer') },
]

const defaultContactInfo = {
    name: '',
    phone: '',
    email: '',
    status: 1,
    note: '',
}

const contactInfo = ref({ ...defaultContactInfo })

// Watch for modal open and reset form with initial status
watch(contactKanbanModal, (isOpen) => {
    if (isOpen) {
        contactInfo.value = {
            ...defaultContactInfo,
            status: contactKanbanInitialStatus.value
        }
        errors.value = {}
    }
})

const closeModal = () => {
    setContactKanbanModal(false)
    contactInfo.value = { ...defaultContactInfo }
    errors.value = {}
}

const validateSchema = async () => {
    try {
        await schema.validate(contactInfo.value, { abortEarly: false })
        errors.value = {}
        return true
    } catch (err) {
        const validationErrors = {}
        err.inner.forEach(error => {
            validationErrors[error.path] = error.message
        })
        errors.value = validationErrors
        return false
    }
}

const onSubmit = async () => {
    const isValid = await validateSchema()
    if (!isValid) {
        useToast().add({
            title: t('Validation Error'),
            description: t('Please check the form for errors'),
            color: 'red',
        })
        return
    }

    busy.value = true
    try {
        const { data, error } = await useAPI().post('core/customers/', contactInfo.value)

        if (error.value) {
            throw new Error(error.value)
        }

        if (data.value) {
            useToast().add({
                title: t('Success'),
                description: t('Contact created successfully'),
                icon: 'i-heroicons-check-circle',
                color: 'green'
            })

            // Emit event to refresh contacts
            emit('contactCreated', data.value)

            closeModal()
        }
    } catch (error) {
        console.error('Failed to create contact:', error)
        useToast().add({
            title: t('Error'),
            description: t('Failed to create contact'),
            icon: 'i-heroicons-x-circle',
            color: 'red'
        })
    } finally {
        busy.value = false
    }
}
</script>
