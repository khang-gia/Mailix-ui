<template>
    <BaseModal :title="title" :modalOpen="modalOpen" :closeOnClick="false" :closeOnEsc="false" @close-modal="closeModal">
        <div class="p-5">
            <FormSignin v-if="authMode==='signin'" ref="signInForm" @on-signup="changeMode('signup')" @on-otp-verify="onOtpVerify" @after-submit="closeModal()" @on-forgot-password="changeMode('forgot-password')"/>
            <!-- <FormSignup v-if="authMode==='signup'" ref="signUpForm" @on-signin="changeMode('signin')" @on-otp-verify="onOtpVerify" @after-submit="closeModal()"/> -->
            <FormForgotPassword v-if="authMode==='forgot-password'" @on-signin="changeMode('signin')" @after-submit="closeModal()" @on-reset-password="onResetPassword"/>
            <FormResetPassword v-if="authMode==='reset-password'" @after-submit="changeMode('signin')" :data="data"/>
            <FormOTPVerify v-if="authMode==='otp-verify'" @on-signin="changeMode('signin')" @after-submit="closeModal()" :data="data"/>
        </div>
    </BaseModal>
</template>

<script setup>
    const props = defineProps(['id', 'modalOpen', 'authMode', 'data'])
    const emit = defineEmits(['close-modal', 'change-mode'])

    const title = ref('')
    const signInForm = ref()
    const signUpForm = ref()

    const closeModal = () => {
        if (props.authMode === 'otp-verify') {
            reloadNuxtApp()
        }
        emit('close-modal')
    }

    const changeMode = (m) => {
        emit('change-mode', m)
    }

    const onOtpVerify = (param) => {
        console.log('onOtpVerify', param)
        emit('change-mode', 'otp-verify', param)
    }
    const onResetPassword = (param) => {
        emit('change-mode', 'reset-password', param)
    }

    const getTitle = (mode) => {
        switch (mode) {
            case 'signin':
                return 'Đăng nhập'
            case 'signup':
                return 'Đăng ký'
            case 'otp-verify':
                return 'Xác thực OTP'
            case 'forgot-password' || 'reset-password':
                return 'Đặt lại mật khẩu'
            default:
                return ''
        }
    }

    onMounted(() => {
        title.value = getTitle(props.authMode)
    })

    watch(() => props.authMode, (val) => {
        title.value = getTitle(val)
    })


</script>
