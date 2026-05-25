<template>
    <BaseModal :title="$t('Change Email')" :modalOpen="modelValue" :closeOnClick="false"
        :closeOnEsc="true" @close-modal="$emit('update:modelValue', false)">
        <div class="mx-4 py-2 space-y-4">
            <UFormGroup :label="$t('New Company Email')" name="new_email" :error="errors.new_email" required>
                <UInput v-model="form.new_email" :placeholder="$t('New Company Email')"
                    :ui="{ base: 'w-full rounded-lg' }" />
            </UFormGroup>

            <UFormGroup :label="$t('Current Password')" name="current_password" :error="errors.current_password" required>
                <UInput v-model="form.current_password" type="password" :placeholder="$t('Current Password')"
                    :ui="{ base: 'w-full rounded-lg' }" />
            </UFormGroup>

            <!-- Info note -->
            <div class="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 mt-0.5 shrink-0" />
                <span>{{ $t('change_email_warning') }}</span>
            </div>
        </div>

        <div class="flex justify-end gap-2 p-4">
            <UButton color="gray" variant="outline" @click="$emit('update:modelValue', false)">
                {{ $t('Cancel') }}
            </UButton>
            <UButton color="primary" :loading="busy" :disabled="!isFormValid || busy" @click="onSubmit">
                {{ $t('Change') }}
            </UButton>
        </div>
    </BaseModal>
</template>

<script setup>
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const props = defineProps({
    modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'email-changed'])

const busy = ref(false)

const form = ref({
    new_email: '',
    current_password: '',
})

const errors = ref({})

// Reset form whenever modal opens
watch(() => props.modelValue, (val) => {
    if (val) {
        form.value.new_email = ''
        form.value.current_password = ''
        errors.value = {}
    }
})

const schema = yup.object({
    new_email: yup.string()
        .email(t('Invalid email format'))
        .required(t('This field is required')),
    current_password: yup.string()
        .min(1, t('This field is required'))
        .required(t('This field is required')),
})

const isFormValid = computed(() => {
    try {
        schema.validateSync(form.value, { abortEarly: false })
        return true
    } catch {
        return false
    }
})

const validateForm = async () => {
    try {
        await schema.validate(form.value, { abortEarly: false })
        errors.value = {}
        return true
    } catch (validationError) {
        const errs = {}
        validationError.inner.forEach((err) => {
            errs[err.path] = err.message
        })
        errors.value = errs
        return false
    }
}

const onSubmit = async () => {
    const isValid = await validateForm()
    if (!isValid) return

    try {
        busy.value = true
        const { data: response, error: errorVal } = await useAPI().post(
            `core/profile_hrs/${route.params.id}/change_email/`,
            {
                new_email: form.value.new_email,
                current_password: form.value.current_password,
            }
        )

        if (response.value?.new_email) {
            useToast().add({
                title: t('Success'),
                description: t('Email changed successfully'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
                duration: 5000,
                position: 'top-right',
            })
            emit('email-changed', response.value.new_email)
            emit('update:modelValue', false)
            return
        }

        const detail = errorVal.value?.data?.detail
        throw new Error(detail || t('Failed to change email.'))
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('Failed to change email.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        })
    } finally {
        busy.value = false
    }
}
</script>
