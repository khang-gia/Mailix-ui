<template>
    <div class="px-8 py-2">
        <div class="py-4">
            <h3 class="font-semibold leading-6 text-gray-900 dark:text-white text-2xl">
                {{ $t('Change password') }}
            </h3>
        </div>
        <UCard class="flex flex-col flex-1 font-averta shadow-md" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="w-1/2">
                <UForm :schema="schema" :state="resetPassInfo" class="mx-4 py-2 space-y-8" @submit="onSubmit">
                    <UFormGroup
                        v-slot="{ error }"
                        :error="errors.current_pw"
                        :label="$t('Old password')"
                        name='current_pw'
                        required>
                        <UInput
                            class="w-full"
                            v-model="resetPassInfo.current_pw"
                            :type="shơwOldPassword ? 'text':'password'"
                            :ui="{ base: 'rounded-lg',icon: { trailing: { pointer: '' } }  }">
                            <template #trailing>
                                <UButton type="button" variant="ghost" color="white" @click="shơwOldPassword=!shơwOldPassword" class="text-gray-500 dark:text-gray-500 focus:outline-none hover:dark:bg-white">
                                    <UIcon :name="shơwOldPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5"></UIcon>
                                </UButton>
                            </template>
                        </UInput>
                    </UFormGroup>
                    <UFormGroup
                        v-slot="{ error }"
                        :error="errors.new_pw"
                        :label="$t('New password')"
                        name="new_pw"
                        required>
                        <UInput
                            class="w-full"
                            v-model="resetPassInfo.new_pw"
                            :type="showNewPassword ? 'text':'password'"
                            :ui="{ base: 'rounded-lg' ,icon: { trailing: { pointer: '' } } }">
                            <template #trailing>
                                <UButton type="button" variant="ghost" color="white" @click="showNewPassword=!showNewPassword" class="text-gray-500 dark:text-gray-500 focus:outline-none hover:dark:bg-white">
                                    <UIcon :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5"></UIcon>
                                </UButton>
                            </template>
                        </UInput>
                    </UFormGroup>
                    <!-- <div class="grid grid-flow-row" v-for="check in passwordValidate" :key="check">
                        <span class="flex items-center gap-1 text-sm">
                            <UIcon name="material-symbols:circle" />
                            {{ $t(check) }}
                        </span>
                    </div> -->
                    <UFormGroup
                        v-slot="{ error }"
                        :error="errors.new_pw_confirm"
                        :label="$t('Confirm password')"
                        name="new_pw_confirm"
                        required>
                        <UInput
                            class="w-full"
                            v-model="resetPassInfo.new_pw_confirm"
                            :type="showNewPasswordConfirm ? 'text':'password'"
                            :ui="{ base: 'rounded-lg' ,icon: { trailing: { pointer: '' } } }"
                            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined">
                            <template #trailing>
                                <UButton type="button" variant="ghost" color="white" @click="showNewPasswordConfirm=!showNewPasswordConfirm" class="text-gray-500 dark:text-gray-500 focus:outline-none hover:dark:bg-white">
                                    <UIcon :name="showNewPasswordConfirm ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5"></UIcon>
                                </UButton>
                            </template>
                        </UInput>
                    </UFormGroup>
                    <UButton type="submit" :loading="busy" class="w-full flex items-center justify-center">
                        {{ $t('Change password') }}
                    </UButton>
                </UForm>
            </div>
            
        </UCard>
    </div>
    
</template>
<script setup>
import * as yup from 'yup'
import { useI18n } from "vue-i18n";
const { data: userInfo } = useAuth()

const { t } = useI18n();
definePageMeta({
  title: 'Change password',
  hideTitle: true
})
const showNewPassword = ref(false)
const shơwOldPassword = ref(false)
const showNewPasswordConfirm = ref(false)
const errors = ref({})
const resetPassInfo = ref({
    current_pw: '',
    new_pw: '',
    new_pw_confirm:''
})
const busy = ref(false)
const passwordValidate = [
    'Minimum characters 12',
    'One uppercase character',
    'One lowercase character',
    'One special character',
    'One number'
]
const schema = yup.object({
    current_pw: yup.string().required(t('This field is required')),
    new_pw: yup.string().required(t('This field is required'))
    .min(12, t('Password must be at least 12 characters long'))
    .matches(
        /[a-z]/,
        t('Password must contain at least one lowercase letter')
        // t('Please follow all rules to create safe password')
    )
    .matches(
        /[A-Z]/,
        t('Password must contain at least one uppercase letter')
        // t('Please follow all rules to create safe password')
    )
    .matches(
        /\d/, // \d is a shorthand for [0-9]
       t('Password must contain at least one number')
        // t('Please follow all rules to create safe password')
    )
    .matches(
        /[!@#$%^&*(),.?":{}|<>]/, // Common special characters
        t('Password must contain at least one special character')
        // t('Please follow all rules to create safe password')
    ),
    new_pw_confirm: yup.string()
        .oneOf([yup.ref('new_pw'), null], t('Passwords must match'))
        .required(t('This field is required'))
})
const changePassword = async () => {
    const credData = {
        new_password : resetPassInfo.value.new_pw,
        old_password: resetPassInfo.value.current_pw,
        username : userInfo.value.username
    }
    try {
        const {data: response, error: errorVal} = await useAPI().post('/auth/change_password/', credData)
        console.log('response', response.value)
        if (response.value && response.value.id) {
            return true;
        } 
        if (errorVal.value && (errorVal.value.statusCode === 400 || errorVal.value.statusCode === 401) && errorVal.value.data) {
            const errorData = errorVal.value.data.detail;
            console.log('errorData',errorData)
            throw new Error(t(errorData));
        }
        else {
            throw new Error(t('Unexpected response status'));
        }
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
} 
const validateSchema = async () => {
    try {
        await schema.validate(resetPassInfo.value, { abortEarly: false });
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
    if (!isValid) return;
    try {
        busy.value = true;
        const isSuccess = await changePassword()
        if (isSuccess) {
            useToast().add({
                title: t('Success'),
                description: t('Your password was successfully changed.'),
                icon: 'i-heroicons-check-circle',
                color: 'green',
                duration: 5000,
                position: 'top-right',
            });
            window.location.reload()
        }
    } catch (error) {
        useToast().add({
            title: t('Error'),
            description: error.message || t('An error occurred while process to change the password. Please try again later.'),
            icon: 'i-heroicons-exclamation-circle',
            color: 'red',
            duration: 7000,
            position: 'top-right',
        });
    } finally {
        busy.value = false;
    }
}
</script>