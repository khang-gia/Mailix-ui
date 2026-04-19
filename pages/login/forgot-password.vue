<template>
    <div class=" h-full transition-all duration-500 hover:scale-[1.02] space-y-12">
        <h1 class="text-2xl font-medium text-left font-averta text-black">{{ $t('Reset password.') }}</h1>
        <p class="text-center text-gray-500 mb-5"></p>
        <form v-if="viewMode ==='forgot-password'" novalidate="novalidate" class="space-y-4 md:space-y-6" @submit.prevent="onSubmitEmail">
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('Enter your email') }}</label>
                <div class="relative">
                    <input name="email" id="email" type="email" v-model="email"
                        class="pl-10 py-2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#0313B0] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#0313B0] dark:focus:border-blue-500"
                        placeholder="Email" required="">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UIcon name="heroicons:envelope" class="w-5 h-5 text-gray-400"></UIcon>
                    </div>
                </div>
            </div>
            <div>
                <BaseButton
                    :busy="busy"
                    :disabled="!email"
                    type="submit"
                    class="mb-2 w-full text-white bg-[#0313B0] hover:bg-[#020B51] disabled:hover:bg-[#0313B0] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm disabled:opacity-75"
                    text="Tiếp theo"></BaseButton>
            </div>
            <a href="/login" class="text-sm text-[#0313B0] hover:underline">{{ $t('Back to login') }}</a>
            
        </form>
        <form v-else-if="viewMode === 'reset-password'" class="space-y-4 md:space-y-6" @submit.prevent="onSubmitOtp">
            <div class="text-slate-800 dark:text-white text-sm">
                <p>{{ $t('Please enter the code we sent you via email') }}<strong>{{ email }}</strong>.
                Mã OTP có hiệu lực trong vòng 2 phút.
                </p>
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('New password') }}</label>
                <input type="password" name="password" id="password" placeholder="••••••••" v-model="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="">
            </div>
            <div>
                <FormOTPInput :length="OTP_LENGTH" @input="onOTPReady"></FormOTPInput>
            </div>
            <BaseButton
                type="submit"
                class="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm"
                :busy="busy"
                :disabled="inputOtp.length<OTP_LENGTH"
            text="Xác nhận"></BaseButton>
            
            <div class="w-full flex items-center justify-between text-sm">
                <button
                type="button"
                @click.stop="resendOtp"
                :disabled="timeout>0"
                class="font-medium enabled:text-primary-600 disabled:text-grey-500 hover:underline">
                Gửi lại mã
                <span v-if="timeout>0">({{ timeout }}s)</span>
                </button>
            </div>
        
        </form>        
        <p class="text-xs text-gray-400 text-center mt-4">© 2025 Mailix. All rights reserved.</p>

    </div>
    
</template>

<script setup>
definePageMeta({
  title: 'ĐĂNG NHẬP',
})
const emit = defineEmits(['on-signin', 'after-submit', 'on-reset-password'])
const viewMode = ref('forgot-password')
const email = ref('')
const snackbar = useMySnackBar()
const busy = ref(false)
const password = ref('')
  
const OTP_LENGTH = 6
const inputOtp = ref('')
const username = ref('')
const sendOtp = async (info) => {
    const { data, error } = await useAPI().post('/auth/otp/generate_email/', info)
    console.log('## sendOtp', data)
    if (data) {
        username.value = data.value.username
    }
    if (error.value) {
        throw error.value
    }

    return data.value
}

const onSubmitEmail = async () => {
    try {
        busy.value = true
        const res = await sendOtp({
            email: email.value,
            view: 'resetpassword'
        })
        console.log(res)
        snackbar.success('Một Email đã được gửi tới hộp thư của bạn. Vui lòng kiểm tra và nhập mã OTP để khôi phục mật khẩu.')
        // emit('on-reset-password', {
        //     email: email.value,
        // })
        viewMode.value = 'reset-password'
    }
    catch (err) {
        console.log('## error', err)
        const msg = Object.values(err.data).join(' | ')

        snackbar.error(msg, 'Tạo OTP thất bại!')
    }
    busy.value = false
}

const verify = async (email,username, password, code) => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/reset_password/', {
        email,
        username,
        password,
        code
    })
    
    busy.value = false
    if (error.value) {
        throw error.value
    }
    return data.value
}
const resendOtp = async () => {
    busy.value = true
    const { data, error } = await useAPI().post('/auth/otp/generate_email/', {
        email: email,
    })
    busy.value = false
    
    console.log('## resendOtp', data.value)
    if (data.value) {
        username.value = data.value.username
    }
    
    if (error.value) {
        snackbar.error('Hiện tại không thể gửi OTP. Vui lòng thử lại sau.', 'Gửi thất bại!')
    } else {
        snackbar.success('Gửi OTP thành công!')
        resendCountdown()
    }
  
}
let countdownHandler = null
const timeout = ref(0)
const resendCountdown = () => {
    timeout.value = 120
    clearInterval(countdownHandler)
    countdownHandler = setInterval(() => {
    timeout.value --
    }, 1000)
}
function resetCountdown () {
    timeout.value = 0
    clearInterval(countdownHandler)
}
const onSubmitOtp = async () => {
    try {
    const res = await verify(
        email.value,
        username.value,
        password.value,
        inputOtp.value
    )
    snackbar.success('Mật khẩu đã được khôi phục thành công!')
    resetCountdown()
    navigateTo('/login')
    }
    catch (err) {
    console.log('## error', err)
    const msg = Object.values(err.data).join(' | ')
    snackbar.error(msg, 'Xác thực thất bại!')
    }
}
const onOTPReady = (value) => {
    inputOtp.value = value
    if (value.length == OTP_LENGTH) {
        onSubmitOtp()
    }
      
}
const clearForm = () => {
    inputOtp.value = ''
    password.value = ''
    email.value = ''
}

onUnmounted(() => {
    clearForm()
})

defineExpose({
    clearForm
})
</script>