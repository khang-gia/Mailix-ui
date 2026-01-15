<template>
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
        <UCard class="font-averta">
            <template #header>
                <h3 class="text-lg font-semibold">{{ $t('Change Password') }}</h3>
            </template>

            <UForm :schema="schema" :state="formState" class="space-y-4" @submit="handleSubmit">
                <UFormGroup v-slot="{ error }" :error="errors.new_password" :label="$t('New Password')"
                    name="new_password" required>
                    <UInput v-model="formState.new_password" :type="showNewPassword ? 'text' : 'password'"
                        :placeholder="$t('Enter new password')" autocomplete="new-password"
                        :ui="{ icon: { trailing: { pointer: '' } } }">
                        <template #trailing>
                            <UButton type="button" variant="ghost" color="white"
                                @click="showNewPassword = !showNewPassword"
                                class="text-gray-500 dark:text-gray-500 focus:outline-none hover:dark:bg-white">
                                <UIcon :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                                    class="w-5 h-5" />
                            </UButton>
                        </template>
                    </UInput>
                </UFormGroup>

                <UFormGroup v-slot="{ error }" :error="errors.confirm_password" :label="$t('Confirm Password')"
                    name="confirm_password" required>
                    <UInput v-model="formState.confirm_password" :type="showConfirmPassword ? 'text' : 'password'"
                        :placeholder="$t('Confirm new password')" autocomplete="new-password"
                        :ui="{ icon: { trailing: { pointer: '' } } }">
                        <template #trailing>
                            <UButton type="button" variant="ghost" color="white"
                                @click="showConfirmPassword = !showConfirmPassword"
                                class="text-gray-500 dark:text-gray-500 focus:outline-none hover:dark:bg-white">
                                <UIcon :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                                    class="w-5 h-5" />
                            </UButton>
                        </template>
                    </UInput>
                </UFormGroup>
            </UForm>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton :label="$t('Cancel')" color="gray" variant="ghost" @click="handleCancel" />
                    <UButton :label="$t('Change Password')" color="primary" @click="handleSubmit" />
                </div>
            </template>
        </UCard>
    </UModal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

const { t } = useI18n()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})

const formState = ref({
    new_password: '',
    confirm_password: ''
})

// Password validation schema matching change-password page
const schema = yup.object({
    new_password: yup.string()
        .required(t('This field is required'))
        .min(12, t('Password must be at least 12 characters long'))
        .matches(
            /[a-z]/,
            t('Password must contain at least one lowercase letter')
        )
        .matches(
            /[A-Z]/,
            t('Password must contain at least one uppercase letter')
        )
        .matches(
            /\d/,
            t('Password must contain at least one number')
        )
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            t('Password must contain at least one special character')
        ),
    confirm_password: yup.string()
        .oneOf([yup.ref('new_password'), null], t('Passwords must match'))
        .required(t('This field is required'))
})

// Reset form when modal opens
watch(isOpen, (value) => {
    if (value) {
        formState.value = {
            new_password: '',
            confirm_password: ''
        }
        errors.value = {}
        showNewPassword.value = false
        showConfirmPassword.value = false
    }
})

const validateSchema = async () => {
    try {
        await schema.validate(formState.value, { abortEarly: false })
        errors.value = {}
        return true
    } catch (validationError) {
        const validationErrors = {}
        validationError.inner.forEach((err) => {
            validationErrors[err.path] = err.message
        })
        errors.value = validationErrors
        return false
    }
}

const handleCancel = () => {
    isOpen.value = false
}

const handleSubmit = async () => {
    const isValid = await validateSchema()

    if (!isValid) {
        return
    }

    emit('submit', {
        userId: props.userId,
        newPassword: formState.value.new_password
    })
}
</script>
