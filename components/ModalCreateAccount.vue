<template>
    <BaseModal :title="$t('Create account')" :modalOpen="createAccountModal" :closeOnClick="false" :closeOnEsc="true" @close-modal="setCreateAccountModal(false, {})">
        <UForm :schema="schema" :state="userInfo" class="mx-4 py-2 space-y-4">
            <UFormGroup
                v-slot="{ error }"
                :label="$t('Username')"
                name="username"
                :error="errors.username"
                required>
                <UInput
                    v-model="userInfo.username"
                    :placeholder="$t('Username')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-slot="{ error }"
                :label="$t('Email')"
                name="email"
                :error="errors.email"
                required>
                <UInput
                    v-model="userInfo.email"
                    :placeholder="$t('Email')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-slot="{ error }"
                :label="$t('Password')"
                name="password"
                :error="errors.password"
                required>
                <UInput
                    v-model="userInfo.password"
                    type="password"
                    :placeholder="$t('Password')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-slot="{ error }"
                :label="$t('Confirm password')"
                name="confirm_password"
                :error="errors.confirm_password"
                required>
                <UInput
                    v-model="userInfo.confirm_password"
                    type="password"
                    :placeholder="$t('Confirm password')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
        </UForm>
        <div class="flex justify-end gap-2 p-4">
            <UButton color="gray" variant="outline" @click="setCreateAccountModal(false, {})">{{ $t('Cancel') }}</UButton>
            <UButton color="primary" @click="onSubmit">{{ $t('Create') }}</UButton>
        </div>
    </BaseModal>
</template>

<script setup>
    import * as yup from 'yup'
    import { useI18n } from "vue-i18n";
    const { t } = useI18n();
    import { useModalStore } from '@/stores/modal'
    import { storeToRefs } from 'pinia'
    const modalStore = useModalStore()
    const { createAccountModal, accountData } = storeToRefs(modalStore)
    const { setCreateAccountModal } = modalStore

    const props = defineProps(['id'])
    const emit = defineEmits(['close-modal', 'change-mode'])
    const userInfo = ref({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        phone: '',
    })
    const errors = ref({})
    const schema = yup.object({
        username: yup.string().required(t('This field is required')),
        email: yup.string().email(t('Invalid email format')).required(t('This field is required')),
        password: yup.string().min(6, t('Password must be at least 6 characters')).required(t('This field is required')),
        confirm_password: yup.string()
            .oneOf([yup.ref('password'), null], t('Passwords must match'))
            .required(t('This field is required')),
    })
    const createAccount = async () => {
        console.log('create account Data', userInfo.value)
        try {
            const {data: response} = await useAPI().post(`core/profile_hrs/${useRoute().params.id}/create_account/`, {
                username: userInfo.value.username,
                email: userInfo.value.email,
                password: userInfo.value.password,
                phone: userInfo.value.phone,
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
            await schema.validate(userInfo.value, { abortEarly: false });
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
        console.log('isValid',isValid)
        if (!isValid) return;
        try {
            busy.value = true;
            const isCreated = await createAccount();
            if (isCreated) {
                useToast().add({
                    title: t('Success'),
                    description: t('The system account was successfully created.'),
                    icon: 'i-heroicons-check-circle',
                    color: 'green',
                    duration: 5000,
                    position: 'top-right',
                });
                useRouter().push({ name: 'hr' });
            }
        } catch (error) {
            useToast().add({
                title: t('Error'),
                description: error.message || t('An error occurred while creating the account. Please try again later.'),
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
