<template>
    <BaseModal :title="$t('Create') + ' ' + $t(modalCreateType)" :modalOpen="createModal" :closeOnClick="false" :closeOnEsc="true" @close-modal="setCreateModal(false, '')">
        <UForm :schema="schema" :state="entityInfo" class="mx-4 py-2 space-y-4">
            <UFormGroup
                v-if="checkView('username')"
                v-slot="{ error }"
                :label="$t('Username')"
                name="username"
                :error="errors.username"
                required>
                <UInput
                    v-model="entityInfo.username"
                    :placeholder="$t('Username')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-if="checkView('email')"
                v-slot="{ error }"
                :label="$t('Email')"
                name="email"
                :error="errors.email"
                required>
                <UInput
                    v-model="entityInfo.email"
                    :placeholder="$t('Email')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-if="checkView('personal_email')"
                v-slot="{ error }"
                :label="$t('Authentication Email')"
                name="personal_email"
                :error="errors.personal_email"
                required>
                <UInput
                    v-model="entityInfo.personal_email"
                    :placeholder="$t('Authentication Email')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-if="checkView('password')"
                v-slot="{ error }"
                :label="$t('Password')"
                name="password"
                :error="errors.password"
                required>
                <UInput
                    v-model="entityInfo.password"
                    disabled
                    type="password"
                    :placeholder="$t('Password')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <!-- <UFormGroup
                v-if="checkView('confirm_password')"
                v-slot="{ error }"
                :label="$t('Confirm password')"
                name="confirm_password"
                :error="errors.confirm_password"
                required>
                <UInput
                    v-model="entityInfo.confirm_password"
                    type="password"
                    :placeholder="$t('Confirm password')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup> -->
            <UFormGroup
                v-if="checkView('name')"
                v-slot="{ error }"
                :label="$t('Name')"
                name="name"
                :error="errors.name"
                required>
                <UInput
                    v-model="entityInfo.name"
                    :placeholder="$t('Name')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-if="checkView('code')"
                v-slot="{ error }"
                :label="$t('Code')"
                name="code"
                :error="errors.code">
                <UInput
                    v-model="entityInfo.code"
                    :placeholder="$t('Code')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
            </UFormGroup>
            <UFormGroup
                v-if="checkView('description')"
                v-slot="{ error }"
                :label="$t('Description')"
                name="description"
                :error="errors.description">
                <UTextarea
                    v-model="entityInfo.description"
                    :placeholder="$t('Description')"
                    :ui="{ base: 'w-full rounded-lg' }"
                    rows="1"
                    resize
                />
            </UFormGroup>
            <UFormGroup
                    v-if="checkView('department_type')"
                    :label="$t('Department type')"
                    name="department_type">
                    <USelectMenu
                        class="w-full"
                        v-model="entityInfo.department_type"
                        :options="department_types"
                        :placeholder="$t('Department type')"
                        valueAttribute="value"
                        option-attribute="label"
                        :is-dark="colorMode.value === 'dark'"
                    />
                </UFormGroup>
        </UForm>
        <div class="flex justify-end gap-2 p-4">
            <UButton color="gray" variant="outline" @click="setCreateModal(false, '')">{{ $t('Cancel') }}</UButton>
            <UButton color="primary" @click="onSubmit">{{ $t('Create') }}</UButton>
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
    const { createModal, modalCreateType } = storeToRefs(modalStore)
    const { setCreateModal } = modalStore
    const busy= ref(false)
    const props = defineProps(['id'])
    const emit = defineEmits(['close-modal', 'change-mode'])

    // const modalTypeMapping = ref([
    //     'account','title','department'
    // ])
    const viewAllow = ref({
        account:['username','password','email','phone','personal_email'],
        title:['name','code','description'],
        department:['name','code','description','parent','department_type', 'company', 'business_unit'],
    })
    const checkView = (key) => {
        return viewAllow.value[modalCreateType.value]?.includes(key);

    }
    const normalizeName = (name) => {
        const nameAscii = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
        const parts = nameAscii.toLowerCase().split(/\s+/);
        if (parts.length < 2) return nameAscii.toLowerCase(); // fallback for single word
        
        const initials = parts.slice(0, -1).map(word => word[0]).join("");
        return initials + parts[parts.length - 1];
    }
    const defaultEmail = async() => {
        const userData = await useAPI().get(`core/profile_hrs/${useRoute().params.id}/`);
        const userInfo = userData.data.value;
        console.log('userInfo', userInfo);
        // Generate a default email based on the user's name + dob with @imap.mailix.vn domain ex: Nguyễn Trần Gia Khiêng , dob is 2109-> ntgkhieng0921@imap.mailix.vn
        if (userInfo && userInfo.full_name) {
            const email = normalizeName(userInfo.full_name) + (userInfo.dob ? userInfo.dob.replace(/-/g, '').slice(-4) : '') + '@imap.mailix.vn';
            entityInfo.value.personal_email = userInfo.personal_email;
            entityInfo.value.email = email;
        }
    }
    watch(createModal, async (newVal) => {
            console.log('modalCreateType changed to', modalCreateType.value === 'account');
            if (modalCreateType.value === 'account') {
                await defaultEmail();
            } else {
                entityInfo.value.email = '';
            }
            entityInfo.value.name = '';
            entityInfo.value.username = '';
            entityInfo.value.password = '99999999999';
            // entityInfo.value.confirm_password = '';
            entityInfo.value.phone = '';
            entityInfo.value.description = '';
            entityInfo.value.department_type = '';
            entityInfo.value.code = '';
        })

    const entityInfo = ref({
        name:'',
        username: '',
        password: '',
        // confirm_password: '',
        email: '',
        personal_email: '',
        phone: '',
        description: '',
        department_type: '',
    })
    const department_types = [
        {label: t('Company branch'), value: 1},
        {label: t('Department'), value: 2},
    ]
    const errors = ref({})
    const schema = yup.object({
        username:  yup.string().required(t('This field is required')),
        // name: !checkView('name') ? yup.string().required(t('This field is required')) : yup.mixed().notRequired(),
        email:  yup.string().email(t('Invalid email format')).required(t('This field is required')),
        personal_email: yup.string().email(t('Invalid email format')).required(t('This field is required')),
        password: yup.string().min(6, t('Password must be at least 6 characters')).required(t('This field is required')),
        // confirm_password: checkView('confirm_password') ? yup.string()
        //     .oneOf([yup.ref('password'), null], t('Passwords must match'))
        //     .required(t('This field is required')) : yup.mixed().notRequired(),
    })
    const createAccount = async () => {
        console.log('create account Data', entityInfo.value)
        try {
            const {data: response, error: errorVal} = await useAPI().post(`core/profile_hrs/${useRoute().params.id}/create_account/`, {
                username: entityInfo.value.username,
                password: '',
                email: entityInfo.value.email,
                authen_email: entityInfo.value.personal_email,
                // confirm_password: entityInfo.value.confirm_password,
            });
            console.log('response', response.value)
            if (response.value && response.value.id) {
                return true;
            }
            console.log('errorVal', errorVal.value.data)
            if (errorVal.value.statusCode === 400 && errorVal.value.data) {
                const errorData = errorVal.value.data.detail;
                throw new Error(t(errorData));
            }
            else {
                throw new Error(t('Unexpected response status'));
            }
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }
    const createTitle = async () => {
        console.log('create title Data', entityInfo.value)
        try {
            const {data: response} = await useAPI().post(`core/titles/`, {
                name: entityInfo.value.name,
                code: entityInfo.value.code,
                description: entityInfo.value.description,
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
        console.log('create department Data', entityInfo.value)
        try {
            const {data: response} = await useAPI().post(`system/departments/`, {
                name: entityInfo.value.name,
                code: entityInfo.value.code,
                description: entityInfo.value.description,
                department_type: entityInfo.value.department_type,

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
            await schema.validate(entityInfo.value, { abortEarly: false });
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
    }
    const onSubmit = async () => {
        const isValid = await validateForm(); 
        if (!isValid) return;
        try {
            busy.value = true;
            let isCreated = false;

            if (modalCreateType.value === 'account') {
                isCreated = await createAccount();
            } else if (modalCreateType.value === 'title') {
                isCreated = await createTitle();
            } else if (modalCreateType.value === 'department') {
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
                setCreateModal(false, '');
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
